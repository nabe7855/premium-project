import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function verifyReviewsRendering() {
  console.log('=== STORE-WIDE DYNAMIC REVIEWS & RATING VERIFICATION ===\n');

  // Fukuoka
  const { data: fukuokaCasts } = await supabase
    .from('casts')
    .select('id, cast_store_memberships!inner(stores!inner(slug))')
    .eq('is_active', true)
    .eq('cast_store_memberships.stores.slug', 'fukuoka');

  const fukuokaIds = fukuokaCasts?.map(c => c.id) || [];
  const { count: fukuokaCount } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .in('cast_id', fukuokaIds);

  const { data: fukuokaRatings } = await supabase
    .from('reviews')
    .select('rating')
    .in('cast_id', fukuokaIds);

  const fSum = (fukuokaRatings || []).reduce((acc, r) => acc + (r.rating || 0), 0);
  const fAvg = (Math.round((fSum / (fukuokaCount || 1)) * 10) / 10).toFixed(1);

  console.log('Fukuoka Dynamic Results:');
  console.log(`  Review Count: ${fukuokaCount}件`);
  console.log(`  Rating Sum: ${fSum}`);
  console.log(`  Average Rating (1 decimal rounded): ${fAvg}`);

  // Yokohama
  const { data: yokohamaCasts } = await supabase
    .from('casts')
    .select('id, cast_store_memberships!inner(stores!inner(slug))')
    .eq('is_active', true)
    .eq('cast_store_memberships.stores.slug', 'yokohama');

  const yokohamaIds = yokohamaCasts?.map(c => c.id) || [];
  const { count: yokohamaCount } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .in('cast_id', yokohamaIds);

  const { data: yokohamaRatings } = await supabase
    .from('reviews')
    .select('rating')
    .in('cast_id', yokohamaIds);

  const ySum = (yokohamaRatings || []).reduce((acc, r) => acc + (r.rating || 0), 0);
  const yAvg = (Math.round((ySum / (yokohamaCount || 1)) * 10) / 10).toFixed(1);

  console.log('\nYokohama Dynamic Results:');
  console.log(`  Review Count: ${yokohamaCount}件`);
  console.log(`  Rating Sum: ${ySum}`);
  console.log(`  Average Rating (1 decimal rounded): ${yAvg}`);
}

verifyReviewsRendering();
