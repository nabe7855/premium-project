const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const prisma = new PrismaClient();

const API_KEYS = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter((key) => !!key);

if (API_KEYS.length === 0) {
  console.error('APIキーが設定されていません。');
  process.exit(1);
}

const genAIs = API_KEYS.map((key) => new GoogleGenerativeAI(key));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateWithKey(target, keyIndex) {
  const model = genAIs[keyIndex].getGenerativeModel({ model: 'gemini-2.0-flash' });
  const hotelId = target.id;
  const hotelName = target.name;

  try {
    console.log(`[Key-${keyIndex}] 🏢 ${hotelName}: 処理開始...`);

    // 1. 紹介文の生成
    if (!target.ai_description) {
      console.log(`[Key-${keyIndex}] 🏢 ${hotelName}: 紹介文を生成中...`);
      const prompt = `${hotelName}の魅力を300-500文字で紹介する文章を作成。本文のみ。`;
      const result = await model.generateContent(prompt);
      const desc = result.response.text().trim();

      if (desc.length > 50) {
        await prisma.lh_hotels.update({
          where: { id: hotelId },
          data: { ai_description: desc },
        });
        console.log(`[Key-${keyIndex}] ✓ ${hotelName}: 紹介文更新`);
      }
    }

    // 2. 口コミの生成
    const currentReviewCount = await prisma.lh_reviews.count({
      where: { hotel_id: hotelId, is_verified: true, is_cast: false },
    });

    if (currentReviewCount === 0) {
      console.log(`[Key-${keyIndex}] 🏢 ${hotelName}: 口コミを生成中...`);
      const prompt = `${hotelName}の口コミ3件をJSON配列[{"userName":"...","rating":5,"content":"..."}]で作成。本文のみ。`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      const jsonString = text
        .replace(/```json/gi, '')
        .replace(/```/gi, '')
        .trim();
      const reviews = JSON.parse(jsonString);

      if (Array.isArray(reviews)) {
        await prisma.$transaction(
          reviews.map((r) =>
            prisma.lh_reviews.create({
              data: {
                id: require('crypto').randomUUID(),
                hotel_id: hotelId,
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
        console.log(`[Key-${keyIndex}] ✓ ${hotelName}: 口コミ3件完了`);
      }
    }
  } catch (e) {
    console.error(`[Key-${keyIndex}] ❌ ${hotelName} エラー: ${e.message}`);
    if (e.status === 429) {
      console.warn(`[Key-${keyIndex}] ⚠️ レート制限!`);
      await sleep(65000); // ここでキーごとに待機
    }
  }
}

async function main() {
  console.log(`🚀 並列生成開始！ (使用APIキー数: ${API_KEYS.length})`);

  while (true) {
    const targets = await prisma.lh_hotels.findMany({
      where: {
        OR: [
          { ai_description: null },
          { reviews_list: { none: { is_verified: true, is_cast: false } } },
        ],
        review_snippets: { not: null },
      },
      take: API_KEYS.length,
    });

    if (targets.length === 0) {
      console.log('✅ 完了');
      break;
    }

    // Promise.allで並列実行し、終了を待つ
    await Promise.all(targets.map((target, i) => generateWithKey(target, i)));

    console.log(`--- 次のサイクルまで15秒待機 ---`);
    await sleep(15000);
  }
}

main().catch((err) => console.error('FATAL:', err));
