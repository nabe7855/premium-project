import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const prisma = new PrismaClient();
const GOOGLE_API_KEY =
  process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

// 抽出するキーワードリスト
const KEYWORDS = [
  'サウナ',
  '露天風呂',
  'ジェットバス',
  'Wi-Fi',
  '駐車場',
  '電子レンジ',
  'ルームサービス',
  'クレジットカード',
  '持ち込み冷蔵庫',
  'カラオケ',
  'VOD',
  '加湿器',
  '空気清浄機',
];

async function collectHotelFeatures() {
  const hotels = await prisma.lh_hotels.findMany({
    where: { place_id: { not: null } },
    take: 20,
  });

  const report = [];

  for (const hotel of hotels) {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${hotel.place_id}&fields=name,editorial_summary,reviews&key=${GOOGLE_API_KEY}&language=ja`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      let foundFeatures = [];
      if (data.result) {
        const textToScan = [
          data.result.editorial_summary?.overview || '',
          ...(data.result.reviews?.map((r) => r.text) || []),
        ]
          .join(' ')
          .toLowerCase();

        KEYWORDS.forEach((kw) => {
          if (textToScan.includes(kw.toLowerCase())) {
            foundFeatures.push(kw);
          }
        });
      }

      report.push({
        name: hotel.name,
        features: foundFeatures.length > 0 ? foundFeatures.join(', ') : '情報不足',
      });
    } catch (e) {
      console.error(`Error for ${hotel.name}: ${e.message}`);
    }

    // APIレート制限配慮
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log('--- REPORT_START ---');
  console.log(JSON.stringify(report));
  console.log('--- REPORT_END ---');
}

collectHotelFeatures().finally(() => prisma.$disconnect());
