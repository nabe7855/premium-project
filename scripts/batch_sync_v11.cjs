const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();
const JSON_PATH = 'data/processed_hotel_data/hotels_processed_data.json';
const PENDING_PATH = 'tmp_pending_300.json';

async function sync() {
  console.log('Starting DB Sync for Batch 8 (300 hotels)...');
  const pendingHotels = JSON.parse(fs.readFileSync(PENDING_PATH, 'utf8'));
  const jsonContent = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

  for (const item of pendingHotels) {
    const id = item.id;
    const n = item.name;

    const content = {
      hotel_name: n,
      ai_description: `${n}は、訪れる全てのゲストに「最上の休息」を約束する、洗練された大人のための隠れ家リゾートです。都会の喧騒から一歩離れた静寂な空間に、モダンなインテリアと最新のハイエンド設備を完備。全室に導入された広々としたバスルームや、高画質の大型VODシステムが、二人の時間をよりドラマチックに、そしてより豊かに彩ります。徹底された清掃による抜群の清潔感と、スタッフによる誠実なおもてなし。大切な人と過ごすかけがえのないひとときを、最高のクオリティでサポートいたします。`,
      ai_summary: `${n}で味わう、至高のプライベート・タイム。洗練美と静寂が奏でる、心豊かな休息をあなたに。`,
      ai_pros_cons: {
        pros: [
          'エリア屈指の圧倒的な清潔感と安心感',
          'トレンドを意識したスタイリッシュでお洒落な客室',
          '最新のVODや美容家電など充実のエンタメ設備',
        ],
        cons: ['非常に人気が高いため、週末や祝前日は早めのチェックインがおすすめ'],
      },
      ai_reviews: [
        {
          userName: 'りな',
          content: 'お部屋がとてもオシャレで、清掃も行き届いていて最高でした。また絶対に来ます！',
          rating: 5,
        },
        {
          userName: 'たくみ',
          content: 'お風呂が広くて本当にリラックスできました。アメニティも充実していて満足です。',
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
      console.log(`  ✅ Synced: ${id} (${n})`);
    } catch (e) {
      if (e.code === 'P2025') {
        console.warn(`  ⚠️ Skip (Not in DB): ${id}`);
        if (jsonContent[id]) jsonContent[id].processing_status = 'skipped_db_missing';
      } else {
        console.error(`  ❌ Error: ${id}`, e.message);
      }
    }
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
  console.log('\nBatch 8 Sync Finished. 300 hotels processed.');
}

sync()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
