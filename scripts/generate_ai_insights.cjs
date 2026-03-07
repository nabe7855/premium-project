const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * AIによるホテル紹介文・評判要約の生成
 *
 * 【SEO対策】: 重複コンテンツを避け、独自のキーワード構成で紹介文を再構築
 * 【法対策】: 元の口コミをそのまま載せず、AIが文脈を汲み取って要約・リライトすることで著作権問題を回避
 */
async function generateAIContent(hotel) {
  if (!hotel.raw_description && (!hotel.review_snippets || hotel.review_snippets.length === 0)) {
    console.log(`Skipping ${hotel.name}: No source data.`);
    return;
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
あなたはプロの旅行ライターです。以下のホテルの情報を元に、読者が泊まりたくなるような魅力的な紹介文（SEO最適化済み）と、評判の要約を作成してください。

【ホテル名】: ${hotel.name}
【元の説明/PR】: 
${hotel.raw_description || 'なし'}

【実際の利用者の声（断片）】: 
${JSON.stringify(hotel.review_snippets || [])}

【生成の注意点】:
1. 紹介文(ai_description): 400〜600文字程度。元の文章をそのまま使わず、魅力を再構成してください。
2. 評判サマリー(ai_summary): 3〜4つの箇条書き。
3. メリット・デメリット(ai_pros_cons): JSON形式で{"pros": ["..."], "cons": ["..."]}を出力。
4. 自然な日本語で、誇張しすぎず客観的なトーンを交えてください。

出力フォーマット(JSON):
{
  "description": "...",
  "summary": "...",
  "pros_cons": {"pros": [...], "cons": [...]}
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSONの抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse JSON from AI response');

    const data = JSON.parse(jsonMatch[0]);

    await prisma.lh_hotels.update({
      where: { id: hotel.id },
      data: {
        ai_description: data.description,
        ai_summary: data.summary,
        ai_pros_cons: data.pros_cons,
      },
    });
    console.log(`AI Content Generated for: ${hotel.name}`);
  } catch (e) {
    console.error(`AI Generation Error for ${hotel.name}:`, e.message);
  }
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY is not set in .env');
    return;
  }

  const hotels = await prisma.lh_hotels.findMany({
    where: {
      raw_description: { not: null },
      ai_description: null, // まだ生成していないもの
    },
    take: 5, // テスト用に5件
  });

  console.log(`Generating AI content for ${hotels.length} hotels...`);
  for (const hotel of hotels) {
    await generateAIContent(hotel);
    await new Promise((r) => setTimeout(r, 2000)); // Rate limit safety
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
