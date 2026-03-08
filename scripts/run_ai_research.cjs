const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function extractFactData(hotelName, address) {
  // ここでAIに「ウェブ検索結果(あるいは一般知識)」から事実を抽出させる
  // ※ search_webをこのスクリプト内で叩くのは難しいため、
  //   一旦AIが持っているナレッジ or 一般的な設備情報を抽出するプロンプトにする。
  //   本来はsearch_webの結果を注入したい。

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `あなたはラブホテル専門のリサーチアシスタントです。
  ホテル名: ${hotelName}
  住所: ${address}
  
  このホテルについて世の中で一般的に知られている「主な設備・アメニティ（例：VOD, 岩盤浴, 浴室テレビ等）」と
  「リアルな口コミのトピック（例：部屋が広い, スタッフが丁寧, 少し古い等）」を
  事実ベースで箇条書きで抽出してください。
  ※もし具体的な情報がない場合は、その地域の一般的な価格帯のホテルの標準的な設備を推測して「(推測)」と付けてください。
  出力形式:
  設備: [項目1, 項目2]
  口コミ: [内容1, 内容2]`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    return '情報なし';
  }
}

async function runResearchTask(limit = 5) {
  console.log(`🔍 外部情報のAIリサーチを開始... (先頭${limit}件)`);

  const hotels = await prisma.lh_hotels.findMany({
    take: limit,
    select: { id: true, name: true, address: true },
  });

  const results = [];
  for (const h of hotels) {
    console.log(`  - ${h.name} をリサーチ中...`);
    const fact = await extractFactData(h.name, h.address);
    results.push({ id: h.id, fact });
    await new Promise((r) => setTimeout(r, 5000)); // Rate limit考慮
  }

  // リサーチ結果を一旦保存
  fs.writeFileSync(
    path.join(process.cwd(), 'data', 'hotels_research_facts.json'),
    JSON.stringify(results, null, 2),
  );
  console.log('✅ リサーチ結果をJsonに保存しました。');
}

runResearchTask().catch(console.error);
