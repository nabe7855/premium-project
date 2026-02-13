const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  console.log('Navigating to Happy Hotel Fukuoka search...');
  // 福岡市博多区の検索結果ページ（推測URL）
  await page.goto('https://happyhotel.jp/search/area/40/40103', { waitUntil: 'networkidle' });

  const content = await page.content();
  fs.writeFileSync('happyhotel_debug.html', content);

  const hotels = await page.evaluate(() => {
    const items = [];
    // セレクタは後で調整。ここではとりあえず中身を確認するための汎用的なもの
    document.querySelectorAll('article, .hotel_card, .item').forEach((el) => {
      items.push(el.innerText.substring(0, 100));
    });
    return items;
  });

  console.log('Found elements:', hotels.length);
  console.log('Sample text:', hotels[0]);

  await browser.close();
})();
