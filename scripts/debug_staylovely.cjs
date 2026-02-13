const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('--- Checking Stay Lovely Fukuoka ---');
    await page.goto('https://stay-lovely.jp/hotels/fukuoka', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    fs.writeFileSync('staylovely_debug.html', await page.content());

    const hotels = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .filter((a) => a.href.includes('/hotels/'))
        .map((a) => a.href);
    });
    console.log('Stay Lovely Links Sample:', hotels.slice(0, 10));
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
