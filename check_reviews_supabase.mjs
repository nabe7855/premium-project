import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// .env.local を手動読み込み
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

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

console.log('URL:', supabaseUrl ? '✅ found' : '❌ missing');
console.log('Key:', supabaseKey ? '✅ found' : '❌ missing');

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // 1. storeを取得
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('slug', 'fukuoka')
    .single();

  if (storeError || !store) {
    console.error('❌ 店舗取得エラー:', storeError?.message);
    return;
  }
  console.log('✅ Store ID:', store.id);

  // 2. cast_store_membershipsからキャストIDを取得
  const { data: memberships, error: memberError } = await supabase
    .from('cast_store_memberships')
    .select(
      `
      priority,
      casts (
        id,
        slug,
        name,
        age,
        catch_copy,
        main_image_url,
        image_url,
        is_active,
        sexiness_level
      )
    `,
    )
    .eq('store_id', store.id);

  if (memberError) {
    console.error('❌ メンバーシップ取得エラー:', memberError.message);
    return;
  }

  console.log('✅ メンバーシップ件数:', memberships?.length);
  console.log('✅ casts[0] 型:', Array.isArray(memberships?.[0]?.casts) ? 'array' : 'object');
  console.log('✅ casts[0] データ:', JSON.stringify(memberships?.[0]?.casts, null, 2));

  // castIdsを抽出
  const castIds = (memberships ?? [])
    .map((item) => {
      if (Array.isArray(item.casts)) return item.casts[0]?.id;
      return item.casts?.id;
    })
    .filter(Boolean);

  console.log('✅ Cast IDs:', castIds.length, castIds.slice(0, 3));

  // 3. reviewsテーブルからデータ取得
  const { data: reviews, error: reviewError } = await supabase
    .from('reviews')
    .select('cast_id, rating')
    .in('cast_id', castIds);

  if (reviewError) {
    console.error('❌ レビュー取得エラー:', reviewError.message);
    console.error('詳細:', reviewError);
    return;
  }

  console.log('✅ reviews件数:', reviews?.length ?? 0);
  if (reviews?.length > 0) {
    console.log('✅ sample:', reviews.slice(0, 3));

    // 集計
    const stats = {};
    reviews.forEach((r) => {
      if (!stats[r.cast_id]) stats[r.cast_id] = { sum: 0, count: 0 };
      stats[r.cast_id].sum += r.rating;
      stats[r.cast_id].count += 1;
    });
    console.log(
      '✅ 統計:',
      Object.entries(stats).map(
        ([id, s]) => `${id}: avg=${(s.sum / s.count).toFixed(1)}, count=${s.count}`,
      ),
    );
  } else {
    console.log('⚠️ reviews が 0件 — RLS や cast_id 不一致の可能性あり');
  }
}

main().catch(console.error);
