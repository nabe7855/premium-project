const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const prisma = new PrismaClient();

const DATA_PATH = path.join(__dirname, '..', 'scraped_data_kanagawa.json');

// エリアIDの変換マップ (スクレイピング時の mappedId -> データベースの ID)
const AREA_MAP = {
  'yokohama-station': 'YokohamaStation',
  'shin-yokohama': 'ShinYokohama',
  kannai: 'Kannai',
  motomachi: 'Motomachi',
  minatomirai: 'MinatoMirai',
  totsuka: 'Totsuka',
  kohoku: 'Kohoku',
  kanazawa: 'Kanazawa',
  hodogaya: 'Hodogaya',
  midori: 'Midori',
  'kanagawa-other': 'KanagawaOther',
  ofuna: 'KanagawaOther', // 暫定
};

async function main() {
  console.log('--- 神奈川件ホテルデータ・インポート開始 ---');

  if (!fs.existsSync(DATA_PATH)) {
    console.error(`エラー: ${DATA_PATH} が見つかりません。`);
    return;
  }

  const hotels = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  console.log(`インポート対象: ${hotels.length}件`);

  const kanagawa = await prisma.lh_prefectures.findFirst({
    where: { name: { contains: '神奈川' } },
  });
  const PREF_ID = kanagawa.id;

  const yokohama = await prisma.lh_cities.findFirst({
    where: { prefecture_id: PREF_ID, name: { contains: '横浜' } },
  });
  const CITY_ID = yokohama.id;

  let successCount = 0;
  let errorCount = 0;

  for (const h of hotels) {
    try {
      // 重複チェック (サイトURLで一意とみなす)
      const existing = await prisma.lh_hotels.findFirst({
        where: { website: h.url },
      });

      // エリアIDの変換
      const dbAreaId = AREA_MAP[h.area_id] || 'KanagawaOther';

      const hotelData = {
        name: h.name,
        address: h.address,
        phone: h.tel,
        website: h.url,
        prefecture_id: PREF_ID,
        city_id: CITY_ID, // 今回は横浜メイン
        area_id: dbAreaId,
        status: 'active',
      };

      if (existing) {
        await prisma.lh_hotels.update({
          where: { id: existing.id },
          data: hotelData,
        });
        // console.log(`[UPDATE] ${h.name}`);
      } else {
        await prisma.lh_hotels.create({
          data: {
            id: crypto.randomUUID(),
            created_at: new Date(),
            ...hotelData,
          },
        });
        // console.log(`[CREATE] ${h.name}`);
      }
      successCount++;
    } catch (e) {
      console.error(`[ERROR] ${h.name}: ${e.message}`);
      errorCount++;
    }
  }

  console.log('\n--- インポート結果 ---');
  console.log(`成功: ${successCount}件`);
  console.log(`失敗: ${errorCount}件`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
