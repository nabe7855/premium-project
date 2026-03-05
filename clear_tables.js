import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function main() {
  // 現状確認
  const { data: cities, error: ce } = await supabase.from('lh_cities').select('id').limit(5);
  console.log('Cities sample:', cities, ce?.message);

  // シティ削除
  const { data: dc, error: de } = await supabase.from('lh_cities').delete().gte('id', '');
  console.log('Delete cities result:', JSON.stringify(dc), de?.message);

  // 都道府県削除
  const { data: dp, error: dpe } = await supabase.from('lh_prefectures').delete().gte('id', '');
  console.log('Delete prefs result:', JSON.stringify(dp), dpe?.message);

  // 確認
  const { count: cc } = await supabase
    .from('lh_cities')
    .select('*', { count: 'exact', head: true });
  const { count: pc } = await supabase
    .from('lh_prefectures')
    .select('*', { count: 'exact', head: true });
  console.log('After delete - cities:', cc, 'prefs:', pc);
}

main().catch(console.error);
