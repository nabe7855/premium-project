import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envFile
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [key, ...val] = line.split('=');
      if (!key || !val) return ['', ''];
      return [
        key.trim(),
        val
          .join('=')
          .trim()
          .replace(/^["'](.*)["']$/, '$1'),
      ];
    })
    .filter(([k]) => k),
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkSchedules() {
  const result = {};

  // Check columns
  const { data: sampleRows, error: sampleError } = await supabase
    .from('schedules')
    .select('*')
    .limit(1);

  if (sampleError) {
    result.sampleError = sampleError;
  } else if (sampleRows && sampleRows.length > 0) {
    result.columns = Object.keys(sampleRows[0]);
    result.sampleRow = sampleRows[0];
  } else {
    result.columns = 'No rows found';
  }

  // Check row count for today
  const today = new Date().toISOString().split('T')[0];
  const { count, error: countError } = await supabase
    .from('schedules')
    .select('*', { count: 'exact', head: true })
    .eq('work_date', today);

  result.todayDate = today;
  if (countError) result.countError = countError;
  else result.todayCount = count;

  // Check stores
  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('id, slug, name');

  if (storesError) result.storesError = storesError;
  else result.stores = stores;

  console.log(JSON.stringify(result, null, 2));
}

checkSchedules();
