const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to Couples.jp Fukuoka...');
    await page.goto('https://couples.jp/search/fukuoka/hakata', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    // ページが読み込まれるのを待つ
    await page.waitForTimeout(5000);

    const content = await page.content();
    fs.writeFileSync('couples_debug.html', content);

    const hotels = await page.evaluate(() => {
      const results = [];
      // Couples.jpの構造を推測して取得
      document.querySelectorAll('.hotel-list-item, .item_box, article').forEach((el) => {
        results.push(el.innerText.substring(0, 200).replace(/\n/g, ' '));
      });
      return results;
    });

    console.log('Found elements on Couples:', hotels.length);
    if (hotels.length > 0) {
      console.log('Sample data:', hotels[0]);
    } else {
      console.log('No elements found with current selectors.');
    }
  } catch (err) {
    console.error('Error during scraping:', err.message);
  } finally {
    await browser.close();
  }
})();
