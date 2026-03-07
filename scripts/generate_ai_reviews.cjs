const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const prisma = new PrismaClient();

// Gemini APIの初期化
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is not set in .env');
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * AIによる「ペルソナ別オリジナル口コミ」の生成
 *
 * 【SEO対策】: 重複コンテンツを避けるため、事実だけを抽出して表現を完全新規作成。
 * 【法対策】: 元のテキストは一切使用せず、AIが「感想の傾向」だけを汲み取る。
 * 【コスト】: Gemini 1.5 Flashの無料枠を活用（1分間15リクエストまで）
 */
async function generateOriginalReviewsForHotel(hotel) {
  // すでに口コミがあるかチェック（重複生成防止）
  const existingReviews = await prisma.lh_reviews.count({
    where: { hotel_id: hotel.id },
  });

  if (existingReviews > 0) {
    console.log(`[SKIP] ${hotel.name}: Already has ${existingReviews} reviews.`);
    return;
  }

  // 元データの確認
  if (!hotel.review_snippets || hotel.review_snippets.length === 0) {
    console.log(`[SKIP] ${hotel.name}: No review snippets available to synthesize.`);
    return;
  }

  console.log(`[START] Generating original reviews for: ${hotel.name}`);

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // プロンプト設計：ペルソナによる書き下ろしとJSON構造指定
  const prompt = `
あなたはプロの旅行ライター兼データアナリストです。
以下のホテルの「実際の口コミの断片」と「スコア」から事実（良い点・悪い点）だけを抽出し、以下の3つの異なるペルソナ（架空の人物像）になりきって、まったく新しいオリジナルの口コミ文章を3件作成してください。

【ホテル名】: ${hotel.name}
【元の全体スコア】: 外観 ${hotel.rating_exterior || '-'}, 料金 ${hotel.rating_price || '-'}, 清潔感 ${hotel.rating_cleanliness || '-'}, お風呂 ${hotel.rating_bath || '-'}, 接客 ${hotel.rating_service || '-'}
【実際の口コミの断片（事実抽出用）】: 
${JSON.stringify(hotel.review_snippets || [])}

【生成の絶対ルール】
1. 元の口コミの文章や表現は「絶対に」使用しないこと（著作権対策）。事実（例：風呂が広い、コスパが良い等）のみを使用すること。
2. 以下の3つのペルソナで作成してください：
   - ペルソナ A: 「特別な記念日デートで宿泊した20代女性」（少し長め、デザインや雰囲気を評価）
   - ペルソナ B: 「急な休憩で利用した30代男性」（端的に、コスパや設備を評価）
   - ペルソナ C: 「リピーターとして通っている大人のカップル」（冷静な目線、清掃や接客を評価）
3. 各口コミの文字数は150文字〜300文字程度とすること。
4. ホテルの元のスコアに近い点数付け（1〜5の整数）を行うこと。

【出力フォーマット（厳密なJSON配列のみ出力）】
[
  {
    "user_name": "架空のユーザー名（例: ゆい, K.T, 匿名など）",
    "stay_type": "lodging"または"rest",
    "content": "口コミの本文...",
    "rating": 総合評価(1-5),
    "cleanliness": 清掃評価(1-5),
    "service": 接客評価(1-5),
    "design": デザイン評価(1-5),
    "facilities": 設備評価(1-5),
    "value": コスパ評価(1-5)
  },
  ...
]
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // MarkdownのJSONブロック（\`\`\`json ... \`\`\`）が含まれている場合の処理
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON array from response');
    }

    const reviewsData = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(reviewsData)) {
      throw new Error('Parsed data is not an array');
    }

    // データベースにINSERT
    for (const data of reviewsData) {
      await prisma.lh_reviews.create({
        data: {
          id: uuidv4(),
          hotel_id: hotel.id,
          user_name: data.user_name || '匿名ユーザー',
          stay_type: data.stay_type || 'rest',
          content: data.content,
          rating: data.rating || 4,
          cleanliness: data.cleanliness || 4,
          service: data.service || 4,
          design: data.design || 4,
          facilities: data.facilities || 4,
          value: data.value || 4,
          created_at: new Date(), // 現在日時
          // 以降はダミーまたはnull許可
          rooms: data.facilities || 4,
        },
      });
    }

    console.log(`[SUCCESS] Inserted ${reviewsData.length} original reviews for ${hotel.name}`);
  } catch (error) {
    console.error(`[ERROR] Failed to generate/insert reviews for ${hotel.name}:`, error.message);
  }
}

async function main() {
  console.log('--- Start AI Review Generation (Cost: 0 JPY) ---');

  // 口コミ生成の種となるデータ（review_snippets）を持っているが、まだ lh_reviews にデータがないホテルを取得
  // （今回はテスト用にPlaceIDが特定のものなど、数件に絞る）
  const targetHotels = await prisma.lh_hotels.findMany({
    where: {
      review_snippets: { not: null },
    },
    take: 3, // テストとして3件のみ実行
  });

  console.log(`Found ${targetHotels.length} hotels to process.`);

  for (let i = 0; i < targetHotels.length; i++) {
    const hotel = targetHotels[i];
    await generateOriginalReviewsForHotel(hotel);

    // 無料枠制限（15 RPM）を考慮したディレイ：1リクエストにつき 5秒待機
    if (i < targetHotels.length - 1) {
      console.log('Waiting 5 seconds for rate limits...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.log('--- Finished AI Review Generation ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
