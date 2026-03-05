import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 コストゼロでのアメニティ・設備情報の自動収集を開始します...');

  // 1. マスタデータの取得
  const amenities = await prisma.lh_amenities.findMany();
  const services = await prisma.lh_services.findMany();
  const purposes = await prisma.lh_purposes.findMany();

  const PURPOSE_KEYWORDS = {
    女子会: ['女子会', 'レディースプラン', 'ガールズトーク'],
    '誕生日・記念日': ['誕生日', '記念日', 'アニバーサリー', 'birthday', 'anniversary', 'お祝い'],
    '格安・休憩': ['格安', 'リーズナブル', 'ショートタイム', '90分休憩'],
    'イベント・シアター': ['シアター', 'プロジェクター', '大画面', '映画鑑賞', '大画面tv', 'vod'],
    'ビジネス・一人旅': [
      'ビジネス',
      '出張',
      '一人利用',
      '1人利用',
      'シングルルーム',
      'テレワーク',
      'デスク',
      'オフィス',
    ],
    'サウナ・スパ': ['サウナ', '岩盤浴', '露天風呂', 'ジェットバス', 'ブロアバス'],
    コスプレ: ['コスプレ', '衣装レンタル', '制服', 'ナース', 'メイド'],
    'グルメ・持ち込み': [
      '持ち込み',
      '電子レンジ',
      '持ち込み冷蔵庫',
      'ルームサービス',
      'デリバリー',
    ],
  };

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

  console.log(`🔍 アメニティ候補: ${amenities.length}件`);
  console.log(`🔍 サービス候補: ${services.length}件`);
  console.log(`🔍 利用目的候補: ${purposes.length}件`);

  // 2. ホテルの取得
  const hotels = await prisma.lh_hotels.findMany({
    where: { website: { not: null, contains: 'http' } },
  });

  console.log(`🏨 対象ホテル数: ${hotels.length}件`);
  let totalUpdated = 0;

  for (const hotel of hotels) {
    try {
      const resp = await fetch(hotel.website, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 10000,
      });
      if (!resp.ok) continue;

      const rawHtml = await resp.text();
      const bodyText = rawHtml
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, '')
        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, '');
      const text = bodyText.toLowerCase();

      const foundAmenities = [];
      const foundServices = [];
      const foundPurposes = [];

      const isActuallyPresent = (keyword) => {
        const lowerKeyword = keyword.toLowerCase();
        if (!text.includes(lowerKeyword)) return false;
        const index = text.indexOf(lowerKeyword);
        const sentence = text.substring(Math.max(0, index - 20), Math.min(text.length, index + 40));
        return !NEGATIVE_KEYWORDS.some((neg) => sentence.includes(neg));
      };

      for (const amen of amenities) {
        if (isActuallyPresent(amen.name)) foundAmenities.push(amen.id);
      }

      for (const serv of services) {
        if (isActuallyPresent(serv.name)) {
          foundServices.push(serv.id);
        } else if (
          serv.name.toLowerCase() === 'wi-fi' &&
          (text.includes('wifi') || text.includes('wi fi'))
        ) {
          foundServices.push(serv.id);
        }
      }

      for (const purp of purposes) {
        const keywords = PURPOSE_KEYWORDS[purp.name] || [purp.name];
        if (keywords.some((k) => isActuallyPresent(k))) foundPurposes.push(purp.id);
      }

      if (foundAmenities.length > 0 || foundServices.length > 0 || foundPurposes.length > 0) {
        console.log(
          `✅ ${hotel.name}: [A]${foundAmenities.length} [S]${foundServices.length} [P]${foundPurposes.length}`,
        );

        await prisma.$transaction([
          prisma.$executeRaw`DELETE FROM lh_hotel_amenities WHERE hotel_id = ${hotel.id}::uuid`,
          prisma.$executeRaw`DELETE FROM lh_hotel_services WHERE hotel_id = ${hotel.id}::uuid`,
          prisma.$executeRaw`DELETE FROM lh_hotel_purposes WHERE hotel_id = ${hotel.id}::uuid`,
          ...foundAmenities.map(
            (id) =>
              prisma.$executeRaw`INSERT INTO lh_hotel_amenities (hotel_id, amenity_id) VALUES (${hotel.id}::uuid, ${id}::uuid)`,
          ),
          ...foundServices.map(
            (id) =>
              prisma.$executeRaw`INSERT INTO lh_hotel_services (hotel_id, service_id) VALUES (${hotel.id}::uuid, ${id}::uuid)`,
          ),
          ...foundPurposes.map(
            (id) =>
              prisma.$executeRaw`INSERT INTO lh_hotel_purposes (hotel_id, purpose_id) VALUES (${hotel.id}::uuid, ${id}::uuid)`,
          ),
        ]);
        totalUpdated++;
      }
    } catch (error) {
      // console.log(`  ❌ Error: ${error.message}`);
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  console.log(`\n🎉 すべての処理が完了しました。更新数: ${totalUpdated}件`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
