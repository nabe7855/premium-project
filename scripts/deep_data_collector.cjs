const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function getHotelsBatch(limit = 10) {
  const csvPath = path.join(process.cwd(), 'data', 'hotels_enriched_data.csv');
  // すでにURLがあるものを除外するロジックを後で追加
  return await prisma.lh_hotels.findMany({
    take: limit,
    select: { id: true, name: true, address: true },
    orderBy: { id: 'asc' },
  });
}

// 収集したデータを保存する巨大なJSON
const repositoryPath = path.join(process.cwd(), 'data', 'full_reviews_repository.json');

function saveToRepository(hotelId, data) {
  let repo = {};
  if (fs.existsSync(repositoryPath)) {
    repo = JSON.parse(fs.readFileSync(repositoryPath, 'utf8'));
  }
  repo[hotelId] = {
    name: data.name,
    url: data.url,
    amenities: data.amenities,
    all_reviews: data.all_reviews, // ここに全テキストを入れる
    updated_at: new Date().toISOString(),
  };
  fs.writeFileSync(repositoryPath, JSON.stringify(repo, null, 2));
}

async function main() {
  const hotels = await getHotelsBatch(10);
  console.log(`🔍 ${hotels.length}件のディープ・サーチを開始します...`);

  for (const h of hotels) {
    console.log(`\n--- ${h.name} (${h.address}) ---`);
    // 私（AI）が search_web を使って情報を集め、このスクリプトに「手動(または自動)」で流し込むフローをシミュレート
  }
}

// 実行
// main().catch(console.error);
