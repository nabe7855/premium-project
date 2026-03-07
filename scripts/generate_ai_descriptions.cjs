const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const prisma = new PrismaClient();
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('CRITICAL: GEMINI_API_KEY not found in process.env');
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);

async function generateHotelDescription(hotelName, rawDescription) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Use 2.5-flash as it's available and working
  const prompt = `
あなたは高級ホテルポータルサイトの編集者です。
以下のホテルの「生データ」を元に、ユーザーが泊まりたくなるような魅力的で清潔感のある紹介文（300文字程度）を作成してください。

【ルール】
- 誇大広告は避け、事実に基づいた魅力（設備、サービス、雰囲気）を強調してください。
- ターゲットは20代〜30代のカップルや、女子会利用の層です。
- 文字化けや不要な記号、他サイトへの誘導などは削除してください。
- 出力は日本語の紹介文のみとしてください。

ホテル名: ${hotelName}
生データ: ${rawDescription}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    if (error.message?.includes('429')) {
      console.warn('Rate limit hit. Waiting...');
      return null;
    }
    console.error(`Error for ${hotelName}:`, error.message);
    return null;
  }
}

async function main() {
  while (true) {
    const hotels = await prisma.lh_hotels.findMany({
      where: {
        raw_description: { not: null },
        ai_description: null,
      },
      take: 10, // Process in small batches
    });

    if (hotels.length === 0) {
      console.log('All hotels processed or no candidates found.');
      break;
    }

    console.log(`Generating AI descriptions for ${hotels.length} hotels...`);

    for (const hotel of hotels) {
      console.log(`Processing: ${hotel.name}...`);
      const aiDesc = await generateHotelDescription(hotel.name, hotel.raw_description);

      if (aiDesc) {
        await prisma.lh_hotels.update({
          where: { id: hotel.id },
          data: { ai_description: aiDesc },
        });
        console.log(`✅ Success: ${hotel.name}`);
        // Sleep for 20 seconds to be safe with free tier rate limits
        await new Promise((resolve) => setTimeout(resolve, 20000));
      } else {
        console.log(`❌ Failed or Skipped: ${hotel.name}`);
        await new Promise((resolve) => setTimeout(resolve, 30000)); // Longer wait on error
      }
    }
    console.log('Batch complete, checking for more...');
  }
  console.log('Processing complete.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
