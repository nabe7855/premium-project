import { prisma } from '../src/lib/prisma.ts';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function investigate() {
  console.log('=== STEP 1: Fetching Yokohama Casts via Raw SQL ===');

  // 横浜店の店舗情報
  const stores = await prisma.$queryRaw`
    SELECT id, name, slug FROM stores WHERE slug = 'yokohama' OR name LIKE '%横浜%';
  `;
  console.log('Yokohama Stores:', stores);

  if (!stores || stores.length === 0) {
    console.log('No Yokohama store found in DB');
    return;
  }

  const yokohamaStoreId = stores[0].id;

  // 横浜店所属キャスト一覧
  const yokohamaCasts = await prisma.$queryRaw`
    SELECT c.id, c.name, c.age, c.profile, c.catch_copy, c.is_active, c.slug, c.image_url, c.main_image_url
    FROM casts c
    JOIN cast_store_memberships m ON c.id = m.cast_id
    WHERE m.store_id = ${yokohamaStoreId}
  `;

  console.log(`Fetched ${yokohamaCasts.length} Yokohama casts from DB:`);
  console.log(yokohamaCasts.map(c => ({ id: c.id, name: c.name, age: c.age, slug: c.slug })));

  // 東京店の店舗情報とキャストもDBにいるかチェック
  const tokyoStores = await prisma.$queryRaw`
    SELECT id, name, slug FROM stores WHERE slug = 'tokyo' OR name LIKE '%東京%';
  `;
  console.log('\nTokyo Stores in DB:', tokyoStores);

  let tokyoDbCasts = [];
  if (tokyoStores && tokyoStores.length > 0) {
    tokyoDbCasts = await prisma.$queryRaw`
      SELECT c.id, c.name, c.age, c.profile, c.catch_copy, c.is_active, c.slug
      FROM casts c
      JOIN cast_store_memberships m ON c.id = m.cast_id
      WHERE m.store_id = ${tokyoStores[0].id}
    `;
    console.log(`Tokyo DB Casts count: ${tokyoDbCasts.length}`);
  }

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

  // デバッグ用に保存
  fs.writeFileSync('scratch/tokyo_page.html', tokyoHtml);
  fs.writeFileSync('scratch/yokohama_casts_db.json', JSON.stringify(yokohamaCasts, null, 2));

  console.log('Saved to scratch/tokyo_page.html and scratch/yokohama_casts_db.json');
}

investigate().catch(console.error);
