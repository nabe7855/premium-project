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

  console.log(`🔍 アメニティ候補: ${amenities.length}件`);
  console.log(`🔍 サービス候補: ${services.length}件`);

  // 2. ホテルの取得 (website URLがあるもの)
  const hotels = await prisma.lh_hotels.findMany({
    where: {
      website: {
        not: null,
        contains: 'http',
      },
    },
  });

  console.log(`🏨 対象ホテル数: ${hotels.length}件`);

  let totalUpdated = 0;

  for (const hotel of hotels) {
    // もしすでにデータがある程度入っている場合はスキップ（今回は全件対象）
    // console.log(`\n🏨 スキャン中: ${hotel.name} (${hotel.website})`);

    try {
      const resp = await fetch(hotel.website, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 10000,
      });
      if (!resp.ok) {
        // console.log(`  ⚠️ ステータスコード: ${resp.status}`);
        continue;
      }
      const rawHtml = await resp.text();
      const html = rawHtml.toLowerCase(); // 検索用に小文字化

      const foundAmenities = [];
      const foundServices = [];

      // アメニティのキーワード検索
      for (const amen of amenities) {
        const keyword = amen.name.toLowerCase();
        if (html.includes(keyword)) {
          foundAmenities.push(amen.id);
        }
      }

      // サービスのキーワード検索
      for (const serv of services) {
        const keyword = serv.name.toLowerCase();
        // WiFiなどの特殊な表記ゆれを一部吸収
        if (
          html.includes(keyword) ||
          (keyword === 'wi-fi' && (html.includes('wifi') || html.includes('wi fi')))
        ) {
          foundServices.push(serv.id);
        }
        // VODなど
        if (
          keyword.includes('ビデオ・オン・デマンド') &&
          (html.includes('vod') || html.includes('ビデオオンデマンド'))
        ) {
          foundServices.push(serv.id);
        }
      }

      if (foundAmenities.length > 0 || foundServices.length > 0) {
        console.log(
          `✅ ${hotel.name}: [A] ${foundAmenities.length}件 / [S] ${foundServices.length}件 発見！`,
        );

        // トランザクションで安全に更新
        await prisma.$transaction([
          prisma.$executeRaw`DELETE FROM lh_hotel_amenities WHERE hotel_id = ${hotel.id}::uuid`,
          prisma.$executeRaw`DELETE FROM lh_hotel_services WHERE hotel_id = ${hotel.id}::uuid`,
          ...foundAmenities.map(
            (aid) =>
              prisma.$executeRaw`INSERT INTO lh_hotel_amenities (hotel_id, amenity_id) VALUES (${hotel.id}::uuid, ${aid}::uuid)`,
          ),
          ...foundServices.map(
            (sid) =>
              prisma.$executeRaw`INSERT INTO lh_hotel_services (hotel_id, service_id) VALUES (${hotel.id}::uuid, ${sid}::uuid)`,
          ),
        ]);

        totalUpdated++;
      }
    } catch (error) {
      // console.log(`  ❌ エラー (${hotel.name}): ${error.message}`);
    }

    // サイトへの負荷軽減のため少し待機
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n🎉 すべての処理が完了しました。更新数: ${totalUpdated}件`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
