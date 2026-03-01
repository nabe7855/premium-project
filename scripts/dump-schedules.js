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
  console.log(`\n--- Fetching ALL schedules for ${dateStr} ---`);
  const { data, error } = await supabase.from('schedules').select('*').eq('work_date', dateStr);

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log(`Found ${data?.length || 0} schedules.`);
  data?.forEach((s, idx) => {
    console.log(`[${idx}] ScheduleID: ${s.id}`);
    console.log(`    store_id: [${s.store_id}]`);
    console.log(`    cast_id: [${s.cast_id}]`);
    console.log(`    status: [${s.status}]`);
    console.log(`    Full JSON: ${JSON.stringify(s)}`);
  });
}

debug();
