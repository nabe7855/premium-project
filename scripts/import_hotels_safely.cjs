const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();
const CSV_PATH = path.join(__dirname, '..', 'hotels_fukuoka_import.csv');
const crypto = require('crypto');

// 簡易CSVパース関数
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const header = lines[0].split(',').map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let currentVal = '';
    let inQuotes = false;
    const line = lines[i];

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"' && inQuotes && line[j + 1] === '"') {
        // エスケープされたダブルクオート
        currentVal += '"';
        j++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentVal.trim());
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim());

    // ヘッダーとマッピング
    const rowObj = {};
    header.forEach((h, idx) => {
      rowObj[h] = values[idx] || '';
    });
    rows.push(rowObj);
  }
  return rows;
}

async function importHotels() {
  console.log('--- ホテルデータの安全インポート開始 ---');

  // 1. 正しい都道府県IDを取得（福岡県固定）
  const correctPref = await prisma.lh_prefectures.findFirst({
    where: { name: { contains: '福岡' } },
  });

  if (!correctPref) {
    console.error('福岡県データが見つかりません。中断します。');
    return;
  }
  const PREFECTURE_ID = correctPref.id; // " Fukuoka" (スペースなどの変なIDもこれなら確実)
  console.log(`都道府県ID確定: "${PREFECTURE_ID}"`);

  // CSV読み込み
  const fileContent = fs.readFileSync(CSV_PATH, 'utf8');
  const hotels = parseCSV(fileContent); // 自作パーサは値をtrimする仕様なので注意
  console.log(`CSV読み込み完了: ${hotels.length}件`);

  let successCount = 0;
  let errorCount = 0;
  let skipCount = 0;

  // 存在するcity_id, area_idのキャッシュ（無駄なクエリ防止）
  const validCityIds = new Set(
    (await prisma.lh_cities.findMany({ select: { id: true } })).map((c) => c.id),
  );
  const validAreaIds = new Set(
    (await prisma.lh_areas.findMany({ select: { id: true } })).map((a) => a.id),
  );

  for (const row of hotels) {
    try {
      if (!row.hotel_name || !row.website) {
        console.log(`[SKIP] 必須データ不足: ${row.hotel_name}`);
        skipCount++;
        continue;
      }

      // ID検証と補正
      // city_idが正しくない場合、福岡市にフォールバック、それもなければnull
      let cityId = row.city_id;
      if (!validCityIds.has(cityId)) {
        console.warn(`[WARN] 無効なCityID "${cityId}" -> null`);
        cityId = null;
      }

      // area_idが正しくない場合、null
      let areaId = row.area_id;
      if (!validAreaIds.has(areaId)) {
        console.warn(`[WARN] 無効なAreaID "${areaId}" -> null`);
        areaId = null;
      }

      const existing = await prisma.lh_hotels.findFirst({
        where: { website: row.website },
      });

      const hotelData = {
        name: row.hotel_name,
        address: row.address,
        phone: row.phone,
        website: row.website,
        description: row.description,
        min_price_rest: row.min_price_rest ? parseInt(row.min_price_rest) : null,
        min_price_stay: row.min_price_stay ? parseInt(row.min_price_stay) : null,
        prefecture_id: PREFECTURE_ID, // DBから取得した正しいIDを使用
        city_id: cityId,
        area_id: areaId,
        status: 'active',
        image_url: row.image_url || null,
      };

      if (existing) {
        await prisma.lh_hotels.update({
          where: { id: existing.id },
          data: {
            ...hotelData,
            image_url: row.image_url || existing.image_url,
          },
        });
        //console.log(`[UPDATE] ${row.hotel_name}`);
      } else {
        await prisma.lh_hotels.create({
          data: {
            id: crypto.randomUUID(),
            created_at: new Date(),
            ...hotelData,
          },
        });
        //console.log(`[CREATE] ${row.hotel_name}`);
      }
      successCount++;
    } catch (e) {
      console.error(`[ERROR] ${row.hotel_name}: ${e.message}`);
      errorCount++;
    }
  }

  console.log('\n--- インポート結果 ---');
  console.log(`成功: ${successCount}件`);
  console.log(`失敗: ${errorCount}件`);
  console.log(`スキップ: ${skipCount}件`);

  await prisma.$disconnect();
}

importHotels();
