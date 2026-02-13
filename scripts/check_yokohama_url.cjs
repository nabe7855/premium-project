const { chromium } = require('playwright');

async function checkUrl() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 予想されるURL
  const url = 'https://couples.jp/prefecture/kanagawa/city/yokohama'; // city/yokohama かも？
  // const url = 'https://couples.jp/Search/pref_14_kw_横浜'; // 全文検索かも？
  // 確実に存在するであろうURLを試す
  const testUrl1 = 'https://couples.jp/prefecture/kanagawa'; // 神奈川県トップ

  try {
    console.log(`Checking: ${testUrl1}`);
    await page.goto(testUrl1, { timeout: 30000 });
    const title = await page.title();
    console.log(`Title: ${title}`);

    // エリアリンクを探す
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .map((a) => ({
          text: a.innerText,
          href: a.href,
        }))
        .filter((l) => l.text.includes('横浜'));
    });

    console.log('横浜関連のリンク:', links.slice(0, 5));
  } catch (e) {
    console.error(`Error: ${e.message}`);
  } finally {
    await browser.close();
  }
}

checkUrl();
