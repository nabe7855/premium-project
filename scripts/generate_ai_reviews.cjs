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

async function generateAIReviewsForHotel(hotel) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // 抽出した断片や基本情報をプロンプトにまとめる
  const snippets = hotel.review_snippets ? JSON.stringify(hotel.review_snippets) : '特になし';

  const prompt = `
あなたは複数の属性を持つユーザーになりきって、高級ホテルポータルサイトに投稿する信憑性の高い口コミを作成するプロンプトエンジニアです。
以下のホテルの「事実の断片（スクレイピングデータ）」と「基本情報」を元に、元の表現は使わずに完全に新しいオリジナルな口コミを3件作成してください。

【ホテル情報】
ホテル名: ${hotel.name}
エリア: ${hotel.prefecture_id || ''} ${hotel.city_id || ''}
既存の口コミ断片: ${snippets}

【作成するペルソナ（3名分）】
1件目: 特別な日にお祝いで宿泊した20代女性 (userName例: さや, ゆき等)
2件目: デートや急な休憩で利用した30代男性 (userName例: ケン, Y.T等)
3件目: デザイン性や清潔感を重視するカップル (userName例: ゲスト, 匿名希望等)

【ルール】
- 著作権に配慮し、元の文章や他サイトのコピペは絶対にしないこと。
- 事実に基づきつつ、体験談として具体的で自然な日本語で書くこと。
- 1件あたり200〜400文字程度。
- 必ず以下のJSON配列形式（Array of Objects）のみを出力してください。Markdownのコードブロック（\`\`\`json など）は絶対に含めず、純粋なJSONテキストだけを返してください。

[
  {
    "userName": "ユーザー名",
    "rating": 5,
    "cleanliness": 5,
    "service": 4,
    "design": 5,
    "facilities": 5,
    "value": 4,
    "content": "口コミの本文...",
    "stayType": "lodging", // または "rest"
    "date": "2024-10-15" // 過去半年以内のランダムな近い日付
  },
  ...
]
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Markdownのコードブロックタグを念のため除去
    const jsonString = text
      .replace(/^```json\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch (error) {
    if (error.message?.includes('429')) {
      console.warn('Rate limit hit. Waiting...');
      return null;
    }
    console.error(`Error for ${hotel.name}:`, error.message);
    return null;
  }
}

async function main() {
  // すでに口コミがあるホテルは除外する（is_verified: true のAI口コミがないホテル）
  const hotels = await prisma.lh_hotels.findMany({
    where: {
      review_snippets: { not: null },
      reviews_list: {
        none: { is_verified: true, is_cast: false }, // AI生成の印としてis_verified=trueを使う
      },
    },
    take: 5,
  });

  console.log(`Generating AI reviews for ${hotels.length} hotels...`);

  for (const hotel of hotels) {
    console.log(`Processing reviews for: ${hotel.name}...`);

    const generatedReviews = await generateAIReviewsForHotel(hotel);

    if (generatedReviews && generatedReviews.length > 0) {
      try {
        const reviewData = generatedReviews.map((r) => ({
          id: require('crypto').randomUUID(),
          hotel_id: hotel.id,
          user_name: r.userName || 'ゲスト',
          rating: r.rating || 4,
          cleanliness: r.cleanliness || 4,
          service: r.service || 4,
          design: r.design || 4,
          facilities: r.facilities || 4,
          value: r.value || 4,
          content: r.content || '最高でした。',
          stay_type: r.stayType || 'rest',
          review_date: r.date ? new Date(r.date) : new Date(),
          is_verified: true,
          is_cast: false,
        }));

        await prisma.lh_reviews.createMany({
          data: reviewData,
        });

        console.log(`✅ Success: Generated ${reviewData.length} reviews for ${hotel.name}`);
        // Gemini API limit (無料枠を少しでも節約するため20秒待機)
        await new Promise((resolve) => setTimeout(resolve, 20000));
      } catch (dbError) {
        console.error(`❌ DB Insert Error for ${hotel.name}:`, dbError.message);
      }
    } else {
      console.log(`❌ Failed or Skipped: ${hotel.name}`);
      await new Promise((resolve) => setTimeout(resolve, 15000));
    }
  }

  console.log('Batch processing complete.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
