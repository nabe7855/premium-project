import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const CSV_PATH = path.join(process.cwd(), 'data', 'hotels_enriched_data.csv');
const RAW_DATA_PATH = path.join(process.cwd(), 'data', 'raw_hotel_data', 'hotels_raw_data.json');

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36';

async function findHotelUrl(page, name, address) {
  const cleanName = name
    .replace(/【[^】]+】/g, '')
    .replace(/\([^)]+\)/g, '')
    .replace(/（[^）]+）/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const searchUrl = `https://couples.jp/hotels/search-by/somewhere/${encodeURIComponent(cleanName)}`;
  console.log(`  - 検索実行: ${cleanName}`);

  try {
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 4000));

    const foundUrl = await page.evaluate((targetName) => {
      const items = Array.from(document.querySelectorAll('.p-cassette__item'));
      for (const item of items) {
        const nameEl = item.querySelector('.p-cassette__name');
        const linkEl = item.querySelector('a.p-cassette__headBox');
        if (nameEl && linkEl) {
          const hotelName = nameEl.innerText;
          if (hotelName.includes(targetName) || targetName.includes(hotelName)) {
            return linkEl.href;
          }
        }
      }
      const first = document.querySelector('.p-cassette__headBox');
      return first ? first.href : null;
    }, cleanName);

    return foundUrl;
  } catch (e) {
    console.log(`  - 検索エラー: ${e.message}`);
    return null;
  }
}

async function scrapeHotel(page, url) {
  console.log(`  - 内容取得中: ${url}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 5000));

    // セレクタが読み込まれるまで待機
    await page.waitForSelector('.hd-mainTitle', { timeout: 10000 }).catch(() => {});

    // ロボット避け・遅延読み込み対策
    await page.evaluate(() => window.scrollBy(0, 800));
    await new Promise((r) => setTimeout(r, 2000));

    // --- メインページから基本情報と料金を取得 ---
    const data = await page.evaluate(() => {
      const desc1 = document.querySelector('.hd-header__ruby')?.innerText || '';
      const desc2 = document.querySelector('.hd-message__text p')?.innerText || '';
      const description = (desc1 + '\n' + desc2).trim();

      const amenitiesSet = new Set();
      document
        .querySelectorAll('.hd-facility__list li')
        .forEach((li) => amenitiesSet.add(li.innerText.trim()));
      const lendList = document.querySelector('.hd-facility__lendList')?.innerText || '';
      lendList.split('\n').forEach((line) => {
        const clean = line.replace(/^[■★※]/, '').trim();
        if (clean) amenitiesSet.add(clean);
      });
      const amenities = Array.from(amenitiesSet);

      const prices = {};
      const priceRows = Array.from(document.querySelectorAll('.hd-tablePrice tr'));
      priceRows.forEach((row) => {
        const category = row.querySelector('.hd-tablePrice__category')?.innerText.trim();
        if (category) {
          const plans = Array.from(row.querySelectorAll('.hd-pricePlan li'))
            .map((li) => ({
              title: li.querySelector('.hd-pricePlan__title')?.innerText.trim() || '',
              price: li.querySelector('.hd-priceRange__price')?.innerText.trim() || '',
              time: li.querySelector('.hd-timezone')?.innerText.trim() || '',
            }))
            .filter((p) => p.price);
          prices[category] = plans;
        }
      });
      return { description, amenities, prices };
    });

    // --- 口コミページへ移動して「全文」を取得 ---
    await page.goto(`${url}/review`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const reviews = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.hd-reviewItem'))
        .map((item) => {
          const title = item.querySelector('.hd-reviewItem__commentTitle')?.innerText.trim() || '';
          // ユーザーのコメント本文（最初の .hd-reviewItem__commentText）を取得
          const bodyText =
            item.querySelector('.hd-reviewItem__commentText')?.innerText.trim() || '';
          const score = item.querySelector('.p-hotelRating__number')?.innerText || '';
          // 投稿日時を取得 (例: 投稿：2026/02/03 03:57)
          const dateRaw = item.querySelector('.hd-reviewItem__commentDays')?.innerText.trim() || '';
          const date = dateRaw.replace('投稿：', '').trim();
          return { title, body: bodyText, score, date };
        })
        .filter((r) => r.body);
    });

    return { ...data, reviews, detailed_reviews_v3: true };
  } catch (e) {
    console.error(`  - 取得エラー: ${e.message}`);
    return null;
  }
}

async function run(limit = 9999) {
  let store = fs.existsSync(RAW_DATA_PATH)
    ? JSON.parse(fs.readFileSync(RAW_DATA_PATH, 'utf8'))
    : {};
  const lines = fs.readFileSync(CSV_PATH, 'utf8').split('\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,1000'],
  });
  const page = await browser.newPage();
  await page.setUserAgent(USER_AGENT);

  console.log(`[開始] 自動取得（日時入り・詳細版）を開始します...`);

  let count = 0;
  for (let i = 1; i < lines.length; i++) {
    const pts = parseLine(lines[i]);
    if (pts.length < 3) continue;
    const id = pts[0],
      name = pts[1],
      addr = pts[2];

    // 日時入り(detailed_reviews_v3)がまだ無いものは再取得する
    if (store[id] && store[id].detailed_reviews_v3) {
      continue;
    }

    console.log(`\n[${count + 1}] ${name}`);
    const url = await findHotelUrl(page, name, addr);

    if (url) {
      const data = await scrapeHotel(page, url);
      if (data) {
        store[id] = { hotel_name: name, url, ...data, timestamp: new Date().toISOString() };
        console.log(`  -> 成功: 設備 ${data.amenities.length}件 / 口コミ ${data.reviews.length}件`);
      } else {
        console.log(`  -> 内容の抽出に失敗しました。`);
      }
    } else {
      console.log(`  -> URLが見つかりませんでした。`);
      // URLなしとして記録を残す（次回スキップするため。必要なければコメントアウト）
      store[id] = { hotel_name: name, url: null, timestamp: new Date().toISOString() };
    }

    count++;
    // 1件ごとに確実に保存
    fs.writeFileSync(RAW_DATA_PATH, JSON.stringify(store, null, 2));
    console.log(`  >> ${count}件完了。データを保存しました。`);

    if (count >= limit) break;

    const wait = 20000 + Math.random() * 10000;
    await new Promise((r) => setTimeout(r, wait));
  }

  fs.writeFileSync(RAW_DATA_PATH, JSON.stringify(store, null, 2));
  await browser.close();
  console.log('\n[終了] すべて完了しました。');
}

function parseLine(l) {
  let r = [],
    c = '',
    q = false;
  for (let i = 0; i < l.length; i++) {
    if (l[i] === '"' && l[i + 1] === '"') {
      c += '"';
      i++;
    } else if (l[i] === '"') q = !q;
    else if (l[i] === ',' && !q) {
      r.push(c);
      c = '';
    } else c += l[i];
  }
  r.push(c);
  return r;
}

run();
