import fs from 'fs';
import puppeteer from 'puppeteer';

async function debug() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    const hotelName = 'HOTEL D 大宮';
    // 修正されたパス: /hotels/search-by/somewhere/KW
    const searchUrl = `https://couples.jp/hotels/search-by/somewhere/${encodeURIComponent(hotelName)}`;
    console.log(`URL: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    console.log('Navigation done');
    await new Promise((r) => setTimeout(r, 5000));

    const html = await page.content();
    fs.writeFileSync('debug_couples_search.html', html);

    const results = await page.evaluate(() => {
      const items = Array.from(
        document.querySelectorAll('.p-hotelCard__title a, .hd-hotelList__item a'),
      );
      return items.map((a) => ({ text: a.innerText, href: a.href }));
    });
    console.log('Found results:', JSON.stringify(results, null, 2));

    await browser.close();
  } catch (e) {
    console.error('DEBUG ERROR:', e);
  }
}
debug();
