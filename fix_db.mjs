import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs
  .readFileSync('.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const line_trimmed = line.trim();
    if (!line_trimmed || line_trimmed.startsWith('#')) return acc;
    const [key, ...val] = line_trimmed.split('=');
    if (key && val)
      acc[key.trim()] = val
        .join('=')
        .trim()
        .replace(/^["'](.*)["']$/, '$1');
    return acc;
  }, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  console.log('--- Cleaning up prefix spaces in DB ---');

  // 1. Prefectures
  const { data: prefs, error: pErr } = await supabase.from('lh_prefectures').select('*');
  if (pErr) {
    console.error(pErr);
    return;
  }

  for (const pref of prefs) {
    if (pref.id.trim() !== pref.id) {
      const oldId = pref.id;
      const newId = pref.id.trim();
      console.log(`Fixing prefecture: [${oldId}] -> [${newId}]`);

      // Update related cities
      const { count: cCount } = await supabase
        .from('lh_cities')
        .update({ prefecture_id: newId })
        .eq('prefecture_id', oldId);
      console.log(`Updated ${cCount || 0} cities`);

      // Update related hotels
      const { count: hCount } = await supabase
        .from('lh_hotels')
        .update({ prefecture_id: newId })
        .eq('prefecture_id', oldId);
      console.log(`Updated ${hCount || 0} hotels`);

      // Insert clean record
      await supabase.from('lh_prefectures').insert({ ...pref, id: newId });

      // Delete dirty record
      await supabase.from('lh_prefectures').delete().eq('id', oldId);
    }
  }

  // 2. Cities (just in case city IDs have spaces too)
  const { data: cities, error: cErr } = await supabase.from('lh_cities').select('*');
  if (cErr) {
    console.error(cErr);
    return;
  }

  for (const city of cities) {
    if (city.id.trim() !== city.id) {
      const oldId = city.id;
      const newId = city.id.trim();
      console.log(`Fixing city: [${oldId}] -> [${newId}]`);

      // Update related areas
      await supabase.from('lh_areas').update({ city_id: newId }).eq('city_id', oldId);
      // Update related hotels
      await supabase.from('lh_hotels').update({ city_id: newId }).eq('city_id', oldId);

      await supabase.from('lh_cities').insert({ ...city, id: newId });
      await supabase.from('lh_cities').delete().eq('id', oldId);
    }
  }

  console.log('--- Cleanup Finished ---');
}

fix();
