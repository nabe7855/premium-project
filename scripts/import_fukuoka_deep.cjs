const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const prisma = new PrismaClient();

const DATA_PATH = path.join(process.cwd(), 'scraped_data_fukuoka_deep.json');

// 福岡のエリアマップ
// スクレイピングデータには 'area' フィールドがある
const AREA_MAP = {
  '天神・中洲・博多': 'Chuo-ku', // 暫定的に中央区へ
  エリア名: 'Hakata-ku',
  // 必要に応じて追加
};

function extractMinPrice(priceStr) {
  if (!priceStr) return null;
  const cleaned = priceStr.replace(/,/g, '');
  const match = cleaned.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function parsePrices(deepPrices) {
  let rest_min_weekday = null;
  let rest_min_weekend = null;
  let stay_min_weekday = null;
  let stay_min_weekend = null;

  deepPrices.forEach((cat) => {
    const isRest = cat.category.includes('休憩');
    const isStay = cat.category.includes('宿泊');

    cat.plans.forEach((plan) => {
      const isWeekend =
        plan.title.includes('土') || plan.title.includes('日') || plan.title.includes('祝');
      const price = extractMinPrice(plan.price);

      if (!price) return;

      if (isRest) {
        if (isWeekend) {
          if (rest_min_weekend === null || price < rest_min_weekend) rest_min_weekend = price;
        } else {
          if (rest_min_weekday === null || price < rest_min_weekday) rest_min_weekday = price;
        }
      } else if (isStay) {
        if (isWeekend) {
          if (stay_min_weekend === null || price < stay_min_weekend) stay_min_weekend = price;
        } else {
          if (stay_min_weekday === null || price < stay_min_weekday) stay_min_weekday = price;
        }
      }
    });
  });

  return {
    rest_price_min_weekday: rest_min_weekday,
    rest_price_min_weekend: rest_min_weekend,
    stay_price_min_weekday: stay_min_weekday,
    stay_price_min_weekend: stay_min_weekend,
    min_price_rest:
      rest_min_weekday && rest_min_weekend
        ? Math.min(rest_min_weekday, rest_min_weekend)
        : rest_min_weekday || rest_min_weekend,
    min_price_stay:
      stay_min_weekday && stay_min_weekend
        ? Math.min(stay_min_weekday, stay_min_weekend)
        : stay_min_weekday || stay_min_weekend,
  };
}

async function main() {
  console.log('--- 福岡件詳細データ・インポート開始 ---');

  if (!fs.existsSync(DATA_PATH)) {
    console.error(`エラー: ${DATA_PATH} が見つかりません。`);
    return;
  }

  const hotels = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  console.log(`インポート対象: ${hotels.length}件`);

  const fukuoka = await prisma.lh_prefectures.findFirst({
    where: { name: { contains: '福岡' } },
  });
  const PREF_ID = fukuoka.id;

  const cities = await prisma.lh_cities.findMany({
    where: { prefecture_id: PREF_ID },
  });
  const fukuokaCity = cities.find((c) => c.name.includes('福岡市')) || cities[0];

  let successCount = 0;
  let errorCount = 0;

  for (const h of hotels) {
    try {
      if (!h.name || h.name.includes('予約プラン一覧：')) {
        // console.log(`[SKIP] Invalid hotel name: ${h.name}`);
        continue;
      }

      const existing = await prisma.lh_hotels.findFirst({
        where: { website: h.url },
      });

      // エリアのマッピング
      let dbAreaId = 'Chuo-ku'; // デフォルトは中央区
      if (h.area) {
        if (h.area.includes('天神') || h.area.includes('中洲')) dbAreaId = 'Chuo-ku';
        else if (h.area.includes('博多')) dbAreaId = 'Hakata-ku';
        else if (h.area.includes('小倉') || h.area.includes('門司')) dbAreaId = 'Kokurakita-ku';
      }

      const parsedPrices = parsePrices(h.prices || []);

      const hotelData = {
        name: h.name,
        address: h.address,
        phone: h.tel,
        website: h.url,
        prefecture_id: PREF_ID,
        city_id: fukuokaCity.id,
        area_id: dbAreaId,
        description: h.prText || h.description,
        room_count: h.roomCount ? parseInt(h.roomCount.replace(/\D/g, ''), 10) : null,
        distance_from_station: h.accessRaw,
        status: 'active',
        ...parsedPrices,
      };

      if (existing) {
        console.log(`[UPDATE] ${h.name} (Area: ${dbAreaId})`);
        await prisma.lh_hotels.update({
          where: { id: existing.id },
          data: hotelData,
        });
      } else {
        console.log(`[CREATE] ${h.name} (Area: ${dbAreaId})`);
        await prisma.lh_hotels.create({
          data: {
            id: crypto.randomUUID(),
            created_at: new Date(),
            ...hotelData,
          },
        });
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
