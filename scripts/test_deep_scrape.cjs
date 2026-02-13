const { chromium } = require('playwright');

async function scrapeHotelDetails(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log(`Accessing ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const details = await page.evaluate(() => {
      const getValByTh = (text) => {
        const ths = Array.from(document.querySelectorAll('th'));
        const target = ths.find((th) => th.innerText.includes(text));
        return target ? target.nextElementSibling?.innerText.trim() : '';
      };

      // 1. 基本情報
      const name = document.querySelector('.hd-header__name')?.innerText.trim() || '';
      const ruby = document.querySelector('.hd-header__ruby')?.innerText.trim() || '';
      const group = document.querySelector('.hd-header__group')?.innerText.trim() || '';

      const address = getValByTh('住所');
      const tel = getValByTh('TEL');
      const roomCount = getValByTh('客室数'); // もしあれば
      const parking = getValByTh('駐車場');

      // 2. 紹介文 (PRテキスト)
      const description = document.querySelector('.hd-pr p')?.innerText.trim() || '';

      // 3. 料金情報
      const priceTable = document.querySelector('.hd-tablePrice');
      const prices = [];
      if (priceTable) {
        const rows = Array.from(priceTable.querySelectorAll('tr'));
        rows.forEach((tr) => {
          const category = tr.querySelector('.hd-tablePrice__category')?.innerText.trim() || '';
          const plans = Array.from(tr.querySelectorAll('.hd-pricePlan > li'))
            .map((li) => {
              const title = li.querySelector('.hd-pricePlan__title')?.innerText.trim() || '';
              const price = li.querySelector('.hd-priceRange__price')?.innerText.trim() || '';
              const time = li.querySelector('.hd-timezone__time')?.innerText.trim() || '';
              const stay = li.querySelector('.hd-timezone__stay')?.innerText.trim() || '';
              const note = li.querySelector('.hd-pricePlan__note')?.innerText.trim() || '';
              return { title, price, time, stay, note };
            })
            .filter((p) => p.price || p.title || p.note);
          if (category) prices.push({ category, plans });
        });
      }

      // 4. アクセス詳細
      const accessRaw = getValByTh('アクセス');

      return {
        name,
        ruby,
        group,
        address,
        tel,
        roomCount,
        parking,
        description,
        prices,
        accessRaw,
      };
    });

    return details;
  } catch (e) {
    console.error(`Error scraping ${url}:`, e.message);
    return null;
  } finally {
    await browser.close();
  }
}

// テスト実行
const testUrl = 'https://couples.jp/hotel-details/21392';
scrapeHotelDetails(testUrl).then((data) => {
  console.log(JSON.stringify(data, null, 2));
});
