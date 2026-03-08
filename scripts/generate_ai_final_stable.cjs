const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const prisma = new PrismaClient();

const API_KEYS = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter((key) => !!key);

const genAIs = API_KEYS.map((key) => new GoogleGenerativeAI(key));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log(`🚀 AI生成開始！使用キー数: ${API_KEYS.length}`);

  while (true) {
    const hotel = await prisma.lh_hotels.findFirst({
      where: {
        OR: [
          { ai_description: null },
          { reviews_list: { none: { is_verified: true, is_cast: false } } },
        ],
        review_snippets: { not: null },
      },
    });

    if (!hotel) break;

    console.log(`\n🏢 ${hotel.name} の処理を開始 (${new Date().toLocaleTimeString()})...`);

    // 両方のキーを使って順次リクエスト (各65秒待機で確実に通す)
    for (let i = 0; i < API_KEYS.length; i++) {
      const model = genAIs[i].getGenerativeModel({ model: 'gemini-1.5-flash' });

      try {
        if (!hotel.ai_description) {
          console.log(`  [Key-${i}] 紹介文を作成中...`);
          const res = await model.generateContent(
            `${hotel.name}の300字以上の魅力的な紹介文。本文のみ。`,
          );
          const text = res.response.text().trim();
          if (text.length > 50) {
            await prisma.lh_hotels.update({
              where: { id: hotel.id },
              data: { ai_description: text },
            });
            console.log(`  ✓ 紹介文を保存しました。`);
            await sleep(65000); // 1リクエストごとに必ず65秒待つ
            continue; // 次のキーで口コミへ
          }
        }

        const rCount = await prisma.lh_reviews.count({
          where: { hotel_id: hotel.id, is_verified: true },
        });
        if (rCount === 0) {
          console.log(`  [Key-${i}] 口コミを作成中...`);
          const res = await model.generateContent(
            `${hotel.name}の口コミ3件を[{"userName":"...","rating":5,"content":"..."}]形式のJSONで。`,
          );
          const jsonText = res.response
            .text()
            .replace(/```json/gi, '')
            .replace(/```/gi, '')
            .trim();
          try {
            const reviews = JSON.parse(jsonText);
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
            console.log(`  ✓ 口コミ3件を保存しました。`);
            await sleep(65000); // 1リクエストごとに必ず65秒待つ
          } catch (e) {
            console.error(`  ❌ JSONパース失敗`);
          }
        }
      } catch (e) {
        if (e.status === 429) {
          console.log(`  ⚠️ レート制限! 65秒待機...`);
          await sleep(65000);
        } else {
          console.error(`  ❌ エラー: ${e.message}`);
        }
      }

      // ホテルの片方が終わっていても、次のキーへ
      if (
        hotel.ai_description &&
        (await prisma.lh_reviews.count({ where: { hotel_id: hotel.id, is_verified: true } })) > 0
      )
        break;
    }

    await sleep(2000); // ループ保護
  }
}

main();
