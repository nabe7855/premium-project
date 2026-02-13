const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function scrapeKanagawa() {
  console.log('--- 神奈川全域スクレイピング開始 (HappyHotelメイン) ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();
  const hotelLinks = new Set();

  try {
    // 1. HappyHotel 神奈川県一覧ページ (エリア検索などを経由せず、都道府県検索結果へ)
    // ページネーションがある場合が多いので、複数ページ巡回が必要かもしれない
    // まずは1ページ目
    const baseUrl = 'https://happyhotel.jp/search/prefecture/14';
    console.log(`Accessing: ${baseUrl}`);
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // ページネーション対応 (とりあえず5ページ分くらい見る)
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(2000);

      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href*="/detail/detail_top.jsp?id="]'))
          .map((a) => a.href)
          .filter((url) => url.includes('happyhotel.jp'));
      });

      console.log(`  Page ${i + 1}: Found ${links.length} hotels.`);
      links.forEach((l) => hotelLinks.add(l));

      // 次へボタンを探す
      const nextButton = await page.$('li.next a, a:has-text("次へ")');
      if (nextButton) {
        console.log('  Clicking Next page...');
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {}),
          nextButton.click(),
        ]);
      } else {
        console.log('  No next page.');
        break;
      }
    }
  } catch (e) {
    console.error(`List Error: ${e.message}`);
  }

  console.log(`\nTotal unique hotels found: ${hotelLinks.size}`);
  const results = [];
  const linksArray = Array.from(hotelLinks);

  // 2. 詳細スクレイピング
  for (let i = 0; i < linksArray.length; i++) {
    // テストのため最初の20件だけにする？ いや、全件いくか、あるいはユーザー要望通り網羅的に。
    // 時間がかかるので、まずは動作確認で30件くらいに絞るのが安全。
    if (i >= 50) break; // 仮制限

    const url = linksArray[i];
    console.log(`[${i + 1}/${linksArray.length}] Scraping: ${url}`);

    try {
      const p = await context.newPage();
      await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      const data = await p.evaluate(() => {
        const name = document.querySelector('h1.name, h1')?.textContent?.trim() || '';
        const address = document.body.innerText.match(/住所\s*([^\n]+)/)?.[1]?.trim() || '';
        const tel = document.body.innerText.match(/電話番号\s*([\d-]+)/)?.[1]?.trim() || '';
        return { name, address, tel };
      });

      if (data.name) {
        results.push({ ...data, url, site: 'HappyHotel' });
      }
      await p.close();
    } catch (e) {
      console.error(`  Error: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  // 3. エリア振り分けとCSV保存
  // 住所からエリアIDを決定する
  const processedData = results.map((h) => {
    let areaId = 'kanagawa-other'; // デフォルト

    // 横浜エリア分け
    if (h.address.includes('横浜市')) {
      if (h.address.includes('西区') || h.address.includes('神奈川区')) areaId = 'yokohama-station';
      if (h.address.includes('港北区')) areaId = 'shin-yokohama';
      if (h.address.includes('中区')) {
        if (
          h.address.includes('福富町') ||
          h.address.includes('伊勢佐木') ||
          h.address.includes('末広町') ||
          h.address.includes('長者町')
        ) {
          areaId = 'kannai';
        } else if (h.address.includes('山下町') || h.address.includes('元町')) {
          areaId = 'motomachi';
        } else {
          areaId = 'kannai'; // 中区のその他は関内・桜木町周辺が多い
        }
      }
      if (h.address.includes('桜木町')) areaId = 'minatomirai';
      if (h.address.includes('戸塚区') || h.address.includes('泉区')) areaId = 'totsuka';
      if (h.address.includes('都筑区')) areaId = 'kohoku';
      if (h.address.includes('金沢区') || h.address.includes('磯子区')) areaId = 'kanazawa';
      if (h.address.includes('保土ヶ谷区')) areaId = 'hodogaya';
      if (h.address.includes('緑区') || h.address.includes('青葉区')) areaId = 'midori';
    }
    // 他の市
    // if (h.address.includes('川崎市')) areaId = 'kawasaki'; // マスタ未登録ならotherのまま、あるいは別途検討

    return {
      name: h.name,
      address: h.address,
      tel: h.tel,
      area_id: areaId,
      site_url: h.url,
    };
  });

  const outputPath = path.join(process.cwd(), 'scraped_data_kanagawa.json');
  fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));
  console.log(`\nSaved ${processedData.length} hotels to ${outputPath}`);

  await browser.close();
}

scrapeKanagawa();
