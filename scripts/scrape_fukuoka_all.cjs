const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * 福岡全域ホテル情報抽出スクリプト
 *
 * 抽出対象エリア (Couples.jp準拠):
 * 514: 天神・中洲・博多
 * 513: 福岡空港周辺・大野城
 * 509: 平尾・薬院
 * 774: 那の津・港
 * 515: 姪浜・糸島
 * 775: 西新・城南
 * 510: 小倉・門司
 * 512: 黒崎・八幡
 * 516: 久留米
 * 520: 遠賀
 * 517: 飯塚
 * 508: 大牟田・柳川
 * 581: 行橋・京築
 * 518: 八女・筑後
 * 504: 新宮・粕屋
 * 507: 宗像・福津
 * 503: 朝倉・小郡
 * 519: 筑紫野・那珂川
 * 776: 直方・鞍手
 * 777: 田川
 */

const COUPLES_AREAS = [
  { id: '514', name: '天神・中洲・博多' },
  { id: '513', name: '福岡空港・大野城' },
  { id: '509', name: '平尾・薬院' },
  { id: '774', name: '那の津・港' },
  { id: '515', name: '姪浜・糸島' },
  { id: '775', name: '西新・城南' },
  { id: '510', name: '小倉・門司' },
  { id: '512', name: '黒崎・八幡' },
  { id: '516', name: '久留米' },
  { id: '520', name: '遠賀' },
  { id: '517', name: '飯塚' },
  { id: '508', name: '大牟田・柳川' },
  { id: '581', name: '行橋・京築' },
  { id: '518', name: '八女・筑後' },
  { id: '504', name: '新宮・粕屋' },
  { id: '507', name: '宗像・福津' },
  { id: '503', name: '朝倉・小郡' },
  { id: '519', name: '筑紫野・那珂川' },
  { id: '776', name: '直方・鞍手' },
  { id: '777', name: '田川' },
];

async function scrapeFukuoka() {
  console.log('--- 福岡全域スクレイピング開始 ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  });

  const results = [];
  const processedUrls = new Set();

  for (const area of COUPLES_AREAS) {
    console.log(`\nエリア確認中: ${area.name} (ID: ${area.id})`);
    const page = await context.newPage();
    try {
      const url = `https://couples.jp/hotels/search-by/hotelareas/${area.id}`;
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      // ホテル一覧取得
      const hotels = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.p-cassette__headBox'))
          .map((el) => ({
            name: el.querySelector('.p-cassette__name')?.innerText.trim() || '',
            url: el.href,
          }))
          .filter((h) => h.url);
      });

      console.log(`  ${hotels.length}件のホテルが見つかりました。`);

      for (const h of hotels) {
        if (processedUrls.has(h.url)) continue;
        processedUrls.add(h.url);

        console.log(`    詳細取得中: ${h.name}`);
        const detailPage = await context.newPage();
        try {
          await detailPage.goto(h.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await detailPage.waitForTimeout(1000);
          const bodyText = await detailPage.evaluate(() => document.body.innerText);

          results.push({
            site: 'Couples',
            area: area.name,
            name: h.name,
            url: h.url,
            raw_text: bodyText,
          });
        } catch (e) {
          console.error(`      エラー(${h.url}): ${e.message}`);
        } finally {
          await detailPage.close();
        }
        // 負荷軽減のため待機
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (err) {
      console.error(`  エリア ${area.name} でエラー: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  // 他のサイトも余力があれば追加するが、まずはCouplesで網羅性を確保
  // Stay Lovely Fukuoka
  console.log('\n--- Stay Lovely 福岡全体チェック ---');
  const stayPage = await context.newPage();
  try {
    await stayPage.goto('https://stay-lovely.jp/hotels/pref/40', { waitUntil: 'domcontentloaded' });
    await stayPage.waitForTimeout(3000);
    const stayLinks = await stayPage.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .filter((a) => a.href.includes('/hotels/') && !a.href.includes('/pref/'))
        .map((a) => ({ name: a.innerText.trim(), url: a.href }));
    });
    const uniqueStay = Array.from(new Map(stayLinks.map((h) => [h.url, h])).values());
    console.log(`  Stay Lovelyで${uniqueStay.length}件のリンクを検出。`);

    for (const h of uniqueStay.slice(0, 20)) {
      // 多すぎる場合は制限
      if (processedUrls.has(h.url)) continue;
      processedUrls.add(h.url);

      console.log(`    詳細取得中: ${h.name}`);
      const detailPage = await context.newPage();
      try {
        await detailPage.goto(h.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const text = await detailPage.evaluate(() => document.body.innerText);
        results.push({ site: 'StayLovely', name: h.name, url: h.url, raw_text: text });
      } catch (e) {}
      await detailPage.close();
      await new Promise((r) => setTimeout(r, 1000));
    }
  } catch (e) {
  } finally {
    await stayPage.close();
  }

  // 結果保存
  const outputPath = path.join(process.cwd(), 'scraped_data_fukuoka_all.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n--- 完了 ---`);
  console.log(`合計 ${results.length} 件のホテルデータを抽出しました。`);
  console.log(`保存先: ${outputPath}`);

  await browser.close();
}

scrapeFukuoka();
