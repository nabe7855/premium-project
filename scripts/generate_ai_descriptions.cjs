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

async function generateAIDescriptionForHotel(hotel) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const rawDesc = hotel.raw_description || '基本データのみ';
  const prompt = `
以下のホテルの紹介文ライターとなり、300〜500文字の魅力的な紹介文を本文のみ作成してください。
ホテル名: ${hotel.name}
住所: ${hotel.address || ''} 
生データ: ${rawDesc}

【ルール】
- 改行を適切に入れ、読みやすく。
- 情緒的で高級感のある表現。
- 紹介文のみを出力。Markdown禁止。
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text;
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
  console.log('🚀 AI紹介文生成開始（安全モード 1.2）');

  while (true) {
    const hotels = await prisma.lh_hotels.findMany({
      where: { ai_description: { equals: null } },
      take: 1, // 確実性を高めるための1件ずつ処理
    });

    if (hotels.length === 0) break;

    for (const hotel of hotels) {
      console.log(`[${new Date().toLocaleTimeString()}] 🏢 ${hotel.name} 処理中...`);

      const desc = await generateAIDescriptionForHotel(hotel);

      if (desc && desc.length > 50) {
        try {
          await prisma.lh_hotels.update({
            where: { id: hotel.id },
            data: {
              ai_description: desc,
              updated_at: new Date(),
            },
          });
          console.log(`  ✨ AI紹介文完了 (${desc.length}字)`);
        } catch (dbError) {
          console.error(`  ❌ DB保存エラー: ${dbError.message}`);
        }
      }

      await sleep(10000); // 10秒待機
    }
  }
}

main();
