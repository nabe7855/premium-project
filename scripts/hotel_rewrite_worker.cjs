const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const prisma = new PrismaClient();
const JSON_PATH = 'data/processed_hotel_data/hotels_processed_data.json';
const API_KEYS = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter(Boolean);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getAIContent(hotelData, keyIndex = 0) {
  if (!API_KEYS[keyIndex]) return null;
  const genAI = new GoogleGenerativeAI(API_KEYS[keyIndex]);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const amenitiesText = hotelData.amenities?.slice(0, 20).join('、') || '情報なし';
  const pricesText = JSON.stringify(hotelData.prices) || '情報なし';
  const rawReviews =
    hotelData.reviews
      ?.slice(0, 3)
      .map((r) => r.body)
      .filter(Boolean)
      .join('\n---\n') || 'なし';

  const prompt = `あなたは高級ホテル/レジャーホテル専門の魅力的な紹介文を書くプロのライターです。
以下のホテルデータを元に、ターゲット（カップル）に刺さる「100%オリジナルで情緒的な」紹介文、要約、メリット・デメリット、そして自然なクチコミを生成してください。

【執筆の極意】
- 既存のテンプレートは絶対に使い回さないでください。
- ホテル名、設備、価格から推測される「このホテルならではの魅力」を具体的に描写してください。
- 特に「露天風呂」「サウナ」「岩盤浴」「大型TV」「VOD」などの人気設備がある場合は、必ず文章中に具体的に触れ、体験をイメージさせてください。
- 住所から立地の良さ（都会の隠れ家感、アクセスの良さ等）も盛り込んでください。

ホテル名: ${hotelData.hotel_name}
住所: ${hotelData.address}
価格帯: ${pricesText}
設備(アメニティ): ${amenitiesText}
既存の口コミ参考: ${rawReviews.slice(0, 500)}

【出力形式(JSONのみ、他テキスト不可)】
{
  "ai_description": "250-400文字程度の魅力的な紹介文。ホテルの設備を具体的に褒め、二人の時間を想起させる内容。",
  "ai_summary": "40文字程度の心を掴むキャッチコピー的な要約。",
  "ai_pros_cons": {
    "pros": ["このホテル独自の具体的な強み1", "設備に関する強み2", "サービスに関する強み3"],
    "cons": ["許容できる弱み（人気ゆえの混雑など）"]
  },
  "ai_reviews": [
    {"userName": "自然なユーザー名", "content": "そのホテルの特定の設備（お風呂の広さやアメニティ等）に具体的に触れた感想", "rating": 5},
    {"userName": "自然なユーザー名", "content": "価格や立地に触れたリアルな感想", "rating": 4}
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response
      .text()
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();
    return JSON.parse(text);
  } catch (err) {
    if (err.status === 429 || err.message.includes('429')) {
      console.log(`  ⚠ Rate limited on Key-${keyIndex}. Waiting for cooldown...`);
      await sleep(65000);
      return getAIContent(hotelData, (keyIndex + 1) % API_KEYS.length);
    }
    console.error(`  ❌ AI Error for ${hotelData.hotel_name}: ${err.message}`);
    return null;
  }
}

async function processBatch(size = 50) {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const pendingIds = Object.keys(data)
    .filter((id) => data[id].processing_status === 'pending')
    .slice(0, size);

  if (pendingIds.length === 0) {
    console.log('No pending hotels.');
    return;
  }

  console.log(`🚀 Starting high-quality original rewrite for ${pendingIds.length} hotels...`);

  for (const id of pendingIds) {
    const hotel = data[id];
    console.log(`\n🏢 Processing: ${hotel.hotel_name}`);

    const ai = await getAIContent(hotel);

    if (ai) {
      try {
        await prisma.lh_hotels.update({
          where: { id: id },
          data: {
            ai_description: ai.ai_description,
            ai_summary: ai.ai_summary,
            ai_pros_cons: ai.ai_pros_cons,
          },
        });

        for (const r of ai.ai_reviews) {
          await prisma.lh_reviews.create({
            data: {
              id: uuidv4(),
              hotel_id: id,
              user_name: r.userName,
              content: r.content,
              rating: r.rating || 5,
              is_verified: true,
              created_at: new Date(),
            },
          });
        }

        data[id].ai_description = ai.ai_description;
        data[id].ai_summary = ai.ai_summary;
        data[id].ai_pros_cons = ai.ai_pros_cons;
        data[id].ai_reviews = ai.ai_reviews;
        data[id].processing_status = 'completed';

        console.log(`  ✅ Success and Synced.`);
        fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));

        // Wait between requests to manage free tier limits
        await sleep(10000);
      } catch (dbErr) {
        if (dbErr.code === 'P2025') {
          console.warn(`  ⚠️ Skip: Not in DB.`);
          data[id].processing_status = 'skipped_db_missing';
        } else {
          console.error(`  ❌ DB Error: ${dbErr.message}`);
          data[id].processing_status = 'error';
        }
      }
    } else {
      console.log(`  ❌ Failed to get AI content.`);
    }
  }
}

const batchSize = process.argv[2] ? parseInt(process.argv[2]) : 50;
processBatch(batchSize)
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\nDone.');
  });
