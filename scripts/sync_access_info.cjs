
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ACCESS_INFO_PATH = path.join('c:', 'Users', 'nabe7', 'Documents', 'Projects', 'premium-project', 'data', 'raw_hotel_data', 'hotels_access_info.json');

async function main() {
  if (!fs.existsSync(ACCESS_INFO_PATH)) {
    console.error('File not found:', ACCESS_INFO_PATH);
    return;
  }

  const accessData = JSON.parse(fs.readFileSync(ACCESS_INFO_PATH, 'utf8'));
  const hotelIds = Object.keys(accessData);
  console.log(`Total hotels in access info: ${hotelIds.length}`);

  let updatedCount = 0;
  let batch = [];
  const BATCH_SIZE = 50;

  for (const id of hotelIds) {
    const info = accessData[id];
    
    // 1番目の駅をサマリー用に抽出
    let summary = '';
    if (info.stations && info.stations.length > 0) {
      summary = info.stations[0].trim();
    } else if (info.parking) {
      summary = `駐車場あり: ${info.parking}`;
    }

    // 更新処理
    try {
      await prisma.lh_hotels.update({
        where: { id: id },
        data: {
          access_info: info,
          // distance_from_station が空の場合のみ補完（既存データを壊さないため）
          distance_from_station: {
             set: summary || null // もし summary があれば入れる、なければ空にする
          }
        }
      });
      updatedCount++;
      if (updatedCount % 100 === 0) console.log(`Updated ${updatedCount} hotels...`);
    } catch (e) {
      // IDがDBに無い場合はスキップ
      // console.warn(`Hotel ID ${id} not found in DB.`);
    }
  }

  console.log(`Successfully updated ${updatedCount} hotels.`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
