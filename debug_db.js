const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// .env.local を読み込む
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment variables are missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  console.log('--- Prefectures ---');
  const { data: prefs, error: pErr } = await supabase.from('lh_prefectures').select('*');
  if (pErr) console.error(pErr);
  else console.table(prefs);

  console.log('\n--- Cities for fukuoka ---');
  const { data: cities, error: cErr } = await supabase
    .from('lh_cities')
    .select('*, lh_prefectures(name)');
  if (cErr) console.error(cErr);
  else {
    // Filter in JS to be safe
    const fukuokaCities = cities.filter(
      (c) =>
        c.prefecture_id === 'fukuoka' ||
        (c.lh_prefectures && c.lh_prefectures.name.includes('福岡')),
    );
    console.table(fukuokaCities);
    console.log('All cities count:', cities.length);
  }

  console.log('\n--- Areas ---');
  const { data: areas, error: aErr } = await supabase.from('lh_areas').select('*');
  if (aErr) console.error(aErr);
  else console.table(areas.slice(0, 10));
}

debug();
