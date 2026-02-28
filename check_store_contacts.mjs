import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env.local', 'utf-8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    }),
);

const supabase = createClient(
  env['NEXT_PUBLIC_SUPABASE_URL'],
  env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
);

async function main() {
  const { data, error } = await supabase
    .from('stores')
    .select('id, name, slug, phone, line_id, line_url, notification_email')
    .order('name');

  if (error) {
    process.stdout.write(JSON.stringify({ error: error.message }) + '\n');
    return;
  }

  // JSON形式で出力（文字化け回避）
  process.stdout.write(JSON.stringify(data, null, 2) + '\n');
}
main().catch((e) => process.stdout.write(JSON.stringify({ catch: e.message }) + '\n'));
