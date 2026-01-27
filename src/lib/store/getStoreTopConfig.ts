'use server';

import { prisma } from '@/lib/prisma';
import { DEFAULT_STORE_TOP_CONFIG } from './storeTopConfig';

export async function getStoreTopConfig(storeSlug: string) {
  try {
    // まず店舗を取得
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true, name: true },
    });

    if (!store) {
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
    let finalConfig = config.config as any;

    // 🆕 新人キャストを動的に取得して上書き
    try {
      const { getCastsByStore } = await import('@/lib/getCastsByStore');
      const allCasts = await getCastsByStore(storeSlug);
      const newcomers = allCasts
        .filter((c) => c.isNewcomer)
        .sort((a, b) => (b.priority || 0) - (a.priority || 0));

      if (finalConfig.newcomer) {
        finalConfig.newcomer.items = newcomers.map((c) => ({
          id: c.id,
          name: c.name,
          age: c.age ? `${Math.floor(c.age / 10) * 10}代` : '20代',
          height: c.height?.toString() || '170',
          imageUrl: c.mainImageUrl || c.imageUrl || '',
        }));

        // 見出しの人数も動的に更新
        finalConfig.newcomer.heading = `新人セラピスト(${newcomers.length}名)`;
      }
    } catch (e) {
      console.error('[getStoreTopConfig] Error fetching dynamic newcomers:', e);
    }

    return { success: true, config: finalConfig };
  } catch (error: any) {
    console.error(`[getStoreTopConfig] FATAL ERROR for ${storeSlug}:`, error);
    return { success: false, error: 'Unexpected error occurred: ' + error.message };
  }
}
