const { chromium } = require('playwright');
const fs = require('fs');

class HotelScraper {
  constructor() {
    this.browser = null;
  }

  async init() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    });
  }

  async close() {
    await this.browser.close();
  }

  async scrapeCouples(areaId) {
    const page = await this.context.newPage();
    const url = `https://couples.jp/hotels/search-by/hotelareas/${areaId}`;
    console.log(`Scraping Couples: ${url}`);

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // ホテル一覧のURLを取得
    const hotelLinks = await page.evaluate(() => {
      // Couplesの検索結果一覧のセレクタ（実際のページを確認して調整）
      return Array.from(document.querySelectorAll('.p-hotelList__itemTitle a')).map((a) => a.href);
    });

    console.log(`Found ${hotelLinks.length} hotels on Couples.`);

    const results = [];
    for (const link of hotelLinks.slice(0, 5)) {
      // まずは5件でテスト
      console.log(`Fetching details: ${link}`);
      const detailPage = await this.context.newPage();
      try {
        await detailPage.goto(link, { waitUntil: 'domcontentloaded' });
        await detailPage.waitForTimeout(2000);

        const data = await detailPage.evaluate(() => {
          const name = document.querySelector('h1')?.innerText || '';
          const address =
            document.querySelector('.p-hotelDetail__address, .p-hotelDetail__infoItem')
              ?.innerText || '';

          // テキストデータをまるごと抽出
          const contentSections = [];
          document.querySelectorAll('section, .p-hotelDetail__content').forEach((section) => {
            contentSections.push(section.innerText);
          });

          return {
            source: 'Couples',
            url: window.location.href,
            name,
            address,
            raw_text: contentSections.join('\n\n'),
          };
        });
        results.push(data);
      } catch (err) {
        console.error(`Error on ${link}:`, err.message);
      } finally {
        await detailPage.close();
      }
    }
    return results;
  }

  async scrapeHappyHotel(areaId) {
    const page = await this.context.newPage();
    // 40:福岡, 50019:天神/中洲
    const url = `https://happyhotel.jp/search/area/40/${areaId}`;
    console.log(`Scraping HappyHotel: ${url}`);

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    const hotelLinks = await page.evaluate(() => {
      // HappyHotelの一覧セレクタ
      return Array.from(document.querySelectorAll('.hotel_card__title a, .hotel_card a')).map(
        (a) => a.href,
      );
    });

    console.log(`Found ${hotelLinks.length} hotels on HappyHotel.`);

    const results = [];
    for (const link of hotelLinks.slice(0, 5)) {
      console.log(`Fetching details: ${link}`);
      const detailPage = await this.context.newPage();
      try {
        await detailPage.goto(link, { waitUntil: 'domcontentloaded' });
        await detailPage.waitForTimeout(2000);

        const data = await detailPage.evaluate(() => {
          const name = document.querySelector('h1, .hotel_name')?.innerText || '';
          const infoTable = document.querySelector('.hotel_info_table')?.innerText || '';
          const mainContent =
            document.querySelector('.main_content, .hotel_detail')?.innerText || '';

          return {
            source: 'HappyHotel',
            url: window.location.href,
            name,
            raw_text: `${infoTable}\n\n${mainContent}`,
          };
        });
        results.push(data);
      } catch (err) {
        console.error(`Error on ${link}:`, err.message);
      } finally {
        await detailPage.close();
      }
    }
    return results;
  }
}

(async () => {
  const scraper = new HotelScraper();
  await scraper.init();

  const allResults = [];

  try {
    // 福岡・博多エリア (Couples ID: 514)
    const couplesResults = await scraper.scrapeCouples('514');
    allResults.push(...couplesResults);

    // 福岡・中洲 (HappyHotel ID: 50019)
    const happyResults = await scraper.scrapeHappyHotel('50019');
    allResults.push(...happyResults);

    fs.writeFileSync('scraped_hotels_raw.json', JSON.stringify(allResults, null, 2));
    console.log(
      `Successfully scraped ${allResults.length} hotels. Saved to scraped_hotels_raw.json`,
    );
  } catch (err) {
    console.error('Fatal error:', err);
  } finally {
    await scraper.close();
  }
})();
