import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Configuration for "Purposes" mapping since they are more like "Use Cases" than single keywords
const PURPOSE_KEYWORDS = {
  '女子会': ['女子会', 'レディースプラン', 'ガールズトーク'],
  '誕生日・記念日': ['誕生日', '記念日', 'アニバーサリー', 'birthday', 'anniversary', 'お祝い'],
  '格安・休憩': ['格安', 'リーズナブル', 'ショートタイム', '90分休憩'],
  'イベント・シアター': ['シアター', 'プロジェクター', '大画面', '映画鑑賞', '大画面tv', 'vod'],
  'ビジネス・一人旅': ['ビジネス', '出張', '一人利用', '1人利用', 'シングルルーム', 'テレワーク', 'デスク', 'オフィス'],
  'サウナ・スパ': ['サウナ', '岩盤浴', '露天風呂', 'ジェットバス', 'ブロアバス'],
  'コスプレ': ['コスプレ', '衣装レンタル', '制服', 'ナース', 'メイド'],
  'グルメ・持ち込み': ['持ち込み', '電子レンジ', '持ち込み冷蔵庫', 'ルームサービス', 'デリバリー'],
};

// Words that indicate it's NOT available or it's just nearby
const NEGATIVE_KEYWORDS = [
  'はございません',
  'ありません',
  '不可',
  '禁止',
  '近くに',
  '近隣に',
  '提携の',
  '周辺の',
  '徒歩',
  'コンビニまで',
  '駅まで',
];

async function main() {
  console.log('🚀 [Antigravity Scraper] Get ALL information for hotels...');

  const amenities = await prisma.lh_amenities.findMany();
  const services = await prisma.lh_services.findMany();
  const purposes = await prisma.lh_purposes.findMany();

  const hotels = await prisma.lh_hotels.findMany({
    where: {
      website: {
        not: null,
        contains: 'http',
      },
    },
  });

  console.log(`🏨 Found ${hotels.length} hotels to scan.`);
  let totalUpdated = 0;

  for (const hotel of hotels) {
    try {
      console.log(`\n🔍 Scanning: ${hotel.name} (${hotel.website})`);
      
      const resp = await fetch(hotel.website, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
        signal: AbortSignal.timeout(10000),
      });

      if (!resp.ok) {
        console.log(`  ⚠️ Failed to fetch: HTTP ${resp.status}`);
        continue;
      }

      const rawHtml = await resp.text();
      const bodyText = rawHtml.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmb, '').replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gmb, '');
      const text = bodyText.toLowerCase();

      const foundAmenities = [];
      const foundServices = [];
      const foundPurposes = [];

      // HELPER: Check if keyword exists in a positive context
      const isActuallyPresent = (keyword) => {
        const lowerKeyword = keyword.toLowerCase();
        if (!text.includes(lowerKeyword)) return false;

        // Simple sentence check: capture roughly 20 chars around the keyword
        const index = text.indexOf(lowerKeyword);
        const sentence = text.substring(Math.max(0, index - 20), Math.min(text.length, index + 40));
        
        // If NO negative word is found in the vicinity
        const hasNegative = NEGATIVE_KEYWORDS.some(neg => sentence.includes(neg));
        return !hasNegative;
      };

      // 1. Amenities
      for (const amen of amenities) {
        if (isActuallyPresent(amen.name)) {
          foundAmenities.push(amen.id);
        }
      }

      // 2. Services
      for (const serv of services) {
        if (isActuallyPresent(serv.name)) {
          foundServices.push(serv.id);
        } else if (serv.name.toLowerCase() === 'wi-fi' && (text.includes('wifi') || text.includes('wi fi'))) {
           foundServices.push(serv.id);
        }
      }

      // 3. Purposes
      for (const purp of purposes) {
        const keywords = PURPOSE_KEYWORDS[purp.name] || [purp.name];
        if (keywords.some(k => isActuallyPresent(k))) {
          foundPurposes.push(purp.id);
        }
      }

      if (foundAmenities.length > 0 || foundServices.length > 0 || foundPurposes.length > 0) {
        console.log(` ✅ ${hotel.name}:`);
        console.log(`   - Amenities: ${foundAmenities.length}`);
        console.log(`   - Services: ${foundServices.length}`);
        console.log(`   - Purposes: ${foundPurposes.length} (${foundPurposes.map(pid => purposes.find(p=>p.id===pid).name).join(', ')})`);

        // Transactional update
        await prisma.$transaction([
          prisma.$executeRaw`DELETE FROM lh_hotel_amenities WHERE hotel_id = ${hotel.id}::uuid`,
          prisma.$executeRaw`DELETE FROM lh_hotel_services WHERE hotel_id = ${hotel.id}::uuid`,
          prisma.$executeRaw`DELETE FROM lh_hotel_purposes WHERE hotel_id = ${hotel.id}::uuid`,
          ...foundAmenities.map(aid => prisma.$executeRaw`INSERT INTO lh_hotel_amenities (hotel_id, amenity_id) VALUES (${hotel.id}::uuid, ${aid}::uuid)`),
          ...foundServices.map(sid => prisma.$executeRaw`INSERT INTO lh_hotel_services (hotel_id, service_id) VALUES (${hotel.id}::uuid, ${sid}::uuid)`),
          ...foundPurposes.map(pid => prisma.$executeRaw`INSERT INTO lh_hotel_purposes (hotel_id, purpose_id) VALUES (${hotel.id}::uuid, ${pid}::uuid)`),
        ]);

        totalUpdated++;
      }

    } catch (error) {
       console.log(`  ❌ Error: ${error.message}`);
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n🎉 DONE! Finished scraping ${hotels.length} hotels. ${totalUpdated} updated.`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
