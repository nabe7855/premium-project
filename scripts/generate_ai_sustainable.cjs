const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const prisma = new PrismaClient();

// APIキーの読み込み
const KEY_1 = process.env.GEMINI_API_KEY;
const KEY_2 = process.env.GEMINI_API_KEY_2;

const API_KEYS = [KEY_1, KEY_2].filter(Boolean);

if (API_KEYS.length === 0) {
  console.error('No API Keys found in .env');
  process.exit(1);
}

const genAIs = API_KEYS.map((k) => new GoogleGenerativeAI(k));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log(`🚀 Sustainable AI Generation Started with ${API_KEYS.length} keys.`);
  console.log(`Setting pace: 15 seconds deep sleep between requests per key.`);

  let hotelIndex = 0;
  let keyPointer = 0;

  while (true) {
    // 未完了のホテルを1件だけ取得
    const hotel = await prisma.lh_hotels.findFirst({
      where: {
        OR: [
          { ai_description: null },
          { reviews_list: { none: { is_verified: true, is_cast: false } } },
        ],
        review_snippets: { not: null },
      },
      orderBy: { created_at: 'asc' }, // 古いものから順に埋めていく
    });

    if (!hotel) {
      console.log('✅ All hotels processed.');
      break;
    }

    const currentKeyIndex = keyPointer % API_KEYS.length;
    const currentAI = genAIs[currentKeyIndex];
    const model = currentAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log(`\n[Key-${currentKeyIndex}] 🏢 Processing: ${hotel.name}`);

    try {
      // 1. 紹介文がない場合
      if (!hotel.ai_description) {
        console.log(`  -> Generating AI Description...`);
        const prompt = `${hotel.name}の300文字程度の魅力的な紹介文を作成してください。`;
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        await prisma.lh_hotels.update({
          where: { id: hotel.id },
          data: { ai_description: text },
        });
        console.log(`  ✨ Description saved.`);
        // API制限を完全にリセットさせるために30秒強待機 (紹介文は重いため)
        await sleep(32000);
      }

      // 2. 口コミがない場合 (再取得して確認)
      const reviewCheck = await prisma.lh_reviews.count({
        where: { hotel_id: hotel.id, is_verified: true },
      });

      if (reviewCheck === 0) {
        console.log(`  -> Generating AI Reviews...`);
        const prompt = `${hotel.name}の口コミ3件を[{"userName":"名","rating":5,"content":"文"}]形式のJSONのみで作成してください。`;
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const jsonStr = text
          .replace(/```json/gi, '')
          .replace(/```/gi, '')
          .trim();
        const reviews = JSON.parse(jsonStr);

        if (Array.isArray(reviews)) {
          await prisma.$transaction(
            reviews.map((r) =>
              prisma.lh_reviews.create({
                data: {
                  id: require('crypto').randomUUID(),
                  hotel_id: hotel.id,
                  user_name: r.userName || 'ゲスト',
                  rating: r.rating || 5,
                  content: r.content,
                  is_verified: true,
                  is_cast: false,
                  created_at: new Date(),
                },
              }),
            ),
          );
          console.log(`  ✨ 3 Reviews saved.`);
        }
        // 紹介文から続けて実行した場合はさらに待機
        await sleep(32000);
      }
    } catch (e) {
      if (e.status === 429) {
        console.warn(`[Key-${currentKeyIndex}] ⚠️ Rate limit hit. Cooling down for 70 seconds...`);
        await sleep(70000);
      } else {
        console.error(`[Key-${currentKeyIndex}] ❌ Error: ${e.message}`);
        await sleep(10000); // 一般的なエラーでも少し待つ
      }
    }

    // キーを交代
    keyPointer++;
    // ループの終わりに最小限のインターバル
    await sleep(2000);
  }
}

main().catch(console.error);
