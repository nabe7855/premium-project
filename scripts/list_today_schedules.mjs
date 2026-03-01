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
  const today = '2026-03-01';
  const { data: schedules, error } = await supabase
    .from('schedules')
    .select(
      `
      id,
      work_date,
      cast_id,
      store_id,
      stores (
        name,
        slug
      )
    `,
    )
    .eq('work_date', today);

  fs.writeFileSync('diag_output.json', JSON.stringify({ today, schedules, error }, null, 2));
}

run();
