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

  const prompt = `あなたは高級ホテルやレジャーホテルの魅力を伝えるプロのコピーライターです。
ターゲット（カップル）がそのホテルの扉を開ける瞬間の高揚感を想起させるような、100%オリジナルで情緒的な紹介文を生成してください。

【厳守事項：脱・テンプレート】
- 「都会の喧騒を離れ」「落ち着いた空間」「至福のひととき」といった使い古された表現（クリシェ）から書き始めるのを禁止します。
- ホテルの「名称」から連想されるコンセプトを文章のテーマに据えてください（例：名前が「バリ」なら南国リゾート、「ZEN」なら和モダンなど）。
- 設備リスト（${amenitiesText}）の中から、そのホテル最大の特徴を1〜2個選び、その設備があることで「二人の時間がどう変わるか」を具体的に描写してください。
- 文の構造を多様化させ、リズムを作ってください。

【入力データ】
ホテル名: ${hotelData.hotel_name}
住所: ${hotelData.address}
価格帯: ${pricesText}
設備(アメニティ): ${amenitiesText}
既存の口コミ参考: ${rawReviews.slice(0, 500)}

【出力形式(JSONのみ、マークダウン不可、他テキスト一切含めないこと)】
{
  "ai_description": "250文字〜400文字。ホテルの名前にふさわしい独創的な書き出しから始め、具体的な設備体験を情緒的に描写した紹介文。",
  "ai_summary": "40文字以内。そのホテルの個性が一目で伝わる、鋭く魅力的なキャッチコピー。",
  "ai_pros_cons": {
    "pros": ["そのホテルの設備や立地に直結した具体的なメリット3つ"],
    "cons": ["情緒を損なわない範囲での、あえて挙げるならという懸念点1つ"]
  },
  "ai_reviews": [
    {"userName": "具体的なペア名（例：サウナ好きカップル、記念日の二人など）", "content": "特定の設備（お風呂の広さやアメニティの質等）に具体的に触れた、サクラっぽくないリアルな感想", "rating": 5},
    {"userName": "自然なユーザー名", "content": "立地やシステム、価格など、利用者が実際に気にするポイントに触れた感想", "rating": 4}
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
