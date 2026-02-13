const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * ホテル情報抽出スクリプト (博多エリア・安定版)
 *
 * 抽出対象:
 * 1. Couples.jp (天神・中洲・博多エリア) -> 実績あり
 * 2. Stay Lovely (福岡県) -> URL修正
 * 3. Happy Hotel (博多区) -> 安定化
 */

async function scrapeHakata() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  });

  const results = [];

  // --- 1. Couples.jp ---
  console.log('--- Scraping Couples.jp (ID: 514) ---');
  const couplesPage = await context.newPage();
  try {
    await couplesPage.goto('https://couples.jp/hotels/search-by/hotelareas/514', {
      waitUntil: 'domcontentloaded',
    });
    await couplesPage.waitForTimeout(5000);

    const hotels = await couplesPage.evaluate(() => {
      return Array.from(document.querySelectorAll('.p-cassette__item'))
        .map((el) => ({
          name: el.querySelector('.p-cassette__name')?.innerText.trim() || '',
          url: el.querySelector('.p-cassette__headBox')?.href || '',
          address: el.querySelector('.p-cassette__address')?.innerText.trim() || '',
          summary: el.innerText,
        }))
        .filter((h) => h.url);
    });

    console.log(`Couples: Found ${hotels.length} hotels.`);
    for (const h of hotels.slice(0, 10)) {
      console.log(`  Detail: ${h.name}`);
      const detailPage = await context.newPage();
      try {
        await detailPage.goto(h.url, { waitUntil: 'networkidle', timeout: 30000 });
        const text = await detailPage.evaluate(() => document.body.innerText);
        results.push({
          site: 'Couples',
          name: h.name,
          address: h.address,
          url: h.url,
          raw_text: text,
        });
      } catch (e) {
        console.error(`  Error: ${h.url}`);
      }
      await detailPage.close();
    }
  } catch (err) {
    console.error('Couples Error:', err.message);
  }
  await couplesPage.close();

  // --- 2. Stay Lovely ---
  console.log('--- Scraping Stay Lovely (Pref: 40) ---');
  const stayPage = await context.newPage();
  try {
    // 修正後のURL
    await stayPage.goto('https://stay-lovely.jp/hotels/pref/40', { waitUntil: 'domcontentloaded' });
    await stayPage.waitForTimeout(5000);

    const hotels = await stayPage.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .filter((a) => a.href.includes('/hotels/') && !a.href.includes('/pref/'))
        .map((a) => ({ name: a.innerText.trim(), url: a.href }));
    });

    const uniqueStay = Array.from(new Map(hotels.map((h) => [h.url, h])).values()).filter(
      (h) => h.name.length > 3,
    );
    console.log(`Stay Lovely: Found ${uniqueStay.length} potential links.`);

    for (const h of uniqueStay.slice(0, 5)) {
      console.log(`  Detail: ${h.name}`);
      const detailPage = await context.newPage();
      try {
        await detailPage.goto(h.url, { waitUntil: 'networkidle', timeout: 30000 });
        const text = await detailPage.evaluate(() => document.body.innerText);
        results.push({ site: 'StayLovely', name: h.name, url: h.url, raw_text: text });
      } catch (e) {
        console.error(`  Error: ${h.url}`);
      }
      await detailPage.close();
    }
  } catch (err) {
    console.error('Stay Lovely Error:', err.message);
  }
  await stayPage.close();

  // --- 3. Happy Hotel ---
  console.log('--- Scraping Happy Hotel (Hakata) ---');
  const happyPage = await context.newPage();
  try {
    // 壊れにくいURLを使用
    await happyPage.goto('https://happyhotel.jp/search/address/40/40103', {
      waitUntil: 'domcontentloaded',
    });
    await happyPage.waitForTimeout(5000);

    const hotels = await happyPage.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .filter((a) => a.href.includes('/detail/'))
        .map((a) => ({ name: a.innerText.trim() || 'HappyHotel', url: a.href }));
    });

    const uniqueHappy = Array.from(new Map(hotels.map((h) => [h.url, h])).values());
    console.log(`Happy Hotel: Found ${uniqueHappy.length} potential links.`);

    for (const h of uniqueHappy.slice(0, 5)) {
      console.log(`  Detail: ${h.url}`);
      const detailPage = await context.newPage();
      try {
        await detailPage.goto(h.url, { waitUntil: 'networkidle', timeout: 30000 });
        const text = await detailPage.evaluate(() => document.body.innerText);
        results.push({ site: 'HappyHotel', name: h.name, url: h.url, raw_text: text });
      } catch (e) {
        console.error(`  Error: ${h.url}`);
      }
      await detailPage.close();
    }
  } catch (err) {
    console.error('Happy Hotel Error:', err.message);
  }
  await happyPage.close();

  fs.writeFileSync('scraped_data_hakata.json', JSON.stringify(results, null, 2));
  console.log(`\n完了！ ${results.length}件のデータを scraped_data_hakata.json に保存しました。`);
  await browser.close();
}

scrapeHakata();
