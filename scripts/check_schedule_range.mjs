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
  // Range from yesterday to tomorrow
  const start = '2026-02-28';
  const end = '2026-03-02';

  const { data: schedules, error } = await supabase
    .from('schedules')
    .select(
      `
      id,
      work_date,
      start_datetime,
      end_datetime,
      cast_id,
      store_id,
      stores (
        name,
        slug
      ),
      casts (
        name,
        is_active
      )
    `,
    )
    .gte('work_date', start)
    .lte('work_date', end);

  fs.writeFileSync(
    'diag_output_range.json',
    JSON.stringify({ range: { start, end }, count: schedules?.length, schedules, error }, null, 2),
  );
}

run();
