'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { StoreTopPageConfig } from './storeTopConfig';

export async function saveStoreTopConfig(storeSlug: string, config: StoreTopPageConfig) {
  try {
    // まず店舗を取得
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true },
    });

    if (!store) {
      console.error('Store not found:', storeSlug);
      return { success: false, error: 'Store not found' };
    }

    // 更新または新規作成 (upsert)
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

    return { success: true };
  } catch (error) {
    console.error('Unexpected error saving store top config:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}
