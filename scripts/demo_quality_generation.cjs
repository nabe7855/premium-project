const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function generateQualityContent(hotel) {
  const prompt = `あなたは「女性が安心して楽しめる、おしゃれで明るいラブホテル紹介サイト」の編集者です。
以下の実在する情報（事実）を元に、読者がワクワクするような魅力的な紹介文（150文字程度）と、
実際に宿泊した女性の感想をイメージしたポジティブな口コミを3件作成してください。

【ホテル情報】
名前: ${hotel.name}
住所: ${hotel.address}
設備: ${hotel.amenities}
評判キーワード: ${hotel.reviews}

【制約事項】
・トーンは「明るい、親しみやすい、清潔感がある、女性目線」。
・「安心」「綺麗」「癒やし」などのキーワードを散りばめる。
・口コミは「サウナが最高でした！」「アメニティが豊富で手ぶらでOK」といった具体的な感想を入れる。

回答形式(JSON):
{
  "description": "紹介文テキスト",
  "reviews": [
    {"title": "口コミ1タイトル", "body": "口コミ1本文"},
    {"title": "口コミ2タイトル", "body": "口コミ2本文"},
    {"title": "口コミ3タイトル", "body": "口コミ3本文"}
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response
      .text()
      .replace(/```json/gi, '')
      .replace(/```/gi, '')
      .trim();
    return JSON.parse(text);
  } catch (e) {
    console.error(`Error generating for ${hotel.name}: ${e.message}`);
    return null;
  }
}

async function main() {
  const csvPath = path.join(process.cwd(), 'data', 'hotels_enriched_data.csv');
  // 実装の詳細は省略しますが、CSVから51件のうち、事実が入っているものを数件選んでデモ生成
  console.log('🚀 事実データに基づいた高品質生成デモを開始します...');

  // HOTEL ZHIPAGO (五反田) や HOTEL SUIEN (金沢) などのリッチな情報を利用
  const demoHotels = [
    {
      name: 'HOTEL ZHIPAGO (ホテル ジパゴ)',
      address: '東京都品川区東五反田1-20-5',
      amenities:
        '全室ReFaシャワーヘッド全室, 花魁コンセプトの内装, 2022年11月オープン, 加湿空気清浄機',
      reviews:
        '清潔感、サービス、設備全てにおいて五反田エリア最高クラスの満足度。非日常空間が人気。',
    },
  ];

  for (const h of demoHotels) {
    const content = await generateQualityContent(h);
    if (content) {
      console.log(`\n--- ${h.name} ---`);
      console.log(`✨紹介文: ${content.description}`);
      console.log(`💬口コミ1: ${content.reviews[0].body}`);
    }
  }
}

main();
