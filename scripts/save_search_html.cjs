const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('--- Saving Couples Search HTML ---');
    await page.goto('https://couples.jp/hotels/search-by/hotelareas/514', {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForTimeout(5000); // 念のため待機
    fs.writeFileSync('couples_search_debug.html', await page.content());

    console.log('--- Saving HappyHotel Search HTML ---');
    await page.goto('https://happyhotel.jp/search/area/40/50019', {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForTimeout(5000);
    fs.writeFileSync('happyhotel_search_debug.html', await page.content());
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
