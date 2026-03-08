const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const prisma = new PrismaClient();
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('No GEMINI_API_KEY');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateReview(hotel) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const snippets = hotel.review_snippets ? JSON.stringify(hotel.review_snippets) : '基本情報のみ';
  const prompt = `以下の情報から信憑性の高いホテル口コミ3件をJSON配列形式で作成してください。
ホテル名: ${hotel.name}
住所: ${hotel.address || ''} 
既存情報: ${snippets}
[{"userName":"...","rating":5,"cleanliness":5,"service":5,"design":5,"facilities":5,"value":5,"content":"...","stayType":"lodging","date":"2024-10-15"}] というJSON配列のみを出力。Markdown禁止。`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonString = text
      .replace(/```json/gi, '')
      .replace(/```/gi, '')
      .trim();
    return JSON.parse(jsonString);
  } catch (e) {
    console.error(`  Review Generation Error: ${e.status || e.message}`);
    if (e.status === 429) await sleep(65000);
    return null;
  }
}

async function generateDesc(hotel) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `以下のホテルの紹介文ライターとなり、300〜500文字の紹介文を作成してください。
ホテル名: ${hotel.name}
住所: ${hotel.address || ''} 
生データ: ${hotel.raw_description || 'なし'}
紹介文本文のみ。Markdown禁止。`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (e) {
    console.error(`  Desc Generation Error: ${e.status || e.message}`);
    if (e.status === 429) await sleep(65000);
    return null;
  }
}

async function main() {
  console.log('🚀 AI Generation Unified (Stable Fix) Started');

  while (true) {
    // Both!
    const target = await prisma.lh_hotels.findFirst({
      where: {
        OR: [
          { ai_description: null },
          { reviews_list: { none: { is_verified: true, is_cast: false } } },
        ],
        review_snippets: { not: null }, // Only if snippets exist for reviews
      },
    });

    if (!target) {
      console.log('✅ All tasks finished!');
      break;
    }

    console.log(`\n🏢 Processing: ${target.name} (ID: ${target.id})`);

    // 1. Description if needed
    if (!target.ai_description) {
      console.log('  Generating Description...');
      const desc = await generateDesc(target);
      if (desc && desc.length > 50) {
        await prisma.lh_hotels.update({
          where: { id: target.id },
          data: { ai_description: desc },
        });
        console.log('  ✓ Desc updated');
        await sleep(61000); // 1 RPM safety
      }
    }

    // 2. Reviews if needed
    const hasAiReviews = await prisma.lh_reviews.count({
      where: { hotel_id: target.id, is_verified: true, is_cast: false },
    });

    if (hasAiReviews === 0) {
      console.log('  Generating Reviews...');
      const reviews = await generateReview(target);
      if (Array.isArray(reviews)) {
        await prisma.$transaction(
          reviews.map((r) =>
            prisma.lh_reviews.create({
              data: {
                id: require('crypto').randomUUID(),
                hotel_id: target.id,
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
        console.log('  ✓ 3 reviews created');
        await sleep(61000); // 1 RPM safety
      }
    }

    // Safety overall
    await sleep(5000);
  }
}

main();
