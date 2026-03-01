import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

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

async function run() {
  const result = {};

  // 1. Get Fukuoka and Yokohama stores
  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('id, slug, name')
    .in('slug', ['fukuoka', 'yokohama']);

  result.stores = stores;
  result.storesError = storesError;

  // 2. Get schedules for today
  const today = '2026-03-01';
  result.today = today;

  const { data: schedules, error: schedulesError } = await supabase
    .from('schedules')
    .select(
      `
      *,
      casts (
        id,
        name,
        is_active,
        image_url
      )
    `,
    )
    .eq('work_date', today);

  result.schedules = schedules;
  result.schedulesError = schedulesError;

  fs.writeFileSync('clean_diag.json', JSON.stringify(result, null, 2));
}

run();
