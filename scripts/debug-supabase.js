import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  const storeSlug = 'osaka';
  const { data: store } = await supabase
    .from('stores')
    .select('id, name')
    .eq('slug', storeSlug)
    .single();
  console.log('Store:', store);

  const dateStr = '2026-02-28';
  console.log(`\nChecking schedules for ${storeSlug} on ${dateStr} using casts(store_id) filter`);

  // Try filtering by casts.store_id
  const { data: schedules, error } = await supabase
    .from('schedules')
    .select('*, casts!inner(id, name, store_id)')
    .eq('work_date', dateStr)
    .eq('casts.store_id', store.id);

  if (error) {
    console.error('Error with filter:', error.message);
  } else {
    console.log('Schedules found:', schedules?.length);
    schedules?.forEach((s) => {
      console.log(
        `  - Schedule ID: ${s.id}, Cast: ${s.casts?.name}, CastStoreID: ${s.casts?.store_id}`,
      );
    });
  }

  // Also check the specific cast "木村２０２６２２８三回目"
  const { data: kimura } = await supabase.from('casts').select('*').ilike('name', '%木村%');
  console.log('\nKimura Cast Info:', JSON.stringify(kimura, null, 2));
}

debug();
