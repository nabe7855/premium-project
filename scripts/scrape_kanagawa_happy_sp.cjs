const { chromium } = require('playwright');
const fs = require('fs');

async function scrapeHappySP() {
  console.log('--- HappyHotel SP版 神奈川全域スクレイピング ---');
  // iPhoneとして振る舞う
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 667 },
    isMobile: true,
  });

  const page = await context.newPage();
  const hotels = [];

  try {
    // 神奈川県検索 (SP版パラメータは推測)
    // 通常は /search/prefecture/14 にアクセスするとUA判定で /sp/ にリダイレクトされるか、レスポンシブ
    // 明示的なSP用URLがあるか？
    // https://happyhotel.jp/search/prefecture/14
    await page.goto('https://happyhotel.jp/search/prefecture/14', {
      waitUntil: 'domcontentloaded',
    });

    // ホテルリストのロードを待つ
    await page.waitForTimeout(5000);

    // スクロールして読み込む (無限スクロールの場合)
    // 今回はページネーションか？
    // リストアイテムを取得

    // セレクタ探索
    const items = await page.evaluate(() => {
      // .hotel-item とか .cassette とか
      // 汎用的にリンクを探す
      const links = Array.from(document.querySelectorAll('a[href*="/detail/"]'));
      return links
        .map((a) => ({
          name: a.innerText.split('\n')[0].trim(), // 最初行が店名と仮定
          url: a.href,
        }))
        .filter((h) => h.name.length > 2 && !h.url.includes('plan'));
    });

    const uniqueItems = Array.from(new Map(items.map((i) => [i.url, i])).values());
    console.log(`Found ${uniqueItems.length} hotels (SP view).`);

    // 詳細取得
    for (const item of uniqueItems.slice(0, 30)) {
      console.log(`Detail: ${item.name}`);
      try {
        await page.goto(item.url, { waitUntil: 'domcontentloaded' });
        // SP版の詳細ページレイアウトに合わせて住所取得
        const address = await page.evaluate(() => {
          // bodyテキストから「住所」を探す
          const text = document.body.innerText;
          const match = text.match(/住所\s*\n\s*([^\n]+)/) || text.match(/〒[\d-]+\s*([^\n]+)/); // 郵便番号の後ろ
          return match ? match[1].trim() : '';
        });

        if (address) {
          hotels.push({
            name: item.name,
            address: address,
            url: item.url,
            site: 'HappyHotel',
          });
        }
      } catch (e) {}
      await new Promise((r) => setTimeout(r, 1000));
    }

    // 保存
    fs.writeFileSync('scraped_data_kanagawa_happy_sp.json', JSON.stringify(hotels, null, 2));
    console.log(`Saved ${hotels.length} hotels.`);
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

scrapeHappySP();
