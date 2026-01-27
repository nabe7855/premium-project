'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { StoreTopPageConfig } from './storeTopConfig';

export async function saveStoreTopConfig(storeSlug: string, config: StoreTopPageConfig) {
  try {
    // 店舗を取得
    console.log(`[saveStoreTopConfig] Finding store with slug: ${storeSlug}`);
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
    });

    if (!store) {
      console.error(`[saveStoreTopConfig] Store not found: ${storeSlug}`);
      return { success: false, error: '店舗が見つかりません' };
    }
    console.log(`[saveStoreTopConfig] Found store: ${store.name} (${store.id})`);

    // 更新または新規作成 (upsert)
    console.log(`[saveStoreTopConfig] Upserting config for store_id: ${store.id}`);

    await prisma.storeTopConfig.upsert({
      where: { store_id: store.id },
      update: {
        config: config as any,
      },
      create: {
        store_id: store.id,
        config: config as any,
      },
    });

    // ページをrevalidate
    revalidatePath(`/store/${storeSlug}`);
    console.log(`Successfully saved config for ${storeSlug}`);

    return { success: true };
  } catch (error) {
    console.error('Unexpected error saving store top config:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}
