'use server';

import { prisma } from '@/lib/prisma';
import { DEFAULT_STORE_TOP_CONFIG } from './storeTopConfig';

export async function getStoreTopConfig(storeSlug: string) {
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

    // 店舗トップ設定を取得
    const config = await prisma.storeTopConfig.findUnique({
      where: { store_id: store.id },
    });

    if (!config) {
      // 設定が見つからない場合はデフォルト値を返す(ディープコピー)
      return { success: true, config: JSON.parse(JSON.stringify(DEFAULT_STORE_TOP_CONFIG)) };
    }

    // Prisma の Json 型を StoreTopPageConfig にキャスト
    return { success: true, config: config.config as any };
  } catch (error) {
    console.error('Unexpected error fetching store top config:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}
