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
  const storeId = 'fc7964f7-73b6-4acb-8fb7-5dfc4f67157c'; // Osaka
  const dateStr = '2026-02-28';

  console.log(`\n--- [DEBUG] Testing various query patterns ---`);

  // Pattern A: current one
  console.log('\nPattern A: casts!inner(...) .eq("casts.store_id", ...)');
  const { data: dataA, error: errA } = await supabase
    .from('schedules')
    .select('id, casts!inner(id, name, store_id)')
    .eq('work_date', dateStr)
    .eq('casts.store_id', storeId);

  if (errA) console.error('  Error A:', errA.message);
  else console.log('  Success A, count:', dataA?.length);

  // Pattern B: No inner join, filter manually after fetch (for debugging)
  console.log('\nPattern B: fetch everything for date, then log');
  const { data: dataB } = await supabase
    .from('schedules')
    .select('id, work_date, casts(id, name, store_id, is_active)')
    .eq('work_date', dateStr);

  console.log('  Total for date:', dataB?.length);
  dataB?.forEach((s) => {
    console.log(
      `    ScheduleID: ${s.id}, Cast: ${s.casts?.name}, CastStoreID: [${s.casts?.store_id}]`,
    );
  });

  // Pattern C: filter by casts.id (first finding cast ids for store)
  console.log('\nPattern C: filter by casts(store_id) without explicit join syntax on eq');
  const { data: dataC, error: errC } = await supabase
    .from('schedules')
    .select('id, casts!inner(id, name, store_id)')
    .eq('work_date', dateStr)
    .filter('casts.store_id', 'eq', storeId);

  if (errC) console.error('  Error C:', errC.message);
  else console.log('  Success C, count:', dataC?.length);
}

debug();
