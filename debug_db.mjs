import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment variables are missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  try {
    console.log('--- Prefectures ---');
    const { data: prefs, error: pErr } = await supabase.from('lh_prefectures').select('*');
    if (pErr) console.error(pErr);
    else console.table(prefs);

    console.log('\n--- Cities ---');
    const { data: cities, error: cErr } = await supabase
      .from('lh_cities')
      .select('*, lh_prefectures(name)');
    if (cErr) console.error(cErr);
    else {
      // Filter in JS to see entries for fukuoka
      const fukuokaCities = cities.filter(
        (c) =>
          c.prefecture_id === 'fukuoka' ||
          c.prefecture_id === '40' || // Fukuoka prefecture code might be 40
          (c.lh_prefectures && c.lh_prefectures.name.includes('福岡')),
      );
      console.log('Found', fukuokaCities.length, 'cities for Fukuoka');
      console.table(fukuokaCities);
      console.log('Total cities in DB:', cities.length);
    }

    console.log('\n--- Areas for Shinjuku (sample) ---');
    const { data: areas, error: aErr } = await supabase.from('lh_areas').select('*');
    if (aErr) console.error(aErr);
    else {
      console.log('Total areas in DB:', areas.length);
      console.table(areas.slice(0, 10));
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

debug();
