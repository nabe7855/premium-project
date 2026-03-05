import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// 都道府県コード -> スラッグ
const PREF_SLUGS = {
  '01': 'hokkaido',
  '02': 'aomori',
  '03': 'iwate',
  '04': 'miyagi',
  '05': 'akita',
  '06': 'yamagata',
  '07': 'fukushima',
  '08': 'ibaraki',
  '09': 'tochigi',
  10: 'gumma',
  11: 'saitama',
  12: 'chiba',
  13: 'tokyo',
  14: 'kanagawa',
  15: 'niigata',
  16: 'toyama',
  17: 'ishikawa',
  18: 'fukui',
  19: 'yamanashi',
  20: 'nagano',
  21: 'gifu',
  22: 'shizuoka',
  23: 'aichi',
  24: 'mie',
  25: 'shiga',
  26: 'kyoto',
  27: 'osaka',
  28: 'hyogo',
  29: 'nara',
  30: 'wakayama',
  31: 'tottori',
  32: 'shimane',
  33: 'okayama',
  34: 'hiroshima',
  35: 'yamaguchi',
  36: 'tokushima',
  37: 'kagawa',
  38: 'ehime',
  39: 'kochi',
  40: 'fukuoka',
  41: 'saga',
  42: 'nagasaki',
  43: 'kumamoto',
  44: 'oita',
  45: 'miyazaki',
  46: 'kagoshima',
  47: 'okinawa',
};

const PREF_NAMES = {
  '01': '北海道',
  '02': '青森県',
  '03': '岩手県',
  '04': '宮城県',
  '05': '秋田県',
  '06': '山形県',
  '07': '福島県',
  '08': '茨城県',
  '09': '栃木県',
  10: '群馬県',
  11: '埼玉県',
  12: '千葉県',
  13: '東京都',
  14: '神奈川県',
  15: '新潟県',
  16: '富山県',
  17: '石川県',
  18: '福井県',
  19: '山梨県',
  20: '長野県',
  21: '岐阜県',
  22: '静岡県',
  23: '愛知県',
  24: '三重県',
  25: '滋賀県',
  26: '京都府',
  27: '大阪府',
  28: '兵庫県',
  29: '奈良県',
  30: '和歌山県',
  31: '鳥取県',
  32: '島根県',
  33: '岡山県',
  34: '広島県',
  35: '山口県',
  36: '徳島県',
  37: '香川県',
  38: '愛媛県',
  39: '高知県',
  40: '福岡県',
  41: '佐賀県',
  42: '長崎県',
  43: '熊本県',
  44: '大分県',
  45: '宮崎県',
  46: '鹿児島県',
  47: '沖縄県',
};

async function main() {
  // CSVを読み込む
  const csvPath =
    'C:/Users/nabe7/Documents/Projects/Projects/autotool/2026-03-06.000148.9531938824623771998556.csv';
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n').filter((l) => l.trim());
  console.log(`CSV lines: ${lines.length}`);

  // Step 1: 既存のlh_prefecturesを確認
  const { data: existingPrefs } = await supabase.from('lh_prefectures').select('id, name');
  console.log('Existing prefs:', existingPrefs?.map((p) => `"${p.id}"`).join(', '));

  // Step 2: 存在しない都道府県を追加（nameのUNIQUE制約に注意して既存nameと重複しないもののみ）
  const existingNames = new Set((existingPrefs || []).map((p) => p.name));
  const existingIds = new Set((existingPrefs || []).map((p) => p.id));

  const newPrefs = Object.entries(PREF_SLUGS)
    .map(([code, slug]) => ({ id: slug, name: PREF_NAMES[code] }))
    .filter((p) => !existingIds.has(p.id) && !existingNames.has(p.name));

  console.log(`\nNew prefs to insert: ${newPrefs.length}`);

  if (newPrefs.length > 0) {
    const { error } = await supabase.from('lh_prefectures').insert(newPrefs);
    if (error) {
      console.error('Insert prefs error:', error.message);
    } else {
      console.log(`OK`);
    }
  }

  // Step 3: 全都道府県のIDマッピングを構築 (DBに存在するIDのみ使用)
  const { data: allPrefs } = await supabase.from('lh_prefectures').select('id, name');
  console.log('\nAll prefs in DB after insert:', allPrefs?.length);

  // name -> id のマップを作る
  const nameToId = {};
  allPrefs?.forEach((p) => {
    nameToId[p.name] = p.id;
  });

  // slug -> id のマップ (スラッグが直接IDになっていればそのまま)
  const slugToId = {};
  Object.entries(PREF_SLUGS).forEach(([code, slug]) => {
    const name = PREF_NAMES[code];
    // DBにスラッグIDがあればそれを使用、なければnameからID検索
    if (existingIds.has(slug)) {
      slugToId[slug] = slug;
    } else if (nameToId[name]) {
      slugToId[slug] = nameToId[name];
    }
  });

  console.log(
    'Slug to DB ID mapping (first 5):',
    Object.entries(slugToId)
      .slice(0, 5)
      .map(([k, v]) => `${k}->${v}`)
      .join(', '),
  );

  // Step 4: CSVから市区町村を解析してインサート
  console.log('\nParsing cities...');
  const cityRows = [];

  for (const line of lines) {
    const match = line.match(/^"(\d{5})","([^"]+)"/);
    if (!match) continue;

    const [, code, name] = match;
    const prefCode = code.slice(0, 2);
    const slug = PREF_SLUGS[prefCode];
    if (!slug) continue;

    const dbPrefId = slugToId[slug];
    if (!dbPrefId) continue; // そのDBに存在しない場合スキップ

    cityRows.push({
      id: code,
      name: name,
      prefecture_id: dbPrefId,
    });
  }

  console.log(`Parsed ${cityRows.length} cities.`);

  // 既存のIDを確認してスキップ
  const { data: existingCities } = await supabase.from('lh_cities').select('id');
  const existingCityIds = new Set((existingCities || []).map((c) => c.id));
  const newCities = cityRows.filter((c) => !existingCityIds.has(c.id));
  console.log(
    `New cities to insert: ${newCities.length} (skipping ${existingCityIds.size} existing)`,
  );

  // バッチインサート
  const BATCH = 200;
  let inserted = 0;
  let errCount = 0;

  for (let i = 0; i < newCities.length; i += BATCH) {
    const batch = newCities.slice(i, i + BATCH);
    const { error } = await supabase.from('lh_cities').insert(batch);
    if (error) {
      errCount++;
      if (errCount <= 2)
        console.error(`\nBatch error:`, error.message, 'Sample:', JSON.stringify(batch[0]));
    } else {
      inserted += batch.length;
      if (i % (BATCH * 5) === 0) console.log(`Progress: ${inserted}/${newCities.length}`);
    }
  }

  console.log(`\nDone! Inserted ${inserted} / ${newCities.length} cities. Errors: ${errCount}`);

  // 確認
  const { count } = await supabase.from('lh_cities').select('*', { count: 'exact', head: true });
  console.log('Total cities in DB:', count);

  const { data: sample } = await supabase
    .from('lh_cities')
    .select('id, name')
    .eq('prefecture_id', slugToId['fukushima'] || 'fukushima')
    .limit(5);
  console.log('Fukushima sample:', JSON.stringify(sample));
}

main().catch(console.error);
