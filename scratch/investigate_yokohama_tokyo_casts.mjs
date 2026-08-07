import { prisma } from '../src/lib/prisma.ts';
import fs from 'fs';

async function investigate() {
  console.log('=== INVESTIGATING CASTS IN YOKOHAMA & TOKYO ===');

  // DBの全キャストを取得
  const allCasts = await prisma.cast.findMany({
    include: {
      stores: {
        include: {
          store: true
        }
      }
    }
  });

  console.log(`Total casts in DB: ${allCasts.length}`);

  // 店舗ごとにキャストをマッピング
  const yokohamaCasts = [];
  const tokyoCasts = [];
  const storeNames = new Set();

  for (const c of allCasts) {
    const storeSlugs = c.stores.map(s => s.store.slug);
    const storeNamesList = c.stores.map(s => s.store.name);
    storeNamesList.forEach(n => storeNames.add(n));

    if (storeSlugs.includes('yokohama') || storeNamesList.some(n => n.includes('横浜'))) {
      yokohamaCasts.push(c);
    }
    if (storeSlugs.includes('tokyo') || storeNamesList.some(n => n.includes('東京'))) {
      tokyoCasts.push(c);
    }
  }

  console.log(`Yokohama casts count in DB: ${yokohamaCasts.length}`);
  console.log(`Tokyo casts count in DB: ${tokyoCasts.length}`);
  console.log('Store names found:', Array.from(storeNames));

  // リポジトリ内の JSON やテキストデータも検索
  // scraped_data 等のファイルがあるか確認
}

investigate().catch(console.error);
