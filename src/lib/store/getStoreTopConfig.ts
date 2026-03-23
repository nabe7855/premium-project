'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { DEFAULT_STORE_TOP_CONFIG } from './storeTopConfig';

export const getStoreTopConfig = cache(async function getStoreTopConfig(storeSlug: string, options: { skipCasts?: boolean } = {}) {
  try {
    const { skipCasts = false } = options;
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
      return { success: true, config: JSON.parse(JSON.stringify(DEFAULT_STORE_TOP_CONFIG)) };
    }

    // Prisma の Json 型を StoreTopPageConfig にキャスト
    let dbConfig = config.config as any;

    // 🆕 ディープマージ関数の定義 (既存のデータを尊重しつつ、不足分をデフォルトで補填)
    function deepMerge(dbVal: any, defaultVal: any) {
      if (!dbVal) return defaultVal;
      if (typeof dbVal !== 'object' || Array.isArray(dbVal)) return dbVal;
      
      const output = { ...defaultVal, ...dbVal };
      
      Object.keys(defaultVal).forEach((key) => {
        if (key in dbVal && typeof dbVal[key] === 'object' && !Array.isArray(dbVal[key])) {
          output[key] = deepMerge(dbVal[key], defaultVal[key]);
        }
      });
      return output;
    }

    // デフォルト値をベースにDBの値をマージする（DBにない項目はデフォルトが使われる）
    // 順番は [DB値] を [デフォルト値] で補完する形
    let finalConfig = deepMerge(dbConfig, DEFAULT_STORE_TOP_CONFIG);

    // 🆕 新人キャストを動的に取得して上書き (店舗トップ以外では不要なため skipCasts ならスキップ)
    if (!skipCasts) {
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
            slug: c.slug,
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
    }

    return { success: true, config: finalConfig };
  } catch (error: any) {
    console.error(`[getStoreTopConfig] FATAL ERROR for ${storeSlug}:`, error);
    return { success: false, error: 'Unexpected error occurred: ' + error.message };
  }
});
