const fs = require('fs');
const path = require('path');

function updateHotelFact(hotelId, amenities, reviews) {
  const csvPath = path.join(process.cwd(), 'data', 'hotels_enriched_data.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found');
    return;
  }

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  const header = lines[0];

  const updatedLines = lines.slice(1).map((line) => {
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // 引用符を考慮したカンマ分割
    if (parts[0] === hotelId) {
      // カラム位置: 5: scraped_amenities, 6: scraped_reviews
      parts[5] = `"${amenities.replace(/"/g, '""')}"`;
      parts[6] = `"${reviews.replace(/"/g, '""')}"`;
    }
    return parts.join(',');
  });

  fs.writeFileSync(csvPath, [header, ...updatedLines].join('\n'), 'utf8');
  console.log(`✅ ID: ${hotelId} の事実データをCSVに反映しました。`);
}

// HOTEL D 大宮(ID読み込みが必要)
// 先ほどの検索結果を反映
updateHotelFact(
  '0f2215e7-0443-4294-9efb-e2dd4adc766a',
  'VOD無料, セレクトシャンプー, ウェルカムドリンク, 電子レンジ, 持込用冷蔵庫, 加湿器, 空気清浄機',
  '平均3.18点 / 1000円割引クーポンが好評 / 設備が充実していてリーズナブル / 枕元にコンセントがない点が不評',
);
