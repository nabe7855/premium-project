const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const prisma = new PrismaClient();
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateAIReviewsForHotel(hotel) {
  // 使用可能なモデルに変更
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const snippets = hotel.review_snippets ? JSON.stringify(hotel.review_snippets) : '基本情報のみ';
  const prompt = `
以下の情報から、信憑性の高いホテル口コミ3件をJSON配列で作成してください。
ホテル名: ${hotel.name}
住所: ${hotel.address || ''} 
既存情報: ${snippets}

【条件】
- 自然な日本語。
- 1件300字程度。
- [{"userName":"...","rating":5,"cleanliness":5,"service":5,"design":5,"facilities":5,"value":5,"content":"...","stayType":"lodging","date":"2024-10-15"}] という形式のみを出力。Markdown禁止。
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonString = text
      .replace(/```json/gi, '')
      .replace(/```/gi, '')
      .trim();
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    if (error.status === 429 || error.message?.includes('429')) {
      console.warn('⚠️ レート制限! 65秒待機します...');
      await sleep(65000);
      return null;
    }
    console.error(`❌ エラー: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 AI口コミ生成開始（安全モード 1.2）');

  while (true) {
    const hotels = await prisma.lh_hotels.findMany({
      where: {
        review_snippets: { not: null },
        reviews_list: { none: { is_verified: true, is_cast: false } },
      },
      take: 1, // 1件ずつ処理して確実性を高める
    });

    if (hotels.length === 0) break;

    for (const hotel of hotels) {
      console.log(`[${new Date().toLocaleTimeString()}] 🏢 ${hotel.name} 処理中...`);

      const reviews = await generateAIReviewsForHotel(hotel);

      if (reviews) {
        try {
          await prisma.$transaction(
            reviews.map((r) =>
              prisma.lh_reviews.create({
                data: {
                  id: require('crypto').randomUUID(),
                  hotel_id: hotel.id,
                  user_name: r.userName || 'ゲスト',
                  rating: r.rating || 5,
                  cleanliness: r.cleanliness || 5,
                  service: r.service || 5,
                  design: r.design || 5,
                  facilities: r.facilities || 5,
                  value: r.value || 5,
                  content: r.content,
                  stay_type: r.stayType || 'lodging',
                  review_date: new Date(r.date || Date.now()),
                  is_verified: true,
                  is_cast: false,
                  created_at: new Date(),
                },
              }),
            ),
          );
          console.log(`  ✨ 3件完了`);
        } catch (e) {
          console.error(`  ❌ DB保存エラー: ${e.message}`);
        }
      }

      // レート制限回避のため10秒待機
      await sleep(10000);
    }
  }
}

main();
