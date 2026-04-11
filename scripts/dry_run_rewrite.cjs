const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Load environment variables (Manually since this is a standalone script)
const API_KEY = process.env.GEMINI_API_KEY; // Using GEMINI_API_KEY from .env
const JSON_PATH = 'data/processed_hotel_data/hotels_processed_data.json';

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function rewriteHotel(hotelId, hotelData) {
  const prompt = `
以下のホテル情報を元に、**SEOに強く、かつ100%オリジナルの日本語紹介文と口コミ**を作成してください。
他サイトの文章のコピーは厳禁です。

【入力データ】
ホテル名: ${hotelData.hotel_name}
説明文: ${hotelData.description}
アメニティ: ${hotelData.amenities?.join(', ')}
価格(宿泊): ${JSON.stringify(hotelData.prices?.['宿泊'])}
価格(休憩): ${JSON.stringify(hotelData.prices?.['休憩'])}
生口コミ(最大3件): ${JSON.stringify(hotelData.reviews?.slice(0, 3).map((r) => r.body))}

【出力フォーマット (JSON形式のみ)】
{
  "ai_description": "300-500文字程度の魅力的な紹介文。ホテルの特徴や立地、設備を自然に盛り込む。",
  "ai_summary": "1-2文のキャッチコピー風の要約。",
  "ai_pros_cons": {
    "pros": ["メリット1", "メリット2"],
    "cons": ["デメリット(あれば)1"]
  },
  "ai_reviews": [
    { "title": "オリジナルのタイトル", "body": "生口コミの内容を元に、全く別の文章でリライトした口コミ(300字程度)", "score": "4.5" }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response
      .text()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(text);
  } catch (err) {
    console.error(`AI Error for ${hotelId}:`, err);
    return null;
  }
}

async function main() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const hotelIds = Object.keys(data);
  const pending = hotelIds.filter((id) => data[id].processing_status === 'pending').slice(0, 5);

  console.log(`Starting Dry Run for ${pending.length} hotels...`);

  for (const id of pending) {
    console.log(`Processing: ${data[id].hotel_name} (${id})`);
    const aiContent = await rewriteHotel(id, data[id]);

    if (aiContent) {
      data[id].ai_description = aiContent.ai_description;
      data[id].ai_summary = aiContent.ai_summary;
      data[id].ai_pros_cons = aiContent.ai_pros_cons;
      data[id].ai_reviews = aiContent.ai_reviews;
      data[id].processing_status = 'completed';
      console.log(`✅ Completed: ${data[id].hotel_name}`);
    } else {
      data[id].processing_status = 'failed';
      console.log(`❌ Failed: ${data[id].hotel_name}`);
    }
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));
  console.log('Dry Run finished. Check hotels_processed_data.json for results.');
}

main();
