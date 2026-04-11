/**
 * Hotel AI Rewrite - Dry Run (v3)
 * ----------------------------------
 * - Processes 5 'pending' hotels sequentially (no parallelism)
 * - 3s delay between each call to avoid Gemini rate limits
 * - Retries once on failure before marking as 'error'
 * - Writes results atomically to hotels_processed_data.json after each hotel
 *
 * HANDOVER NOTES for next AI:
 * - Model: gemini-2.0-flash (fast, generous free quota)
 * - API Keys: GEMINI_API_KEY / GEMINI_API_KEY_2 in .env
 * - JSON: data/processed_hotel_data/hotels_processed_data.json
 * - Status field: processing_status = 'pending' | 'completed' | 'error'
 * - Scale up: Change BATCH_SIZE to 50, run in a loop
 */

const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const JSON_PATH = 'data/processed_hotel_data/hotels_processed_data.json';
const BATCH_SIZE = 5;
const DELAY_MS = 4000; // 4s between calls

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildPrompt(hotelData) {
  const amenitiesText = hotelData.amenities?.slice(0, 15).join('、') || '情報なし';
  const stayPrices =
    hotelData.prices?.['宿泊']
      ?.slice(0, 2)
      .map((p) => `${p.title}:${p.price}`)
      .join(' / ') || '要確認';
  const restPrices =
    hotelData.prices?.['休憩']
      ?.slice(0, 2)
      .map((p) => `${p.title}:${p.price}`)
      .join(' / ') || '要確認';
  const rawReviews =
    hotelData.reviews
      ?.slice(0, 3)
      .map((r) => r.body)
      .filter(Boolean)
      .join('\n---\n') || 'なし';
  const description = hotelData.description || `${hotelData.hotel_name}のホテルです。`;

  return `あなたは日本のラブホテル・カップルズホテルの紹介サイトの編集者です。
以下のホテル情報を元に、SEOに強くかつ100%オリジナルの紹介文と口コミをJSON形式で生成してください。
既存の文章をそのままコピーすることは厳禁です。

【ホテル情報】
ホテル名: ${hotelData.hotel_name}
既存説明文(参考): ${description.slice(0, 200)}
主なアメニティ: ${amenitiesText}
宿泊料金: ${stayPrices}
休憩料金: ${restPrices}
既存口コミ(参考): ${rawReviews.slice(0, 500)}

【出力ルール】
- ai_description: 200-400文字。ホテルの魅力・特徴・キャッチーな表現を盛り込む。体言止めや語尾のバリエーションを使う。
- ai_summary: 50-80文字のキャッチコピー1文。
- ai_pros_cons.pros: 強みを3つ。設備や立地などを具体的に。
- ai_pros_cons.cons: 弱みを1-2つ(正直に)。なければ「特になし」。
- ai_reviews: 元の口コミをベースに完全に別の文章でリライトした口コミ2件。スコアは元データを参考に。

【出力形式】JSONのみ。他のテキストは一切不要。
{
  "ai_description": "...",
  "ai_summary": "...",
  "ai_pros_cons": { "pros": ["...", "...", "..."], "cons": ["..."] },
  "ai_reviews": [
    { "title": "...", "body": "...", "score": "4.0" },
    { "title": "...", "body": "...", "score": "3.5" }
  ]
}`;
}

async function callGemini(prompt, retries = 1) {
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response
        .text()
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      return JSON.parse(text);
    } catch (err) {
      if (i < retries) {
        console.log(`  Retry ${i + 1}/${retries} after error: ${err.message.slice(0, 60)}`);
        await sleep(5000);
      } else {
        console.error(`  Final error: ${err.message.slice(0, 100)}`);
        return null;
      }
    }
  }
}

async function main() {
  console.log('=== Hotel AI Rewrite Dry Run (v3) ===');
  const raw = fs.readFileSync(JSON_PATH, 'utf8');
  const data = JSON.parse(raw);
  const allIds = Object.keys(data);

  const pending = allIds
    .filter(
      (id) =>
        data[id].processing_status === 'pending' ||
        data[id].processing_status === 'error' ||
        data[id].processing_status === 'failed',
    )
    .slice(0, BATCH_SIZE);

  if (pending.length === 0) {
    console.log('No pending hotels found.');
    return;
  }

  console.log(`Processing ${pending.length} hotels (BATCH_SIZE=${BATCH_SIZE})\n`);

  for (let i = 0; i < pending.length; i++) {
    const id = pending[i];
    const hotel = data[id];
    console.log(`[${i + 1}/${pending.length}] ${hotel.hotel_name}`);

    const prompt = buildPrompt(hotel);
    const aiContent = await callGemini(prompt);

    if (aiContent) {
      data[id].ai_description = aiContent.ai_description;
      data[id].ai_summary = aiContent.ai_summary;
      data[id].ai_pros_cons = aiContent.ai_pros_cons;
      data[id].ai_reviews = aiContent.ai_reviews;
      data[id].processing_status = 'completed';
      console.log(`  ✅ Done: ${hotel.hotel_name.slice(0, 30)}`);
      console.log(`  Summary: ${aiContent.ai_summary?.slice(0, 60)}...`);
    } else {
      data[id].processing_status = 'error';
      console.log(`  ❌ Error: ${hotel.hotel_name}`);
    }

    // Save after each hotel to prevent data loss
    fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2));

    // Delay to avoid rate limits (skip on last)
    if (i < pending.length - 1) {
      console.log(`  Waiting ${DELAY_MS / 1000}s...\n`);
      await sleep(DELAY_MS);
    }
  }

  const completed = Object.values(data).filter((h) => h.processing_status === 'completed').length;
  const errors = Object.values(data).filter((h) => h.processing_status === 'error').length;
  const remaining = Object.values(data).filter((h) => h.processing_status === 'pending').length;

  console.log('\n=== Dry Run Complete ===');
  console.log(`✅ Completed: ${completed}`);
  console.log(`❌ Errors:    ${errors}`);
  console.log(`⏳ Remaining: ${remaining}`);
}

main().catch(console.error);
