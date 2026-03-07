const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  });

  const allAreas = [];

  try {
    for (let prefId = 1; prefId <= 47; prefId++) {
      console.log(`Checking Prefecture ${prefId}...`);
      const page = await context.newPage();
      try {
        const url = `https://couples.jp/prefectures/${prefId}/hotelareas`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

        const prefName = await page.evaluate(() => document.querySelector('h1')?.innerText || '');

        const areas = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a'))
            .filter((a) => a.href.includes('/hotelareas/'))
            .map((a) => {
              const parts = a.href.split('/');
              return {
                id: parts[parts.length - 1],
                name: a.innerText.trim(),
                url: a.href,
              };
            });
        });

        console.log(`  Found ${areas.length} areas in ${prefName || prefId}`);
        allAreas.push({
          prefId,
          prefName,
          areas,
        });
      } catch (err) {
        console.error(`  Error in Pref ${prefId}: ${err.message}`);
      } finally {
        await page.close();
      }
      // Be polite
      await new Promise((r) => setTimeout(r, 1000));
    }

    fs.writeFileSync('all_japan_couples_areas.json', JSON.stringify(allAreas, null, 2));
    console.log('Successfully saved to all_japan_couples_areas.json');
  } catch (err) {
    console.error('Fatal error:', err);
  } finally {
    await browser.close();
  }
})();
