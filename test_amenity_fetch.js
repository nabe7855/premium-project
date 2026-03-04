import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const prisma = new PrismaClient();
const GOOGLE_API_KEY =
  process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

async function testFetchAmenities() {
  const hotels = await prisma.lh_hotels.findMany({
    where: { place_id: { not: null } },
    take: 3,
  });

  for (const hotel of hotels) {
    console.log(`\n🏨 ホテル: ${hotel.name}`);
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${hotel.place_id}&fields=name,editorial_summary,types,reviews&key=${GOOGLE_API_KEY}&language=ja`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.result) {
      console.log(`  📝 概要: ${data.result.editorial_summary?.overview || 'なし'}`);
      console.log(`  🏷️ タイプ: ${data.result.types?.join(', ')}`);
      // 最初のレビューからキーワードを抽出（サンプル）
      const reviews = data.result.reviews?.map((r) => r.text).join(' ');
      console.log(`  👤 レビューの一部: ${reviews?.substring(0, 100)}...`);
    } else {
      console.log('  ⚠️ データが見つかりませんでした');
    }
  }
}

testFetchAmenities().finally(() => prisma.$disconnect());
