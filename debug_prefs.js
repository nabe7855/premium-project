import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function main() {
  // 1. lh_prefectures の全データ確認
  const { data: prefs, error: prefErr } = await supabase
    .from('lh_prefectures')
    .select('id, name')
    .order('id');

  console.log('=== lh_prefectures ===');
  if (prefErr) {
    console.log('ERROR:', prefErr.message);
  } else {
    prefs.forEach((p) => console.log(`  "${p.id}" -> "${p.name}"`));
  }
  console.log('Total:', prefs?.length || 0);

  // 2. lh_cities の全 prefecture_id のユニーク値確認
  const { data: cities } = await supabase.from('lh_cities').select('prefecture_id').limit(100);

  const uniquePrefIds = [...new Set(cities?.map((c) => c.prefecture_id) || [])];
  console.log('\n=== lh_cities prefecture_id (unique, first 20) ===');
  uniquePrefIds.slice(0, 20).forEach((id) => console.log(`  "${id}"`));

  // 3. fukushima で検索
  console.log('\n=== Search fukushima cities ===');
  const { data: fukushimaCities } = await supabase
    .from('lh_cities')
    .select('id, name, prefecture_id')
    .eq('prefecture_id', 'fukushima')
    .limit(5);
  console.log('eq fukushima:', JSON.stringify(fukushimaCities));

  const { data: fukushimaCities2 } = await supabase
    .from('lh_cities')
    .select('id, name, prefecture_id')
    .eq('prefecture_id', ' Fukushima')
    .limit(5);
  console.log('eq " Fukushima":', JSON.stringify(fukushimaCities2));

  // 4. ilike で county_id 検索
  const { data: likeResult } = await supabase
    .from('lh_cities')
    .select('id, name, prefecture_id')
    .ilike('prefecture_id', '%fukushima%')
    .limit(5);
  console.log('ilike %fukushima%:', JSON.stringify(likeResult));

  // 5. lh_cities の総数
  const { count } = await supabase.from('lh_cities').select('*', { count: 'exact', head: true });
  console.log('\nlh_cities total rows:', count);
}

main().catch(console.error);
