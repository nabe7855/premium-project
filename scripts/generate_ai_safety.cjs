const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const prisma = new PrismaClient();

const API_KEYS = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter((key) => !!key);

const models = API_KEYS.map((key) =>
  new GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-2.0-flash' }),
);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('🚀 Sequential AI Start (Safety 1 RPM/Key)');

  while (true) {
    const target = await prisma.lh_hotels.findFirst({
      where: {
        OR: [
          { ai_description: null },
          { reviews_list: { none: { is_verified: true, is_cast: false } } },
        ],
        review_snippets: { not: null },
      },
    });

    if (!target) break;

    for (let i = 0; i < models.length; i++) {
      const hotel = await prisma.lh_hotels.findFirst({
        where: {
          OR: [
            { ai_description: null },
            { reviews_list: { none: { is_verified: true, is_cast: false } } },
          ],
          review_snippets: { not: null },
          id: { notIn: [] }, // Actually just take the first
        },
      });

      if (!hotel) break;

      console.log(`[Key-${i}] 🏢 ${hotel.name}: 処理中...`);

      try {
        // 1. Desc
        if (!hotel.ai_description) {
          const res = await models[i].generateContent(
            hotel.name + 'の紹介文を300文字以上で。本文のみ。',
          );
          await prisma.lh_hotels.update({
            where: { id: hotel.id },
            data: { ai_description: res.response.text() },
          });
          console.log(`[Key-${i}] ✓ 紹介文完了`);
        }

        // 2. Reviews
        const rCount = await prisma.lh_reviews.count({
          where: { hotel_id: hotel.id, is_verified: true },
        });
        if (rCount === 0) {
          const res = await models[i].generateContent(
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
          console.log(`[Key-${i}] ✓ 口コミ完了`);
        }
      } catch (e) {
        console.error(`[Key-${i}] ❌ エラー: ${e.message}`);
      }
    }

    console.log('--- 65s 休憩 (API Quota 回復待ち) ---');
    await sleep(65000);
  }
}

main();
