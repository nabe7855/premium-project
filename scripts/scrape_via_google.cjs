const { chromium } = require('playwright');
const fs = require('fs');

async function scrapeViaGoogle() {
  console.log('--- Google検索経由でURL収集 (神奈川) ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  const query = 'couples.jp 神奈川県 ホテル一覧'; // 検索ワード
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

  // 検索結果のリンクを取得
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .map((a) => a.href)
      .filter((href) => href.includes('couples.jp') && !href.includes('google'));
  });

  console.log('検索結果からのリンク:', links);

  // 有効そうなURLを使ってスクレイピング
  // 例: https://couples.jp/prefecture/kanagawa ではなく https://couples.jp/hotels/list/pref14 みたいな形ならそれを拾う
  // 見つかった最初の有効URLを使う
  const validUrl = links.find((l) => l.includes('/prefecture/') || l.includes('/hotels/'));

  if (validUrl) {
    console.log(`Using base URL: ${validUrl}`);
    await page.goto(validUrl, { waitUntil: 'domcontentloaded' });

    // ここからホテルリンク収集 (前と同じロジック)
    // ...
  } else {
    console.log('有効な一覧URLが見つかりませんでした。別の検索ワードを試します。');
  }

  await browser.close();
}

scrapeViaGoogle();
