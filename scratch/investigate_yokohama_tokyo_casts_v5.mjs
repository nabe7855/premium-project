import { prisma } from '../src/lib/prisma.ts';
import fs from 'fs';

async function investigate() {
  console.log('=== STEP 1: Fetching Yokohama Casts via Raw SQL ===');

  // 横浜店所属キャスト一覧
  const yokohamaCasts = await prisma.$queryRaw`
    SELECT c.id, c.name, c.age, c.profile, c.catch_copy, c.is_active, c.slug, c.image_url, c.main_image_url
    FROM casts c
    JOIN cast_store_memberships m ON c.id = m.cast_id
    JOIN stores s ON m.store_id = s.id
    WHERE s.slug = 'yokohama'
  `;

  console.log(`Fetched ${yokohamaCasts.length} Yokohama casts from DB:`);
  console.log(yokohamaCasts.map(c => ({ id: c.id, name: c.name, age: c.age, slug: c.slug })));

  // 東京店の店舗情報とキャストもDBにいるかチェック
  const tokyoDbCasts = await prisma.$queryRaw`
    SELECT c.id, c.name, c.age, c.profile, c.catch_copy, c.is_active, c.slug
    FROM casts c
    JOIN cast_store_memberships m ON c.id = m.cast_id
    JOIN stores s ON m.store_id = s.id
    WHERE s.slug = 'tokyo'
  `;
  console.log(`Tokyo DB Casts count: ${tokyoDbCasts.length}`);
  if (tokyoDbCasts.length > 0) {
    console.log(tokyoDbCasts.map(c => ({ id: c.id, name: c.name, age: c.age, slug: c.slug })));
  }

  // デバッグ用に保存
  fs.writeFileSync('scratch/yokohama_casts_db.json', JSON.stringify(yokohamaCasts, null, 2));

  // 東京サイト (sutoroberrys.com/main/) の実際のWebページをクローリング/スクレイピング
  console.log('\n=== STEP 2: Scraping Tokyo Site (https://sutoroberrys.com/main/) ===');

  const tokyoUrls = [
    'https://sutoroberrys.com/main/',
    'https://sutoroberrys.com/therapist-list.html',
    'https://sutoroberrys.com/cast.html',
    'https://sutoroberrys.com/'
  ];

  let tokyoHtml = '';
  let fetchedUrl = '';

  for (const url of tokyoUrls) {
    try {
      console.log(`Fetching ${url}...`);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      if (res.ok) {
        tokyoHtml = await res.text();
        fetchedUrl = url;
        console.log(`Success fetching ${url} (Length: ${tokyoHtml.length})`);
        break;
      } else {
        console.log(`Status ${res.status} for ${url}`);
      }
    } catch (e) {
      console.log(`Failed to fetch ${url}: ${e.message}`);
    }
  }

  fs.writeFileSync('scratch/tokyo_page.html', tokyoHtml);
  console.log('Saved to scratch/yokohama_casts_db.json and scratch/tokyo_page.html');
}

investigate().catch(console.error);
