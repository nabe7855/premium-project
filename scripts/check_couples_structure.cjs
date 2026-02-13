const { chromium } = require('playwright');
const fs = require('fs');

async function debugCouples() {
  console.log('--- Debugging Couples.jp Structure ---');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://couples.jp/', { waitUntil: 'domcontentloaded' });
    console.log(`Top Title: ${await page.title()}`);

    // 「神奈川」リンクを探す
    // テキストで探す
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .map((a) => ({
          text: a.innerText.trim(),
          href: a.href,
        }))
        .filter((a) => a.text.includes('神奈川'));
    });

    console.log('Kanagawa Links found on Top:', links);

    if (links.length > 0) {
      const targetUrl = links[0].href;
      console.log(`Navigating to: ${targetUrl}`);
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
      console.log(`Page Title: ${await page.title()}`);

      // ページ内のホテルリンクを探す
      const hotelLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a'))
          .map((a) => a.href)
          .filter((href) => href.includes('/hotels/detail/'));
      });

      console.log(`Hotel Details Links found: ${hotelLinks.length}`);
      if (hotelLinks.length > 0) {
        console.log('Sample:', hotelLinks.slice(0, 3));
      } else {
        // HTML構造ダンプ (一部)
        const html = await page.content();
        fs.writeFileSync('debug_couples_kanagawa.html', html);
        console.log('Saved HTML to debug_couples_kanagawa.html');
      }
    }
  } catch (e) {
    console.error(e);
  }

  await browser.close();
}

debugCouples();
