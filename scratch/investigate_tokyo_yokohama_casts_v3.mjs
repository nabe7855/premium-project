import { supabase } from '../src/lib/supabaseClient.ts';
import fs from 'fs';
import * as cheerio from 'cheerio';

async function investigate() {
  console.log('=== STEP 1: Fetching Yokohama Casts from DB ===');
  
  // 1. 店舗「横浜店」のID取得
  const { data: stores, error: storeErr } = await supabase
    .from('stores')
    .select('id, name, slug')
    .eq('slug', 'yokohama');

  if (storeErr || !stores || stores.length === 0) {
    console.error('Yokohama store not found:', storeErr);
    return;
  }

  const yokohamaStoreId = stores[0].id;
  console.log('Yokohama Store ID:', yokohamaStoreId);

  // 横浜店に所属するキャストIDを取得
  const { data: memberships, error: memErr } = await supabase
    .from('cast_store_memberships')
    .select('cast_id, is_main, is_ichioshi')
    .eq('store_id', yokohamaStoreId);

  if (memErr) {
    console.error('Memberships error:', memErr);
    return;
  }

  const yokohamaCastIds = memberships.map(m => m.cast_id);
  console.log(`Found ${yokohamaCastIds.length} cast memberships for Yokohama.`);

  // 横浜店のキャスト全データ取得
  const { data: yokohamaCasts, error: castErr } = await supabase
    .from('casts')
    .select('id, name, age, profile, catch_copy, is_active, slug, image_url, main_image_url')
    .in('id', yokohamaCastIds);

  if (castErr) {
    console.error('Cast error:', castErr);
    return;
  }

  console.log(`Fetched ${yokohamaCasts.length} Yokohama cast profiles from DB.`);

  // 2. 東京サイト (https://sutoroberrys.com/main/ またはキャスト一覧) のフェッチ＆スクレイピング
  console.log('\n=== STEP 2: Fetching Tokyo Cast List from sutoroberrys.com ===');
  
  const tokyoBaseUrl = 'https://sutoroberrys.com';
  // 東京サイトのキャスト一覧 URL (通常 /main/ や /cast/ など)
  const tokyoListUrls = [
    'https://sutoroberrys.com/main/',
    'https://sutoroberrys.com/therapist/',
    'https://sutoroberrys.com/cast/'
  ];

  let tokyoHtml = '';
  let fetchedUrl = '';
  for (const url of tokyoListUrls) {
    try {
      console.log(`Fetching ${url}...`);
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      if (res.ok) {
        tokyoHtml = await res.text();
        fetchedUrl = url;
        console.log(`Successfully fetched from ${url} (Status: ${res.status}, Length: ${tokyoHtml.length})`);
        break;
      } else {
        console.log(`Status ${res.status} for ${url}`);
      }
    } catch (e) {
      console.log(`Error fetching ${url}: ${e.message}`);
    }
  }

  const $ = cheer.load ? cheer.load(tokyoHtml) : cheerio.load(tokyoHtml);
  
  // 東京サイトのキャスト名・詳細リンク抽出
  const tokyoCastList = [];
  
  // cheerioのパース処理
  $('a[href*="/therapist/"], a[href*="/cast/"], a[href*="/profile/"], .cast-card, .therapist-card, .cast_list_item, .cast-box, article').each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr('href');
    if (text || href) {
      tokyoCastList.push({ text, href });
    }
  });

  console.log(`Found ${tokyoCastList.length} potential cast links/cards on Tokyo site.`);

  // リポジトリ保存用 JSON
  const resultData = {
    yokohamaCasts,
    tokyoHtmlSnippet: tokyoHtml.substring(0, 2000),
    tokyoCastList: tokyoCastList.slice(0, 50)
  };

  fs.writeFileSync('scratch/tokyo_yokohama_investigation_raw.json', JSON.stringify(resultData, null, 2));
  console.log('Saved raw data to scratch/tokyo_yokohama_investigation_raw.json');
}

investigate().catch(console.error);
