import fs from 'fs';
import puppeteer from 'puppeteer';

async function debug() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    const detailUrl = 'https://couples.jp/hotel-details/1965';
    console.log(`URL: ${detailUrl}`);

    await page.goto(detailUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 5000));

    const html = await page.content();
    fs.writeFileSync('debug_details_1965.html', html);

    const data = await page.evaluate(() => {
      const description = document.querySelector('.hd-header__ruby')?.innerText || '';
      const amenities = Array.from(
        document.querySelectorAll('.equipment-list li, .service-list li'),
      )
        .map((li) => li.innerText.trim())
        .filter(Boolean);
      const reviews = Array.from(document.querySelectorAll('.hd-topReviewList__item'))
        .map((item) => ({
          title: item.querySelector('.hd-topReviewList__tit')?.innerText || '',
          body: item.querySelector('.hd-topReviewList__txt')?.innerText || '',
          score: item.querySelector('.hd-topReviewList__score')?.innerText || '',
        }))
        .filter((r) => r.body);
      return { description, amenities, reviews, allHtml: document.body.innerHTML.length };
    });
    console.log(
      'Found data:',
      JSON.stringify(data, (k, v) => (k === 'allHtml' ? v : v), 2),
    );

    // クラス名の一覧を確認
    const classes = await page.evaluate(() => {
      return Array.from(
        new Set(Array.from(document.querySelectorAll('*')).map((el) => el.className)),
      ).filter((c) => c && typeof c === 'string');
    });
    console.log('Sample classes:', classes.slice(0, 50));

    await browser.close();
  } catch (e) {
    console.error('DEBUG ERROR:', e);
  }
}
debug();
