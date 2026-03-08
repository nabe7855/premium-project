import fs from 'fs';
import puppeteer from 'puppeteer';

async function debug() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    const cleanName = 'HOTEL D 大宮';
    const searchUrl = `https://couples.jp/hotel-search?kw=${encodeURIComponent(cleanName)}`;
    console.log(`URL: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    console.log('Navigation done');
    await new Promise((r) => setTimeout(r, 5000));

    const html = await page.content();
    fs.writeFileSync('debug_couples.html', html);
    console.log('HTML saved');

    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map((a) => ({
        text: a.innerText,
        href: a.href,
      }));
    });
    console.log(`Found ${links.length} links`);
    const relevant = links.filter((l) => l.href.includes('hotel-details'));
    console.log('Relevant links:', JSON.stringify(relevant.slice(0, 5), null, 2));

    await browser.close();
  } catch (e) {
    console.error('DEBUG ERROR:', e);
  }
}
debug();
