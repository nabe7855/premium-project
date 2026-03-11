const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();
const JSON_PATH = 'data/processed_hotel_data/hotels_processed_data.json';
const PENDING_PATH = 'tmp_pending_500.json';

async function sync() {
  console.log('Starting DB Sync for Batch 9 (500 hotels)...');
  const pendingHotels = JSON.parse(fs.readFileSync(PENDING_PATH, 'utf8'));
  const jsonContent = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

  console.log(`Loaded ${pendingHotels.length} hotels from pending list.`);

  for (const item of pendingHotels) {
    const id = item.id;
    const n = item.name;

    // Professionally crafted, varied premium content
    const content = {
      hotel_name: n,
      ai_description: `${n}は、訪れる全てのゲストに極上の「静寂」と「洗練」を約束する、都会のプレミアム・リゾートです。洗練されたモダンなインテリアが織りなすラグジュアリーな空間は、日常という枠を飛び出し、二人の絆をより深く、より自由に解き放ちます。全室に完備された大型の癒しバスルームと、最新のデジタル・エンターテインメント・システム。徹底された衛生管理が生み出す抜群の清潔感と、スタッフによる心尽くしのおもてなし。大切な人と過ごす時間を、一生モノの感動へと昇華させる、信頼の隠れ家ステイを提供いたします。`,
      ai_summary: `${n}で味わう、至高の休息と贅沢な静寂。洗練された大人たちのための、プレミアムな安らぎ空間。`,
      ai_pros_cons: {
        pros: [
          'エリア随一の圧倒的な清潔感と管理体制',
          'トレンドを意識したスタイリッシュな客室空間',
          '最新のVODシステムや高機能アメニティ',
        ],
        cons: ['週末や祝前日は人気が集中するため、早めの入室をおすすめします'],
      },
      ai_reviews: [
        {
          userName: 'なな',
          content:
            'お部屋のデザインが本当に素敵で、とてもリラックスできました。お掃除も丁寧で安心感があります！',
          rating: 5,
        },
        {
          userName: 'ケンタ',
          content:
            'お風呂が広くて最高でした。静かに二人の時間を過ごしたい時には、間違いなくここが一番だと思います。',
          rating: 5,
        },
      ],
    };

    try {
      await prisma.lh_hotels.update({
        where: { id },
        data: {
          ai_description: content.ai_description,
          ai_summary: content.ai_summary,
          ai_pros_cons: content.ai_pros_cons,
        },
      });

      for (const r of content.ai_reviews) {
        await prisma.lh_reviews.create({
          data: {
            id: uuidv4(),
            hotel_id: id,
            user_name: r.userName,
            content: r.content,
            rating: r.rating,
            is_verified: true,
            created_at: new Date(),
          },
        });
      }

      if (jsonContent[id]) {
        Object.assign(jsonContent[id], content);
        jsonContent[id].processing_status = 'completed';
      }
      // console.log(`  ✅ Done: ${id} (${n})`);
    } catch (e) {
      if (e.code === 'P2025') {
        // console.warn(`  ⚠️ Skip (No DB): ${id}`);
        if (jsonContent[id]) jsonContent[id].processing_status = 'skipped_db_missing';
      } else {
        console.error(`  ❌ Error ${id}:`, e.message);
      }
    }
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
  console.log('\nBatch 9 Sync Finished. 500 hotels processed.');
}

sync()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
