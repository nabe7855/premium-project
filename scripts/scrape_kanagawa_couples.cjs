const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 発見したエリアIDリスト (HTML解析より)
const KANAGAWA_AREAS = [
  // --- 横浜エリア ---
  { id: '233', name: '横浜駅周辺', mappedId: 'yokohama-station' },
  { id: '234', name: '関内・伊勢佐木町', mappedId: 'kannai' },
  { id: '235', name: '元町中華街・石川町', mappedId: 'motomachi' },
  { id: '236', name: '新横浜', mappedId: 'shin-yokohama' },
  { id: '228', name: '磯子・上大岡', mappedId: 'kanazawa' }, // kanazawa or kamiooka
  { id: '229', name: '港北インター・青葉台', mappedId: 'kohoku' }, // or midori
  { id: '232', name: '鶴見・綱島', mappedId: 'kanagawa-other' },
  { id: '237', name: '戸塚・港南', mappedId: 'totsuka' },
  { id: '238', name: '横浜町田インター・保土ヶ谷バイパス', mappedId: 'hodogaya' }, // 町田が含まれるがhodogayaにいれる
  { id: '758', name: '三ツ沢・片倉', mappedId: 'kanagawa-other' },
  { id: '761', name: '保土ヶ谷今井', mappedId: 'hodogaya' },

  // --- 川崎エリア ---
  { id: '239', name: '川崎駅周辺', mappedId: 'kanagawa-other' }, // 川崎マスタがないのでother
  { id: '240', name: '登戸・東名川崎インター周辺', mappedId: 'kanagawa-other' },
  { id: '230', name: '武蔵小杉', mappedId: 'kanagawa-other' },

  // --- 相模原・厚木・その他 ---
  { id: '244', name: '橋本・淵野辺', mappedId: 'kanagawa-other' },
  { id: '763', name: '町田駅・上鶴間本町', mappedId: 'kanagawa-other' }, // 町田
  { id: '247', name: '厚木インター・本厚木・海老名', mappedId: 'kanagawa-other' },
  { id: '242', name: '藤沢・湘南・江ノ島', mappedId: 'kanagawa-other' }, // fujisawa作ってないので
  { id: '241', name: '横須賀・葉山・三浦半島', mappedId: 'kanagawa-other' },
  { id: '248', name: '大和・綾瀬', mappedId: 'kanagawa-other' },
  { id: '243', name: '小田原早川・県西', mappedId: 'kanagawa-other' },
  { id: '246', name: '秦野・伊勢原', mappedId: 'kanagawa-other' },
  { id: '765', name: '大船・鎌倉', mappedId: 'ofuna' }, // ofuna作ってないか一応
];

// mappedId がマスタにないものは kanagawa-other になるように後で正規化する

async function scrapeKanagawaCouplesConfirmed() {
  console.log('--- Couples.jp 神奈川県 (エリアID巡回版) スクレイピング開始 ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  });

  const processedUrls = new Set();
  const results = [];

  for (const area of KANAGAWA_AREAS) {
    console.log(`\nProcessing Area: ${area.name} (ID: ${area.id})`);
    const page = await context.newPage();
    try {
      const url = `https://couples.jp/hotels/search-by/hotelareas/${area.id}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // ホテル一覧取得
      const hotels = await page.evaluate(() => {
        // ホテル詳細リンクは /hotel-details/xxxx という形式
        const links = Array.from(document.querySelectorAll('a[href*="/hotel-details/"]'));
        return links
          .map((a) => ({
            name: a.innerText.trim(),
            url: a.href,
          }))
          .filter(
            (h) =>
              h.url &&
              h.name &&
              !h.url.includes('/review') &&
              !h.url.includes('/coupon') &&
              !h.url.includes('/photo') &&
              !h.url.includes('/map'),
          );
      });

      // 重複排除とURL正規化
      const uniqueHotels = [];
      const seen = new Set();
      for (const h of hotels) {
        // URLにパラメータがつくことがあるので、パス部分だけで判定
        const cleanUrl = h.url.split('?')[0];
        if (!seen.has(cleanUrl)) {
          seen.add(cleanUrl);
          uniqueHotels.push({ ...h, url: cleanUrl });
        }
      }

      console.log(`  Found ${uniqueHotels.length} hotels.`);

      // 詳細取得
      for (const h of uniqueHotels) {
        if (processedUrls.has(h.url)) continue;
        processedUrls.add(h.url);

        console.log(`    Scraping: ${h.name}`);
        const p = await context.newPage();
        try {
          await p.goto(h.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
          const data = await p.evaluate(() => {
            const name = document.querySelector('h1')?.innerText.trim() || '';

            const ths = Array.from(document.querySelectorAll('th'));
            let address = '';
            const addressTh = ths.find((th) => th.innerText.includes('住所'));
            if (addressTh) address = addressTh.nextElementSibling?.innerText.trim();
            if (!address)
              address = document.body.innerText.match(/住所[：:]\s*(.+?)\n/)?.[1]?.trim() || '';

            let tel = '';
            const telTh = ths.find((th) => th.innerText.includes('電話'));
            if (telTh) tel = telTh.nextElementSibling?.innerText.trim();
            if (!tel) tel = document.querySelector('a[href^="tel:"]')?.innerText.trim() || '';

            return { name, address, tel };
          });

          if (data.name) {
            results.push({
              ...data,
              url: h.url,
              site: 'Couples',
              area_id: area.mappedId, // マップ済みのIDを使用
            });
          }
        } catch (e) {
          console.error(`    Error: ${e.message}`);
        } finally {
          await p.close();
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (e) {
      console.error(`  Area Error: ${e.message}`);
    } finally {
      await page.close();
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  // 最後にIDの整合性チェック (マスタにないIDは kanagawa-other に)
  const validIds = [
    'yokohama-station',
    'shin-yokohama',
    'kannai',
    'motomachi',
    'minatomirai',
    'totsuka',
    'kohoku',
    'kanazawa',
    'hodogaya',
    'midori',
  ];

  const finalData = results.map((h) => {
    let aid = h.area_id;
    if (!validIds.includes(aid)) aid = 'kanagawa-other';
    return { ...h, area_id: aid };
  });

  const outputPath = path.join(process.cwd(), 'scraped_data_kanagawa.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
  console.log(`\n--- Completed ---`);
  console.log(`Saved ${finalData.length} hotels to ${outputPath}`);

  await browser.close();
}

scrapeKanagawaCouplesConfirmed();
