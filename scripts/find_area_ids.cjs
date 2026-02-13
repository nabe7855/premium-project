const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('--- Checking Couples.jp Area List ---');
    await page.goto('https://couples.jp/prefectures/40/hotelareas', {
      waitUntil: 'domcontentloaded',
    });
    const couplesAreas = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .filter((a) => a.href.includes('/hotelareas/'))
        .map((a) => ({ name: a.innerText, href: a.href }));
    });
    console.log('Couples Areas:', couplesAreas);

    console.log('--- Checking HappyHotel Pref List ---');
    await page.goto('https://happyhotel.jp/search/pref/40', { waitUntil: 'domcontentloaded' });
    const happyAreas = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .filter((a) => a.href.includes('/search/area/'))
        .map((a) => ({ name: a.innerText, href: a.href }));
    });
    console.log('HappyHotel Areas:', happyAreas);
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
