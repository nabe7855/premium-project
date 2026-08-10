import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function reinvestigateReviews() {
  console.log('===================================================================');
  console.log('=== SECTION 1 RE-INVESTIGATION: REVIEWS 4.5 VS 4.8 FULL AUDIT ===');
  console.log('===================================================================\n');

  // 1. Fetch Fukuoka active cast IDs
  const { data: fukuokaCasts } = await supabase
    .from('casts')
    .select('id, name, cast_store_memberships!inner(stores!inner(slug))')
    .eq('is_active', true)
    .eq('cast_store_memberships.stores.slug', 'fukuoka');

  const fukuokaCastIds = fukuokaCasts?.map(c => c.id) || [];
  const castMap = new Map((fukuokaCasts || []).map(c => [c.id, c.name]));

  // Fetch all Fukuoka reviews sorted by created_at desc
  const { data: fukuokaReviews } = await supabase
    .from('reviews')
    .select('*')
    .in('cast_id', fukuokaCastIds)
    .order('created_at', { ascending: false });

  console.log('--- 2. FUKUOKA 32 REVIEWS FULL LIST ---');
  let ratingSum = 0;
  (fukuokaReviews || []).forEach((r, idx) => {
    ratingSum += (r.rating || 0);
    const castName = castMap.get(r.cast_id) || '不明';
    console.log(`[${(idx + 1).toString().padStart(2, ' ')}] ID: ${r.id} | Rating: ${r.rating} | CreatedAt: ${r.created_at} | Cast: ${castName} | Author: "${r.user_name || ''}"`);
  });

  const count = fukuokaReviews?.length || 0;
  const avgPrecise = count > 0 ? (ratingSum / count).toFixed(3) : '0';
  const avgOneDecimal = count > 0 ? (ratingSum / count).toFixed(1) : '0';

  console.log(`\nFukuoka Reviews Summary:`);
  console.log(`  Total Count: ${count}`);
  console.log(`  Rating Sum: ${ratingSum}`);
  console.log(`  Precise Average (Sum / Count): ${avgPrecise}`);
  console.log(`  Rounded Average (1 decimal): ${avgOneDecimal}\n`);

  // 3. Identify the newest 2 reviews (30 -> 32 difference)
  console.log('--- 3. NEWEST 2 REVIEWS (30 -> 32 DIFFERENCE) ---');
  fukuokaReviews?.slice(0, 2).forEach((r, idx) => {
    console.log(` [Newest ${idx + 1}] ID: ${r.id} | Rating: ${r.rating} | CreatedAt: ${r.created_at} | Cast: ${castMap.get(r.cast_id)}`);
  });

  // 4. Yokohama Reviews Summary
  const { data: yokohamaCasts } = await supabase
    .from('casts')
    .select('id, name, cast_store_memberships!inner(stores!inner(slug))')
    .eq('is_active', true)
    .eq('cast_store_memberships.stores.slug', 'yokohama');

  const yokohamaCastIds = yokohamaCasts?.map(c => c.id) || [];
  const { data: yokohamaReviews } = await supabase
    .from('reviews')
    .select('*')
    .in('cast_id', yokohamaCastIds)
    .order('created_at', { ascending: false });

  let ySum = 0;
  (yokohamaReviews || []).forEach(r => { ySum += (r.rating || 0); });
  const yCount = yokohamaReviews?.length || 0;
  const yAvgPrecise = yCount > 0 ? (ySum / yCount).toFixed(3) : '0';

  console.log('\n--- 7. YOKOHAMA REVIEWS SUMMARY ---');
  console.log(`  Yokohama Total Reviews: ${yCount}`);
  console.log(`  Yokohama Rating Sum: ${ySum}`);
  console.log(`  Yokohama Precise Average: ${yAvgPrecise} (Rounded: ${yCount > 0 ? (ySum / yCount).toFixed(1) : '0'})\n`);
}

reinvestigateReviews().catch(console.error);
