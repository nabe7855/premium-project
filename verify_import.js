import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function main() {
  const { count: pc } = await supabase
    .from('lh_prefectures')
    .select('*', { count: 'exact', head: true });
  const { count: cc } = await supabase
    .from('lh_cities')
    .select('*', { count: 'exact', head: true });
  console.log(`Prefectures: ${pc}, Cities: ${cc}`);

  // 各県のサンプル
  const testPrefs = ['fukushima', 'tokyo', 'osaka', 'hokkaido', 'niigata'];
  for (const slug of testPrefs) {
    const { data } = await supabase
      .from('lh_cities')
      .select('name')
      .eq('prefecture_id', slug)
      .limit(3);
    console.log(`${slug}: ${data?.map((c) => c.name).join(', ')}`);
  }
}
main().catch(console.error);
