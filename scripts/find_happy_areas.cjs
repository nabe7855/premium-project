const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('--- Checking HappyHotel Fukuoka ---');
    await page.goto('https://happyhotel.jp/fukuoka', { waitUntil: 'networkidle' });
    fs.writeFileSync('happyhotel_fukuoka_debug.html', await page.content());

    const areas = await page.evaluate(() => {
      // 全てのリンクを抽出して "search/area" を含むものを探す
      return Array.from(document.querySelectorAll('a'))
        .filter((a) => a.href.includes('/search/area/'))
        .map((a) => ({ name: a.innerText, href: a.href }));
    });
    console.log('HappyHotel Fukuoka Areas:', areas);
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
