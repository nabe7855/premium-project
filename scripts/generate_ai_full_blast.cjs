const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const prisma = new PrismaClient();

const KEY_1 = process.env.GEMINI_API_KEY; // Key1をメインに使用
const genAI = new GoogleGenerativeAI(KEY_1);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('🚀 全3,700件ホテルへの「紹介文・口コミ」生成開始');

  while (true) {
    // スニペットの有無に関わらず、AI紹介文がないものを取得
    const hotel = await prisma.lh_hotels.findFirst({
      where: {
        ai_description: null,
      },
      orderBy: { id: 'asc' },
    });

    if (!hotel) {
      console.log('✅ 完了');
      break;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log(`\n🏢 ${hotel.name} (${hotel.address || '住所不明'}) の処理中...`);

    try {
      // 1. 紹介文
      console.log('  -> 紹介文を生成...');
      const prompt = `あなたは一流ホテルの専任ライターです。
      ホテル：${hotel.name}
      住所：${hotel.address || ''}
      上記の情報から、女性が安心して宿泊できるような清潔感と明るさを強調した300字以上の情緒的な紹介文を作成してください。本文のみ。Markdown不可。`;

      const res = await model.generateContent(prompt);
      const text = res.response.text().trim();

      if (text.length > 50) {
        await prisma.lh_hotels.update({
          where: { id: hotel.id },
          data: { ai_description: text },
        });
        console.log('  ✨ 紹介文を保存しました。');
      }

      // 2. 口コミ (スニペットがなくても3件創作する)
      const reviewsCount = await prisma.lh_reviews.count({ where: { hotel_id: hotel.id } });
      if (reviewsCount === 0) {
        console.log('  -> 口コミを3件創作中...');
        const rPrompt = `${hotel.name} ${hotel.address} の宿泊体験口コミを3件、実在する人物のように[{"userName":"...","rating":5,"content":"..."}]形式のJSONで作成してください。`;
        const rRes = await model.generateContent(rPrompt);
        const rText = rRes.response.text().trim();
        const jsonStr = rText
          .replace(/```json/gi, '')
          .replace(/```/gi, '')
          .trim();
        const reviews = JSON.parse(jsonStr);

        await prisma.$transaction(
          reviews.map((r) =>
            prisma.lh_reviews.create({
              data: {
                id: require('crypto').randomUUID(),
                hotel_id: hotel.id,
                user_name: r.userName || 'ゲスト',
                rating: r.rating || 5,
                content: r.content,
                is_verified: true,
                is_cast: false,
                created_at: new Date(),
              },
            }),
          ),
        );
        console.log('  ✨ 口コミ3件を保存しました。');
      }

      // 安全のため1件ごとに15秒待機
      console.log('--- 15秒待機 (API制限回避) ---');
      await sleep(15000);
    } catch (e) {
      if (e.status === 429) {
        console.warn('⚠️ レート制限! 70秒待機します...');
        await sleep(70000);
      } else {
        console.error('❌ エラー:', e.message);
        await sleep(5000);
      }
    }
  }
}

main();
