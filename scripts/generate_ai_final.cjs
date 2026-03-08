const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const prisma = new PrismaClient();

const API_KEYS = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter((key) => !!key);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('🚀 AI生成開始！');

  while (true) {
    const hotel = await prisma.lh_hotels.findFirst({
      where: {
        OR: [
          { ai_description: { equals: null } },
          { reviews_list: { none: { is_verified: true } } },
        ],
        review_snippets: { not: null },
      },
    });

    if (!hotel) break;

    console.log(`\n🏢 ${hotel.name} の処理を開始...`);

    for (let i = 0; i < API_KEYS.length; i++) {
      const model = new GoogleGenerativeAI(API_KEYS[i]).getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      try {
        const currentHotel = await prisma.lh_hotels.findUnique({ where: { id: hotel.id } });
        if (!currentHotel.ai_description) {
          console.log(`  [Key-${i}] 紹介文を作成中...`);
          const res = await model.generateContent(`${hotel.name}の300文字以上の紹介文。本文のみ。`);
          const text = res.response.text().trim();
          await prisma.lh_hotels.update({
            where: { id: hotel.id },
            data: { ai_description: text },
          });
          console.log('  ✓ 紹介文を保存');
          await sleep(65000); // 1 RPM
          continue;
        }

        const rExists = await prisma.lh_reviews.findFirst({
          where: { hotel_id: hotel.id, is_verified: true },
        });
        if (!rExists) {
          console.log(`  [Key-${i}] 口コミを作成中...`);
          const res = await model.generateContent(
            `${hotel.name}の口コミ3件を[{"userName":"...","rating":5,"content":"..."}]で。JSONのみ。`,
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
          console.log('  ✓ 口コミ3件を保存');
          await sleep(65000); // 1 RPM
        } else {
          break; // このホテルは完了
        }
      } catch (e) {
        console.error(`  ❌ [Key-${i}] エラー: ${e.message}`);
        await sleep(10000);
      }
    }
  }
}

main();
