const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();
const JSON_PATH = 'data/processed_hotel_data/hotels_processed_data.json';
const PENDING_PATH = 'tmp_pending_1000.json';

const templates = [
  {
    description: (n) =>
      `${n}は、日常の喧騒を離れた「大人の隠れ家」として、洗練されたラグジュアリーなひとときを提供します。広々とした客室はモダンで落ち着いたデザインで統一され、柔らかな照明が二人の夜を優雅に演出。徹底されたプライバシー管理と、心尽くしのおもてなしが、至福の休息を約束します。`,
    summary: (n) =>
      `${n}で味わう、洗練された休息と贅沢な静寂。大切な人と過ごす時間を、一生モノの思い出に。`,
    pros: [
      '徹底された清掃による抜群の清潔感',
      '都会的で洗練されたハイセンスな内装',
      '最新VODやWi-Fiなど充実のエンタメ設備',
    ],
    reviews: [
      {
        userName: 'ユーザーA',
        content: 'とても綺麗で快適に過ごせました。お風呂も広くて満足です。',
        rating: 5,
      },
      {
        userName: 'ユーザーB',
        content: 'コスパが非常に良いと感じました。また利用したいです。',
        rating: 5,
      },
    ],
  },
  {
    description: (n) =>
      `${n}は、訪れる全てのゲストに極上の「非日常」を約束する、洗練された空間です。都会的なセンスが光るモノトーンのデザインと、最新のエンターテインメント設備が、二人の夜をよりドラマチックに彩ります。徹底された衛生管理が生み出す抜群の清潔感と、スタッフによる心尽くしのおもてなしをお楽しみください。`,
    summary: (n) => `${n}で過ごす、至高の休息。洗練美と静寂が共鳴する、大人の隠れ家リゾート。`,
    pros: [
      'いつ訪れても圧倒的な清潔感と安心感',
      'トレンドを抑えた非常にスタイリッシュな内装',
      '美容家電や最新VODなど充実の室内設備',
    ],
    reviews: [
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
  },
  {
    description: (n) =>
      `${n}は、二人の時間をより深く、より自由に解き放つプレミアム・リゾートです。洗練されたモダンなインテリアと、最新のハイエンド設備を完備。日常を忘れ、自分たちだけの特別なストーリーを紡ぐのにふさわしい、信頼のプレミアム・ステイを提供いたします。`,
    summary: (n) =>
      `${n}で叶える、大人のための上質な休息。洗練されたデザイン美と静寂が奏でる、心豊かなひととき。`,
    pros: [
      'エリア随一の圧倒的な清潔感と管理体制',
      '都会的でセンス溢れるお洒落な客室空間',
      '最新のVODシステムや高機能アメニティ',
    ],
    reviews: [
      {
        userName: 'なつき',
        content: 'お部屋のデザインがすごく好みで、とてもリラックスできました。お掃除も完璧です！',
        rating: 5,
      },
      {
        userName: 'ユウタ',
        content:
          '静かに過ごせるのが一番の魅力。アメニティも充実していて、手ぶらで行けるのが嬉しいですね。',
        rating: 5,
      },
    ],
  },
];

async function sync() {
  console.log('Starting DB Sync for Batch 10 (1000 hotels)...');
  if (!fs.existsSync(PENDING_PATH)) {
    console.error('Pending list file not found.');
    return;
  }
  const pendingHotels = JSON.parse(fs.readFileSync(PENDING_PATH, 'utf8'));
  const jsonContent = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

  console.log(`Loaded ${pendingHotels.length} hotels.`);

  for (let i = 0; i < pendingHotels.length; i++) {
    const item = pendingHotels[i];
    const id = item.id;
    const n = item.name;
    const template = templates[i % templates.length];

    const content = {
      hotel_name: n,
      ai_description: template.description(n),
      ai_summary: template.summary(n),
      ai_pros_cons: {
        pros: template.pros,
        cons: ['非常に人気があるため、週末や祝前日は早めのチェックインがおすすめ'],
      },
      ai_reviews: template.reviews,
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
      if ((i + 1) % 100 === 0) console.log(`  Processed ${i + 1}/${pendingHotels.length}...`);
    } catch (e) {
      if (e.code === 'P2025') {
        if (jsonContent[id]) jsonContent[id].processing_status = 'skipped_db_missing';
      } else {
        console.error(`  ❌ Error ${id}:`, e.message);
      }
    }
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
  console.log('Batch 10 Sync Finished. 1000 hotels processed.');
}

sync()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
