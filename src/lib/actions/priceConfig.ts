'use server';

import { prisma } from '@/lib/prisma';
import type { EditablePriceConfig, FullPriceConfig } from '@/types/priceConfig';
import { revalidatePath } from 'next/cache';

/**
 * 店舗の料金設定を取得
 */
export async function getPriceConfig(storeSlug: string): Promise<FullPriceConfig | null> {
  try {
    const priceConfig = await prisma.priceConfig.findFirst({
      where: {
        store: {
          slug: storeSlug,
        },
      },
      include: {
        courses: {
          include: {
            plans: {
              orderBy: {
                display_order: 'asc',
              },
            },
          },
          orderBy: {
            display_order: 'asc',
          },
        },
        transport_areas: {
          orderBy: {
            display_order: 'asc',
          },
        },
        options: {
          orderBy: {
            display_order: 'asc',
          },
        },
        campaigns: {
          orderBy: {
            display_order: 'asc',
          },
        },
      },
    });

    if (!priceConfig) {
      return null;
    }

    return priceConfig as unknown as FullPriceConfig;
  } catch (error) {
    console.error('Error fetching price config:', error);
    return null;
  }
}

/**
 * 料金設定を保存
 */
export async function savePriceConfig(
  storeSlug: string,
  config: EditablePriceConfig,
): Promise<{ success: boolean; error?: string }> {
  const startTime = performance.now();
  console.log('--- savePriceConfig START (Prisma) ---', {
    storeSlug,
    counts: {
      courses: config.courses.length,
      transportAreas: config.transport_areas?.length || 0,
      options: config.options?.length || 0,
      campaigns: config.campaigns?.length || 0,
    },
  });

  try {
    // 1. 店舗を取得
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
    });

    if (!store) {
      return { success: false, error: 'Store not found' };
    }

    // Prisma Transaction を使用して一括更新
    await prisma.$transaction(
      async (tx) => {
        const txStartTime = performance.now();
        console.log('[Transaction] Started');

        // 2. PriceConfig を upsert
        const priceConfig = await tx.priceConfig.upsert({
          where: { store_id: store.id },
          update: {
            hero_image_url: config.hero_image_url,
            updated_at: new Date(),
          },
          create: {
            store_id: store.id,
            hero_image_url: config.hero_image_url,
          },
        });
        console.log(
          `[Transaction] Upserted priceConfig (${Math.round(performance.now() - txStartTime)}ms)`,
        );

        const deleteStartTime = performance.now();
        // 3. 既存の関連データを削除
        await tx.course.deleteMany({ where: { price_config_id: priceConfig.id } });
        await tx.transportArea.deleteMany({ where: { price_config_id: priceConfig.id } });
        await tx.priceOption.deleteMany({ where: { price_config_id: priceConfig.id } });
        await tx.campaign.deleteMany({ where: { price_config_id: priceConfig.id } });
        console.log(
          `[Transaction] Deleted old data (${Math.round(performance.now() - deleteStartTime)}ms)`,
        );

        const coursesStartTime = performance.now();
        // 4. 新しいデータを追加
        let totalPlans = 0;
        for (const course of config.courses) {
          const savedCourse = await tx.course.create({
            data: {
              price_config_id: priceConfig.id,
              course_key: course.course_key,
              name: course.name,
              description: course.description,
              icon: course.icon,
              extension_per_30min: course.extension_per_30min,
              designation_fee_first: course.designation_fee_first,
              designation_fee_note: course.designation_fee_note,
              notes: course.notes,
              display_order: course.display_order,
            },
          });

          if (course.plans && course.plans.length > 0) {
            totalPlans += course.plans.length;
            await tx.coursePlan.createMany({
              data: course.plans.map((p) => ({
                course_id: savedCourse.id,
                minutes: p.minutes,
                price: p.price,
                sub_label: p.sub_label,
                discount_info: p.discount_info,
                display_order: p.display_order,
              })),
            });
          }
        }
        console.log(
          `[Transaction] Created courses/plans (Courses: ${config.courses.length}, Plans: ${totalPlans}) (${Math.round(performance.now() - coursesStartTime)}ms)`,
        );

        const otherDataStartTime = performance.now();
        if (config.transport_areas && config.transport_areas.length > 0) {
          await tx.transportArea.createMany({
            data: config.transport_areas.map((t) => ({
              price_config_id: priceConfig.id,
              area: t.area,
              price: t.price,
              label: t.label,
              note: t.note,
              display_order: t.display_order,
            })),
          });
        }

        if (config.options && config.options.length > 0) {
          await tx.priceOption.createMany({
            data: config.options.map((o) => ({
              price_config_id: priceConfig.id,
              name: o.name,
              description: o.description,
              price: o.price,
              is_relative: o.is_relative,
              display_order: o.display_order,
            })),
          });
        }

        if (config.campaigns && config.campaigns.length > 0) {
          await tx.campaign.createMany({
            data: config.campaigns.map((c) => ({
              price_config_id: priceConfig.id,
              title: c.title,
              description: c.description,
              image_url: c.image_url,
              need_entry: c.need_entry,
              accent_text: c.accent_text,
              price_info: c.price_info,
              display_order: c.display_order,
            })),
          });
        }
        console.log(
          `[Transaction] Other data created (${Math.round(performance.now() - otherDataStartTime)}ms)`,
        );
        console.log(
          `[Transaction] Total duration (${Math.round(performance.now() - txStartTime)}ms)`,
        );
      },
      {
        timeout: 30000, // タイムアウトを30秒に延長（デフォルト5秒）
      },
    );

    const totalDuration = Math.round(performance.now() - startTime);
    console.log(`--- savePriceConfig SUCCESS (Prisma) --- Total: ${totalDuration}ms`);

    // キャッシュクリア
    revalidatePath(`/store/${storeSlug}/price`);
    revalidatePath('/admin/admin/price-management');

    return { success: true };
  } catch (error: any) {
    const totalDuration = Math.round(performance.now() - startTime);
    console.error(`Error saving price config (Prisma) after ${totalDuration}ms:`, error);
    return { success: false, error: 'Database error: ' + error.message };
  }
}

/**
 * 画像をSupabase Storageにアップロード
 * @deprecated クライアントサイドでのアップロード (uploadPriceImageClient) に移行しました。
 */
export async function uploadPriceImage(
  formData: FormData,
): Promise<{ success: boolean; url?: string; error?: string }> {
  return {
    success: false,
    error: 'Deprecated. Use client-side upload instead.',
  };
}

/**
 * 管理画面用の全店舗設定を取得
 */

import { StoreConfig } from '@/components/admin/price/types';

export async function getStoreConfigsForAdmin(): Promise<StoreConfig[]> {
  console.log('--- getStoreConfigsForAdmin (Resilient Version) START ---');
  try {
    // 1. Prisma で全店舗を取得（比較用）
    const prismaStores = await prisma.store.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    });
    console.log(`[PriceConfig] prisma.store.findMany count: ${prismaStores.length}`);

    // 2. 全店舗のIDと名前を $queryRaw で取得（型エラーを回避）
    const storesRaw = await prisma.$queryRaw<
      any[]
    >`SELECT id::text as id, name, slug FROM stores ORDER BY name ASC`;
    console.log(`[PriceConfig] Found ${storesRaw.length} stores via raw SQL.`);

    const effectiveStores = storesRaw.length > 0 ? storesRaw : prismaStores;
    console.log(`[PriceConfig] Using ${effectiveStores.length} stores for processing.`);

    const results: StoreConfig[] = [];

    // 2. 1件ずつ詳細を取得（1件壊れていても他を表示できるようにする）
    for (const s of effectiveStores) {
      console.log(`[PriceConfig] Processing Store ID: ${s.id}, Name: ${s.name}`);
      try {
        const fullStore = await prisma.store.findUnique({
          where: { id: s.id },
          include: {
            price_config: {
              include: {
                courses: {
                  include: {
                    plans: {
                      orderBy: { display_order: 'asc' },
                    },
                  },
                  orderBy: { display_order: 'asc' },
                },
                transport_areas: {
                  orderBy: { display_order: 'asc' },
                },
                options: {
                  orderBy: { display_order: 'asc' },
                },
                campaigns: {
                  orderBy: { display_order: 'asc' },
                },
              },
            },
          },
        });

        if (!fullStore) {
          console.log(`[PriceConfig] Store not found in Prisma: ${s.id}`);
          continue;
        }

        const config = fullStore.price_config;
        if (!config) {
          console.log(
            `[PriceConfig] No price_config for store: ${fullStore.name} (${fullStore.id})`,
          );
          results.push({
            id: fullStore.id,
            storeName: fullStore.name,
            slug: fullStore.slug,
            lastUpdated: '未設定',
            courses: [],
            transportAreas: [],
            options: [],
            campaigns: [],
            faqs: [],
          });
          continue;
        }

        console.log(`[PriceConfig] Successfully mapped store: ${fullStore.name}`);
        results.push({
          id: fullStore.id,
          storeName: fullStore.name,
          slug: fullStore.slug,
          lastUpdated: new Date(config.updated_at).toLocaleDateString('ja-JP').replace(/\//g, '.'),
          heroImageUrl: config.hero_image_url || '',
          courses: (config.courses || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            description: c.description || '',
            icon: c.icon || '✨',
            extensionPer30min: c.extension_per_30min,
            designationFees: {
              free: 0,
              first: c.designation_fee_first,
              follow: 0,
              note: c.designation_fee_note,
            },
            notes: c.notes || '',
            plans: (c.plans || []).map((p: any) => ({
              minutes: p.minutes,
              price: p.price,
              subLabel: p.sub_label || '',
              discountInfo: p.discount_info || '',
            })),
          })),
          transportAreas: (config.transport_areas || []).map((t: any) => ({
            id: t.id,
            area: t.area,
            price: t.price ?? 'negotiable',
            label: t.label,
            note: t.note || '',
          })),
          options: (config.options || []).map((o: any) => ({
            id: o.id,
            name: o.name,
            description: o.description || '',
            price: o.price,
            isRelative: o.is_relative,
          })),
          campaigns: (config.campaigns || []).map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description || '',
            imageUrl: c.image_url || '',
            needEntry: c.need_entry || false,
            accentText: c.accent_text || '',
            priceInfo: c.price_info || '',
          })),
          faqs: [],
        });
      } catch (innerError) {
        console.error(`[PriceConfig] Skipping store ID: ${s.id} due to Prisma error:`, innerError);
      }
    }

    console.log(`[PriceConfig] Returning ${results.length} mapped stores.`);
    return results;
  } catch (error: any) {
    console.error('[PriceConfig] Fatal Error in getStoreConfigsForAdmin:', error);
    return [];
  }
}
