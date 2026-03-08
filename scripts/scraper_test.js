import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  );

  const query = 'フローレスII 燕市 site:couples.jp';
  console.log('Searching DuckDuckGo:', query);

  try {
    await page.goto(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
    await page.waitForSelector('a.result__url', { timeout: 10000 });

    const links = await page.$$eval('a.result__url', (as) => as.map((a) => a.href));
    console.log('DuckDuckGo links:', links);

    const couplesLink = links.find((l) => l.includes('couples.jp/hotel-details/'));

    if (couplesLink) {
      console.log('Navigating to hotel page:', couplesLink);
      // Couples might still block us if we don't have good headers, but let's try
      await page.goto(couplesLink);
      await new Promise((r) => setTimeout(r, 2000));

      const rawText = await page.evaluate(() => document.body.innerText);
      console.log(
        'Couples page loaded, body text excerpt:',
        rawText.slice(0, 300).replace(/\n/g, ' '),
      );
    } else {
      console.log('No couples.jp link found in search results.');
    }
  } catch (e) {
    console.error('Error:', e.message);
  }

  await browser.close();
})();
