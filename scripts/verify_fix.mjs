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
  console.log(`Testing with updated query for date: ${today}`);

  // 修正後のクエリを模倣（store_idを除く）
  const { data, error } = await supabase
    .from('schedules')
    .select(
      `
      id,
      work_date,
      start_datetime,
      end_datetime,
      status,
      casts!inner (
        id,
        name,
        age,
        height,
        slug,
        catch_copy,
        main_image_url,
        image_url,
        is_active,
        mbti_id,
        face_id
      )
    `,
    )
    .eq('work_date', today)
    .eq('store_id', 'cf627a03-f600-45b8-86f5-60a9f513beac'); // 福岡のID

  if (error) {
    console.error('❌ Query failed:', error.message);
  } else {
    console.log('✅ Query succeeded!');
    console.log('Results count:', data.length);
    if (data.length > 0) {
      console.log('Cast Name:', data[0].casts.name);
    }
  }
}

run();
