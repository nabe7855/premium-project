'use server';

import { prisma } from '@/lib/prisma';

export interface CastData {
  id: string;
  name: string;
  age: number;
  image_url: string;
  profile: string;
  features?: {
    personality?: { name: string } | null;
    appearance?: { name: string } | null;
  } | null;
}

export async function getCastsByStore(storeSlug: string, limit: number = 3) {
  try {
    // 店舗IDを取得
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true },
    });

    if (!store) {
      return { success: false, error: 'Store not found', casts: [] };
    }

    // 店舗に所属するキャストを取得
    const memberships = await prisma.castStoreMembership.findMany({
      where: {
        store_id: store.id,
        end_date: null, // 現在在籍中のキャストのみ
      },
      include: {
        cast: {
          include: {
            features: {
              include: {
                personality: true,
                appearance: true,
              },
            },
          },
        },
      },
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    });

    const casts: CastData[] = memberships.map((membership) => ({
      id: membership.cast.id,
      name: membership.cast.name,
      age: membership.cast.age,
      image_url: membership.cast.image_url,
      profile: membership.cast.profile,
      features: membership.cast.features
        ? {
            personality: membership.cast.features.personality,
            appearance: membership.cast.features.appearance,
          }
        : null,
    }));

    return { success: true, casts };
  } catch (error) {
    console.error('Error fetching casts:', error);
    return { success: false, error: 'Failed to fetch casts', casts: [] };
  }
}
