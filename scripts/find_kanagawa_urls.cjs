const { chromium } = require('playwright');

async function findUrls() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('--- Finding Kanagawa URLs ---');

  const targets = [
    // 予想されるURLパターン
    'https://couples.jp/', // トップから探す
    'https://couples.jp/Search/pref_14', // 検索パラメータ
    'https://happyhotel.jp/search/prefecture/14', // ハピホテ
    'https://stay-lovely.jp/hotels/pref/14', // ステラブ
  ];

  for (const url of targets) {
    try {
      console.log(`Checking: ${url}`);
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      console.log(`Status: ${res.status()}`);
      console.log(`Title: ${await page.title()}`);

      if (await page.title().then((t) => t.includes('神奈川') || t.includes('Kanagawa'))) {
        console.log('Valid Kanagawa Page!');

        // カップルズの場合、エリアIDリンクがあるか探る
        if (url.includes('couples.jp')) {
          const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a[href*="/hotelareas/"]')).map(
              (a) => a.href,
            );
          });
          console.log('エリアリンク(Couples):', links);
        }
      }
    } catch (e) {
      console.log(`Error accessing ${url}: ${e.message}`);
    }
  }

  await browser.close();
}

findUrls();
