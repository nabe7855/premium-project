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
  const { data: memberships } = await supabase
    .from('cast_store_memberships')
    .select('casts ( id, name )')
    .eq('store_id', store.id);

  const isArray = Array.isArray(memberships[0]?.casts);
  const castIds = memberships.map((m) => (isArray ? m.casts[0]?.id : m.casts?.id)).filter(Boolean);

  process.stdout.write('casts_count=' + castIds.length + '\n');
  process.stdout.write('cast_ids=' + JSON.stringify(castIds) + '\n');

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('cast_id, rating')
    .in('cast_id', castIds);

  process.stdout.write('review_error=' + JSON.stringify(error) + '\n');
  process.stdout.write('review_count=' + (reviews?.length ?? 0) + '\n');
  if (reviews?.length > 0) {
    process.stdout.write('sample=' + JSON.stringify(reviews[0]) + '\n');
  }
}
main().catch((e) => process.stdout.write('ERROR=' + e.message + '\n'));
