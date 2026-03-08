const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const prisma = new PrismaClient();

const API_KEYS = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter((key) => !!key);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('🚀 AI生成開始（安定版）');

  while (true) {
    // 確実に「まだ終わっていないもの」をクレイジーなほどシンプルに検索
    const allHotels = await prisma.lh_hotels.findMany({
      where: {
        review_snippets: { not: null },
      },
      select: { id: true, name: true, ai_description: true },
      take: 100,
    });

    let target = null;
    for (const h of allHotels) {
      const rCount = await prisma.lh_reviews.count({
        where: { hotel_id: h.id, is_verified: true },
      });
      if (!h.ai_description || rCount === 0) {
        target = h;
        break;
      }
    }

    if (!target) {
      console.log('✅ 完了');
      break;
    }

    console.log(`\n🏢 ${target.name} (ID: ${target.id}) の処理を開始...`);

    for (let i = 0; i < API_KEYS.length; i++) {
      const model = new GoogleGenerativeAI(API_KEYS[i]).getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      try {
        // ステータス再取得
        const current = await prisma.lh_hotels.findUnique({ where: { id: target.id } });
        const currentRCount = await prisma.lh_reviews.count({
          where: { hotel_id: target.id, is_verified: true },
        });

        if (!current.ai_description) {
          console.log(`  [Key-${i}] 紹介文を作成中...`);
          const res = await model.generateContent(
            `${current.name}の300文字以上の魅力的な紹介文。本文のみ。`,
          );
          await prisma.lh_hotels.update({
            where: { id: current.id },
            data: { ai_description: res.response.text().trim() },
          });
          console.log('  ✓ 紹介文完了');
          await sleep(65000);
          continue;
        }

        if (currentRCount === 0) {
          console.log(`  [Key-${i}] 口コミを作成中...`);
          const res = await model.generateContent(
            `${current.name}の口コミ3件を[{"userName":"...","rating":5,"content":"..."}]形式のJSONで。`,
          );
          const reviews = JSON.parse(
            res.response
              .text()
              .replace(/```json/gi, '')
              .replace(/```/gi, '')
              .trim(),
          );
          await prisma.$transaction(
            reviews.map((r) =>
              prisma.lh_reviews.create({
                data: {
                  id: require('crypto').randomUUID(),
                  hotel_id: current.id,
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
          console.log('  ✓ 口コミ完了');
          await sleep(65000);
        }
      } catch (e) {
        console.error(`  ❌ [Key-${i}] エラー: ${e.message}`);
        await sleep(10000);
      }

      const finalH = await prisma.lh_hotels.findUnique({ where: { id: target.id } });
      const finalR = await prisma.lh_reviews.count({
        where: { hotel_id: target.id, is_verified: true },
      });
      if (finalH.ai_description && finalR > 0) break;
    }
  }
}

main();
