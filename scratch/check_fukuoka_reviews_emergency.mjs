import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkFukuokaReviews() {
  console.log('=== CHECKING FUKUOKA REVIEWS DB & QUERY ===\n');

  // 1. Get active casts for Fukuoka
  const { data: casts, error: castErr } = await supabase
    .from('casts')
    .select('id, name, is_active, cast_store_memberships!inner(stores!inner(slug))')
    .eq('is_active', true)
    .eq('cast_store_memberships.stores.slug', 'fukuoka');

  console.log('1. Active Casts for Fukuoka count:', casts?.length, 'castErr:', castErr);
  if (casts) {
    console.log('   Cast names:', casts.map(c => c.name));
  }

  const castIds = (casts || []).map(c => c.id);

  // 2. Query reviews with cast_id in castIds
  const { data: reviews, count, error: reviewErr } = await supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .in('cast_id', castIds);

  console.log('\n2. Reviews count for Fukuoka active castIds:', count, 'reviewErr:', reviewErr);
  console.log('   Retrieved reviews length:', reviews?.length);

  // 3. Query ALL reviews for Fukuoka casts regardless of is_active
  const { data: allStoreCasts } = await supabase
    .from('casts')
    .select('id, name, is_active, cast_store_memberships!inner(stores!inner(slug))')
    .eq('cast_store_memberships.stores.slug', 'fukuoka');

  const allCastIds = (allStoreCasts || []).map(c => c.id);

  const { data: allReviews, count: allCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .in('cast_id', allCastIds);

  console.log('\n3. Reviews count for ALL Fukuoka casts (including inactive):', allCount);

  // 4. Test getReviewsByStore logic directly
  try {
    const { getReviewsByStore } = await import('../src/lib/getReviewsByStore.js');
    const res = await getReviewsByStore('fukuoka', { limit: 20, offset: 0 });
    console.log('\n4. getReviewsByStore("fukuoka") result:', {
      totalCount: res.totalCount,
      reviewsCount: res.reviews?.length,
      sampleReview: res.reviews?.[0]
    });
  } catch (e) {
    console.error('Error running getReviewsByStore:', e);
  }
}

checkFukuokaReviews();
