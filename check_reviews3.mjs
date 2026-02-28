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
  const { data: store } = await supabase.from('stores').select('id').eq('slug', 'fukuoka').single();

  // 新しいクエリ（reviews JOIN込み）
  const { data, error } = await supabase
    .from('cast_store_memberships')
    .select(
      `
      priority,
      casts (
        id, name, age, is_active,
        reviews ( rating )
      )
    `,
    )
    .eq('store_id', store.id);

  if (error) {
    process.stdout.write('ERROR=' + error.message + '\n');
    return;
  }

  process.stdout.write('memberships_count=' + data?.length + '\n');

  // 各castのreviewsを確認
  data?.slice(0, 3).forEach((item, i) => {
    const cast = Array.isArray(item.casts) ? item.casts[0] : item.casts;
    const reviews = Array.isArray(cast?.reviews) ? cast.reviews : [];
    const count = reviews.length;
    const avg = count > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1) : '0';
    process.stdout.write(`cast[${i}]=${cast?.name} reviews=${count} avg=${avg}\n`);
  });
}
main().catch((e) => process.stdout.write('CATCH_ERROR=' + e.message + '\n'));
