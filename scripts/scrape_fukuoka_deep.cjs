const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function scrapeFukuokaDeep() {
  const inputFile = path.join(process.cwd(), 'fukuoka_hotels_list.json');
  const outputFile = path.join(process.cwd(), 'scraped_data_fukuoka_deep.json');

  if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    process.exit(1);
  }

  const hotels = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  console.log(`Loaded ${hotels.length} hotels from ${inputFile}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  });

  const results = [];
  const concurrency = 3;

  for (let i = 0; i < hotels.length; i += concurrency) {
    const chunk = hotels.slice(i, i + concurrency);
    const promises = chunk.map(async (hotel) => {
      console.log(`Processing [${results.length + 1}/${hotels.length}]: ${hotel.name}`);
      const page = await context.newPage();
      try {
        await page.goto(hotel.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const deepInfo = await page.evaluate(() => {
          const getValByTh = (text) => {
            const ths = Array.from(document.querySelectorAll('th'));
            const target = ths.find((th) => th.innerText.includes(text));
            return target ? target.nextElementSibling?.innerText.trim() : '';
          };

          const name = document.querySelector('.hd-header__name')?.innerText.trim() || '';
          const ruby = document.querySelector('.hd-header__ruby')?.innerText.trim() || '';
          const address = getValByTh('住所');
          const tel = getValByTh('TEL');
          const roomCount = getValByTh('客室数');
          const parking = getValByTh('駐車場');
          const prText = document.querySelector('.hd-pr p')?.innerText.trim() || '';

          const priceTable = document.querySelector('.hd-tablePrice');
          const prices = [];
          if (priceTable) {
            const rows = Array.from(priceTable.querySelectorAll('tr'));
            rows.forEach((tr) => {
              const category = tr.querySelector('.hd-tablePrice__category')?.innerText.trim() || '';
              const plans = Array.from(tr.querySelectorAll('.hd-pricePlan > li'))
                .map((li) => {
                  const title = li.querySelector('.hd-pricePlan__title')?.innerText.trim() || '';
                  const priceValue =
                    li.querySelector('.hd-priceRange__price')?.innerText.trim() || '';
                  const time = li.querySelector('.hd-timezone__time')?.innerText.trim() || '';
                  const stay = li.querySelector('.hd-timezone__stay')?.innerText.trim() || '';
                  const note = li.querySelector('.hd-pricePlan__note')?.innerText.trim() || '';
                  return { title, price: priceValue, time, stay, note };
                })
                .filter((p) => p.price || p.title || p.note);
              if (category) prices.push({ category, plans });
            });
          }

          const accessRaw = getValByTh('アクセス');

          return {
            name,
            ruby,
            address,
            tel,
            roomCount,
            parking,
            prText,
            prices,
            accessRaw,
          };
        });

        results.push({
          ...hotel,
          ...deepInfo,
        });
      } catch (err) {
        console.error(`  Error scraping ${hotel.name}: ${err.message}`);
        results.push(hotel);
      } finally {
        await page.close();
      }
    });

    await Promise.all(promises);
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf8');
  }

  await browser.close();
  console.log(`Finished! Saved ${results.length} hotels to ${outputFile}`);
}

scrapeFukuokaDeep();
