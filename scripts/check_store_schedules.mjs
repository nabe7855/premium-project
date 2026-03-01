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
  const { data: stores } = await supabase.from('stores').select('id, slug, name');
  const fukuoka = stores.find((s) => s.slug === 'fukuoka');
  const yokohama = stores.find((s) => s.slug === 'yokohama');
  const today = '2026-03-01';

  const results = { today, stores: [] };

  for (const s of [fukuoka, yokohama]) {
    if (!s) continue;
    const { count, error } = await supabase
      .from('schedules')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', s.id)
      .eq('work_date', today);

    results.stores.push({
      slug: s.slug,
      id: s.id,
      name: s.name,
      count: count,
      error: error ? error.message : null,
    });
  }

  // Also check if ANY schedules exist for today
  const { count: totalToday } = await supabase
    .from('schedules')
    .select('*', { count: 'exact', head: true })
    .eq('work_date', today);

  results.totalToday = totalToday;

  console.log(JSON.stringify(results, null, 2));
}

run();
