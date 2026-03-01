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
  const dateStr = '2026-02-28';
  console.log(`\n--- [DEBUG] Global Schedule Check for ${dateStr} ---`);

  // 1. Get all schedules for today
  const { data: rawSchedules, error: err1 } = await supabase
    .from('schedules')
    .select('id, work_date, store_id, cast_id')
    .eq('work_date', dateStr);

  if (err1) console.error('Error fetching schedules:', err1.message);
  console.log(`Total raw schedules: ${rawSchedules?.length || 0}`);

  // 2. Get associated casts
  for (const s of rawSchedules || []) {
    const { data: cast, error: err2 } = await supabase
      .from('casts')
      .select('id, name, store_id, is_active')
      .eq('id', s.cast_id)
      .single();

    console.log(`ScheduleID: ${s.id}`);
    console.log(`  Schedule store_id: [${s.store_id}]`);
    console.log(`  Cast: ${cast?.name} (ID: ${cast?.id})`);
    console.log(`  Cast store_id: [${cast?.store_id}]`);
    console.log(`  Cast is_active: ${cast?.is_active}`);
  }

  // 3. Check stores table to see if we have the right IDs
  const { data: stores } = await supabase.from('stores').select('id, slug, name');
  console.log('\n--- Stores in DB ---');
  stores?.forEach((st) => {
    console.log(`Slug: [${st.slug}], ID: [${st.id}], Name: ${st.name}`);
  });
}

debug();
