const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const prisma = new PrismaClient();
const KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function getHotelsToResearch() {
  const jsonPath = path.join(process.cwd(), 'data', 'hotels_research_facts.json');
  let doneIds = new Set();
  if (fs.existsSync(jsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      doneIds = new Set(data.map((d) => d.id));
    } catch (e) {
      console.error('JSON corruption detected.');
    }
  }

  const hotels = await prisma.lh_hotels.findMany({
    where: { id: { notIn: Array.from(doneIds) } },
    select: { id: true, name: true, address: true },
    orderBy: { id: 'asc' },
    take: 50,
  });
  return hotels;
}

async function research(hotel) {
  const prompt = `以下のホテルについて、実在する「アメニティ」と「口コミでの良い点/悪い点」を箇条書きで教えて。
    ホテル名: ${hotel.name}
    住所: ${hotel.address}
    
    もし見つからなければ、この地域・価格帯なら普通あるであろう設備を「(推測)」として書いて。
    最後に必ず "---FACT-END---" と書いて終わって。`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error(`  Error: ${e.message}`);
    return null;
  }
}

async function main() {
  const jsonPath = path.join(process.cwd(), 'data', 'hotels_research_facts.json');

  while (true) {
    const hotels = await getHotelsToResearch();
    if (hotels.length === 0) break;

    console.log(`🚀 ${hotels.length} 件のリサーチバッチ...`);

    for (const h of hotels) {
      console.log(`  🔍 Researching: ${h.name}`);
      const fact = await research(h);
      if (fact) {
        const currentData = fs.existsSync(jsonPath)
          ? JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
          : [];
        currentData.push({ id: h.id, fact: fact.split('---FACT-END---')[0].trim() });
        fs.writeFileSync(jsonPath, JSON.stringify(currentData, null, 2));
        console.log('    ✓ Success');
      }
      await new Promise((r) => setTimeout(r, 6000)); // 安定走行
    }
  }
}

main().catch(console.error);
