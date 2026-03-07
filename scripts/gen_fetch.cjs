const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

async function generateWithFetch(hotelName, rawDescription) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const prompt = `
あなたは高級ホテルポータルサイトの編集者です。
以下のホテルの「生データ」を元に、ユーザーが泊まりたくなるような魅力的で清潔感のある紹介文（300文字程度）を作成してください。

ホテルの魅力（設備、サービス、雰囲気）を、20代〜30代のカップル層向けに強調してください。
出力は日本語の紹介文のみ。

ホテル名: ${hotelName}
生データ: ${rawDescription}
`;

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const json = await resp.json();
    if (json.error) {
      console.error(`Error ${json.error.code}: ${json.error.message}`);
      return null;
    }
    return json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function main() {
  const hotels = await prisma.lh_hotels.findMany({
    where: { raw_description: { not: null }, ai_description: null },
    take: 5,
  });

  for (const hotel of hotels) {
    console.log(`Processing: ${hotel.name}...`);
    const aiDesc = await generateWithFetch(hotel.name, hotel.raw_description);
    if (aiDesc) {
      await prisma.lh_hotels.update({
        where: { id: hotel.id },
        data: { ai_description: aiDesc },
      });
      console.log(`✅ Success!`);
      await new Promise((r) => setTimeout(r, 10000));
    } else {
      console.log(`❌ Failed.`);
      await new Promise((r) => setTimeout(r, 15000));
    }
  }
}
main();
