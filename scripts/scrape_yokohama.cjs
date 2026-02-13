const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// エリアマッピング定義 (住所/エリア名 -> area_id)
const AREA_MAPPING = {
  横浜駅: 'yokohama-station',
  鶴屋町: 'yokohama-station',
  西区: 'yokohama-station', // 西区は横浜駅周辺が多いが、みなとみらいもあるので注意
  新横浜: 'shin-yokohama',
  港北区: 'shin-yokohama', // 新横浜は港北区
  関内: 'kannai',
  伊勢佐木: 'kannai',
  中区: 'kannai', // 中区は関内・中華街・元町など
  元町: 'motomachi',
  中華街: 'motomachi',
  山下町: 'motomachi',
  桜木町: 'minatomirai',
  みなとみらい: 'minatomirai',
  戸塚: 'totsuka',
  泉区: 'totsuka',
  都筑: 'kohoku', // 港北ニュータウン
  金沢: 'kanazawa',
  磯子: 'kanazawa',
  保土ヶ谷: 'hodogaya',
  緑区: 'midori',
  青葉区: 'midori',
  町田: 'machida', // 今回は除外するか、神奈川扱いにするか
};

// スクレイピング対象URL (Couples.jp 横浜エリア)
// 実際にはURLを確認する必要があるが、一旦仮定して試行錯誤する
const TARGET_URL = 'https://couples.jp/prefecture/kanagawa/yokohama';

async function scrapeYokohama() {
  console.log('--- Scrape Start: Yokohama ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  try {
    // 1. 一覧ページにアクセス
    console.log(`Navigating to: ${TARGET_URL}`);
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // カップルズの場合、エリア選択があるかもしれないので、全件表示などを探す
    // ここでは簡易的に、表示されているホテルを取得する

    // ホテルリンクを取得
    const hotelLinks = await page.evaluate(() => {
      // リンクを含む要素を探す (セレクタは要調整)
      // .p-hotelList__itemTitle a とか
      const links = Array.from(document.querySelectorAll('a[href*="/hotel/"]'));
      return links
        .map((a) => a.href)
        .filter((href, index, self) => self.indexOf(href) === index) // 重複排除
        .filter((href) => !href.includes('/campaign/') && !href.includes('/coupon/')); // キャンペーンなどは除外
    });

    console.log(`Found ${hotelLinks.length} hotel links.`);

    const hotels = [];

    // 2. 各ホテルページを詳細スクレイピング
    for (const link of hotelLinks.slice(0, 5)) {
      // テスト用に5件だけ
      console.log(`Processing: ${link}`);
      try {
        await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const hotelData = await page.evaluate(() => {
          const name = document.querySelector('h1')?.textContent?.trim() || '';
          const address =
            document
              .querySelector('td:contains("住所"), th:contains("住所") + td')
              ?.textContent?.trim() ||
            document.body.textContent.match(/住所[：:]\s*(.+?)\n/)?.[1] ||
            '';
          const tel = document.querySelector('a[href^="tel:"]')?.textContent?.trim() || '';

          return { name, address, tel };
        });

        // エリア判定
        let areaId = 'other'; // デフォルト
        for (const [key, id] of Object.entries(AREA_MAPPING)) {
          // ここでは定義できないので後で処理
          // page.evaluate内では外部変数見えないので、戻り値を受け取ってから判定
        }

        hotels.push({ ...hotelData, url: link });
      } catch (e) {
        console.error(`Error processing ${link}: ${e.message}`);
      }
      await page.waitForTimeout(1000); // 負荷軽減
    }

    // エリアID割り当てとCSV出力準備
    const csvData = hotels.map((h) => {
      let areaId = '';
      for (const [key, id] of Object.entries(AREA_MAPPING)) {
        if (h.address.includes(key)) {
          areaId = id;
          break; // 最初に見つかったものを優先（詳細な地名から順に定義すると良い）
        }
      }
      // なければ住所から推測するか、その他にする
      if (!areaId) areaId = 'yokohama-other';

      return {
        name: h.name,
        address: h.address,
        tel: h.tel,
        area_id: areaId,
        url: h.url,
      };
    });

    console.log('--- Sample Data ---');
    console.log(csvData);

    // TODO: ここで全件取得ループとCSV保存を実装する
  } catch (e) {
    console.error(`Main Error: ${e.message}`);
  } finally {
    await browser.close();
  }
}

// 実行
// scrapeYokohama();
module.exports = { scrapeYokohama };
