const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportToCSV() {
  console.log('📦 既存ホテルの基礎データをCSVに出力中...');

  const hotels = await prisma.lh_hotels.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      raw_description: true, // 既存の紹介文
      review_snippets: true, // 既存のスニペット（あれば）
    },
  });

  const csvHeader =
    'id,name,address,raw_description,review_snippets,scraped_amenities,scraped_reviews\n';
  const csvRows = hotels.map((h) => {
    // カンマや改行をクリーンアップ
    const clean = (str) => {
      if (!str) return '""';
      return `"${String(str).replace(/"/g, '""').replace(/\n/g, ' ')}"`;
    };

    return [
      h.id,
      clean(h.name),
      clean(h.address),
      clean(h.raw_description),
      clean(JSON.stringify(h.review_snippets)),
      '""', // scraped_amenities (後で埋める用)
      '""', // scraped_reviews (後で埋める用)
    ].join(',');
  });

  const filePath = path.join(process.cwd(), 'data', 'hotels_base_data.csv');

  // ディレクトリ作成
  if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'));
  }

  fs.writeFileSync(filePath, csvHeader + csvRows.join('\n'), 'utf8');
  console.log(`✅ CSV出力完了: ${filePath}`);
  console.log(`総ホテル数: ${hotels.length}件`);
}

exportToCSV().catch(console.error);
