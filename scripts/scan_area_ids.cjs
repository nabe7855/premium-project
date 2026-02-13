const { chromium } = require('playwright');

async function scanIds() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('--- Scanning Area IDs (100-200, 300-400...) ---');
  // 関東エリアはどのあたりか？
  // 東京・神奈川で固まっているはず。
  // 試しにいくつかピックアップして傾向を見る

  // 100から200まで
  for (let id = 100; id <= 250; id++) {
    const url = `https://couples.jp/hotels/search-by/hotelareas/${id}`;
    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 });
      if (res.status() === 200) {
        const title = await page.title();
        // タイトル例: 「横浜駅周辺のラブホテル...」
        if (title.includes('神奈川') || title.includes('横浜') || title.includes('川崎')) {
          console.log(`FOUND: ID=${id} -> ${title}`);
        }
      }
    } catch (e) {}
  }

  // もし100番台になければ、300番台なども試すが、まずはここまで
  await browser.close();
}

scanIds();
