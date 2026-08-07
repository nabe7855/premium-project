import { prisma } from '../src/lib/prisma.ts';
import fs from 'fs';
import * as cheerio from 'cheerio';

async function analyze() {
  console.log('=== DETAILED ANALYSIS: TOKYO SITE vs YOKOHAMA STORE ===\n');

  // 1. 横浜店のキャストデータ（DBより取得）
  const yokohamaCasts = await prisma.$queryRaw`
    SELECT c.id, c.name, c.age, c.profile, c.catch_copy, c.is_active, c.slug, c.image_url, c.main_image_url
    FROM casts c
    JOIN cast_store_memberships m ON c.id = m.cast_id
    JOIN stores s ON m.store_id = s.id
    WHERE s.slug = 'yokohama' AND c.is_active = true
  `;

  // テスト用アカウント（www, popop, 受付担当など）を除外
  const validYokohamaCasts = yokohamaCasts.filter(c => 
    !['www', 'popop', '受付担当', 'あああ', 'wwwww', '田中　テスト用'].includes(c.name)
  );

  console.log(`Valid Yokohama Casts count: ${validYokohamaCasts.length}`);

  // 2. 東京サイト HTML (scratch/tokyo_page.html) の解析
  const tokyoHtml = fs.readFileSync('scratch/tokyo_page.html', 'utf8');
  const $ = cheerio.load(tokyoHtml);

  // 東京サイトのキャスト情報を抽出
  // cheerioでキャスト要素を探索
  const tokyoCasts = [];

  // 各キャスト要素/カード
  // 例: .cast-box, .therapist-item, <a> など
  $('a').each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim();
    if (href.includes('therapist') || href.includes('cast') || href.includes('profile') || href.includes('.html')) {
      // 親要素のテキストなども収集
      const cardText = $(el).closest('div, li, article, section').text().trim();
      tokyoCasts.push({ href, text, cardText });
    }
  });

  console.log(`Found ${tokyoCasts.length} links on Tokyo site.`);

  // 東京サイトの個別のキャストプロフィールページも取得できるようにリンク一覧を収集
  const tokyoCastUrls = new Set();
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && (href.includes('therapist') || href.includes('cast') || href.includes('/profile/') || href.match(/\/[a-zA-Z0-9_-]+\.html$/))) {
      let fullUrl = href;
      if (!href.startsWith('http')) {
        fullUrl = new URL(href, 'https://sutoroberrys.com/main/').href;
      }
      tokyoCastUrls.add(fullUrl);
    }
  });

  console.log('Tokyo Cast URLs found:', Array.from(tokyoCastUrls));

  // 東京サイトから全テキストおよびキャスト名の抽出
  const pageText = $('body').text();
  console.log('\nChecking matching casts between Tokyo site & Yokohama store:');

  const matchedCasts = [];

  for (const yCast of validYokohamaCasts) {
    const nameMatch = pageText.includes(yCast.name);
    // 東京DBやスクレイピングから探す
    matchedCasts.push({
      yokohamaCast: yCast,
      foundOnTokyoSite: nameMatch
    });
  }

  console.log('\nMatch Status Summary:');
  for (const m of matchedCasts) {
    console.log(`- ${m.yokohamaCast.name} (Age: ${m.yokohamaCast.age}, Slug: ${m.yokohamaCast.slug}): Found on Tokyo site? -> ${m.foundOnTokyoSite ? 'YES' : 'NO'}`);
  }
}

analyze().catch(console.error);
