const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const prisma = new PrismaClient();

const API_KEYS = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter((key) => !!key);

const models = API_KEYS.map((key) =>
  new GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-2.0-flash' }),
);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function processHotel(hotel, keyIndex) {
  const model = models[keyIndex];
  try {
    console.log(`[Key-${keyIndex}] 🏢 ${hotel.name}: 処理開始...`);

    // 1. 紹介文
    if (!hotel.ai_description) {
      console.log(`[Key-${keyIndex}]   -> 紹介文を生成中...`);
      const res = await model.generateContent(
        hotel.name + 'の魅力を300文字以上で紹介する文章。本文のみ。',
      );
      const text = res.response.text().trim();
      if (text.length > 50) {
        await prisma.lh_hotels.update({ where: { id: hotel.id }, data: { ai_description: text } });
        console.log(`[Key-${keyIndex}]   ✓ 紹介文完了`);
      }
    }

    // 2. 口コミ
    const reviewsExist = await prisma.lh_reviews.count({
      where: { hotel_id: hotel.id, is_verified: true },
    });
    if (reviewsExist === 0) {
      console.log(`[Key-${keyIndex}]   -> 口コミを生成中...`);
      const res = await model.generateContent(
        hotel.name +
          'の口コミ3件を[{"userName":"...","rating":5,"content":"..."}]で作成。JSONのみ。',
      );
      const json = JSON.parse(
        res.response
          .text()
          .replace(/```json/gi, '')
          .replace(/```/gi, '')
          .trim(),
      );
      await prisma.$transaction(
        json.map((r) =>
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
      console.log(`[Key-${keyIndex}]   ✓ 口コミ3件完了`);
    }
    return true;
  } catch (e) {
    if (e.status === 429) {
      console.warn(`[Key-${keyIndex}] ⚠️ レート制限 (429)。60秒待機してください。`);
    } else {
      console.error(`[Key-${keyIndex}] ❌ エラー (${hotel.name}): ${e.message}`);
    }
    return false;
  }
}

async function main() {
  console.log('🚀 AI Generation Unified (Stabilized Parallel) Starting');

  while (true) {
    // 未完了のホテルをAPIキーの数だけ取得
    const targets = await prisma.lh_hotels.findMany({
      where: {
        OR: [{ ai_description: null }, { reviews_list: { none: { is_verified: true } } }],
        review_snippets: { not: null },
      },
      take: API_KEYS.length,
    });

    if (targets.length === 0) {
      console.log('✅ すべての処理が完了しました');
      break;
    }

    // 各キーで1件ずつ並列実行
    await Promise.all(targets.map((hotel, i) => processHotel(hotel, i)));

    console.log('--- 65秒待機 (全APIキーの制限回復まで) ---');
    await sleep(65000);
  }
}

main().catch((err) => console.error('FATAL:', err));
