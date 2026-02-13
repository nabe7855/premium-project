const { chromium } = require('playwright');

async function checkPrefUrl() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 試し打ちURL
  const urls = [
    'https://couples.jp/hotels/search-by/pref/14', // 本命
    'https://couples.jp/hotels/search-by/prefecture/14',
    'https://couples.jp/hotels/list/pref/14',
  ];

  for (const url of urls) {
    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded' });
      console.log(`${url} -> Status: ${res.status()}`);
      if (res.status() === 200) {
        console.log(`Title: ${await page.title()}`);
        // エリアリストがあるか確認
        const areas = await page.evaluate(() => {
          // エリアリンクのパターンを探す (/hotelareas/\d+)
          const links = Array.from(document.querySelectorAll('a[href*="/hotelareas/"]'));
          return links
            .map((a) => ({
              text: a.innerText.trim(),
              id: a.href.match(/\/hotelareas\/(\d+)/)?.[1],
            }))
            .filter((a) => a.id);
        });
        console.log('Detected Areas:', JSON.stringify(areas, null, 2));
        if (areas.length > 0) break; // 見つかったら終了
      }
    } catch (e) {
      console.log(e.message);
    }
  }
  await browser.close();
}

checkPrefUrl();
