import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function investigateBugs() {
  console.log('===============================================================');
  console.log('=== INVESTIGATING STORE FRONTEND DISPLAY BUGS (REVIEWS & DIARIES) ===');
  console.log('===============================================================\n');

  // -------------------------------------------------------------------------
  // 1. INVESTIGATE REVIEWS (BUG A)
  // -------------------------------------------------------------------------
  console.log('--- 1. INVESTIGATING REVIEWS (BUG A) ---');

  // Fetch all active cast IDs for fukuoka and yokohama
  const { data: fukuokaCasts } = await supabase
    .from('casts')
    .select('id, name, cast_store_memberships!inner(stores!inner(slug))')
    .eq('is_active', true)
    .eq('cast_store_memberships.stores.slug', 'fukuoka');

  const { data: yokohamaCasts } = await supabase
    .from('casts')
    .select('id, name, cast_store_memberships!inner(stores!inner(slug))')
    .eq('is_active', true)
    .eq('cast_store_memberships.stores.slug', 'yokohama');

  const fukuokaCastIds = fukuokaCasts?.map(c => c.id) || [];
  const yokohamaCastIds = yokohamaCasts?.map(c => c.id) || [];

  // Fetch reviews for fukuoka
  const { data: fukuokaReviews } = await supabase
    .from('reviews')
    .select('*')
    .in('cast_id', fukuokaCastIds)
    .order('created_at', { ascending: false });

  // Fetch reviews for yokohama
  const { data: yokohamaReviews } = await supabase
    .from('reviews')
    .select('*')
    .in('cast_id', yokohamaCastIds)
    .order('created_at', { ascending: false });

  console.log(`Fukuoka Total Reviews (Raw DB Query): ${fukuokaReviews?.length || 0}`);
  console.log(`Yokohama Total Reviews (Raw DB Query): ${yokohamaReviews?.length || 0}\n`);

  // Analyze empty body reviews for Fukuoka
  const fukuokaEmptyBodyReviews = (fukuokaReviews || []).filter(r => !r.body || r.body.trim() === '');
  const fukuokaValidBodyReviews = (fukuokaReviews || []).filter(r => r.body && r.body.trim() !== '');

  console.log(`Fukuoka Empty Body Reviews Count: ${fukuokaEmptyBodyReviews.length}`);
  console.log(`Fukuoka Valid Body Reviews Count: ${fukuokaValidBodyReviews.length}`);

  console.log('\nFukuoka Empty Body Reviews Details:');
  fukuokaEmptyBodyReviews.forEach((r, idx) => {
    console.log(` [${idx + 1}] Review ID: ${r.id}`);
    console.log(`     Cast ID: ${r.cast_id}`);
    console.log(`     Rating: ${r.rating}`);
    console.log(`     Author: "${r.author_name || r.user_name || ''}"`);
    console.log(`     Body: "${r.body || ''}"`);
    console.log(`     Created At: ${r.created_at}`);
  });

  // Analyze empty body reviews for Yokohama
  const yokohamaEmptyBodyReviews = (yokohamaReviews || []).filter(r => !r.body || r.body.trim() === '');
  const yokohamaValidBodyReviews = (yokohamaReviews || []).filter(r => r.body && r.body.trim() !== '');

  console.log(`\nYokohama Empty Body Reviews Count: ${yokohamaEmptyBodyReviews.length}`);
  console.log(`Yokohama Valid Body Reviews Count: ${yokohamaValidBodyReviews.length}`);

  // Calculate Average Ratings for Fukuoka
  const fukuokaAllSum = (fukuokaReviews || []).reduce((acc, r) => acc + (r.rating || 0), 0);
  const fukuokaAllAvg = fukuokaReviews?.length ? (fukuokaAllSum / fukuokaReviews.length).toFixed(1) : '0';

  const fukuokaValidSum = fukuokaValidBodyReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  const fukuokaValidAvg = fukuokaValidBodyReviews.length ? (fukuokaValidSum / fukuokaValidBodyReviews.length).toFixed(1) : '0';

  console.log(`\nFukuoka Rating Averages:`);
  console.log(`  - All Reviews (${fukuokaReviews?.length} items): ${fukuokaAllAvg} (Sum: ${fukuokaAllSum})`);
  console.log(`  - Valid Body Reviews Only (${fukuokaValidBodyReviews.length} items): ${fukuokaValidAvg} (Sum: ${fukuokaValidSum})`);

  // -------------------------------------------------------------------------
  // 2. INVESTIGATE DIARIES (BUG B)
  // -------------------------------------------------------------------------
  console.log('\n--- 2. INVESTIGATING DIARIES (BUG B) ---');

  // Fetch diary posts for Fukuoka active casts
  const { data: fukuokaDiaries } = await supabase
    .from('diary_posts')
    .select('*, casts(name)')
    .in('cast_id', fukuokaCastIds)
    .order('published_at', { ascending: false });

  // Fetch diary posts for Yokohama active casts
  const { data: yokohamaDiaries } = await supabase
    .from('diary_posts')
    .select('*, casts(name)')
    .in('cast_id', yokohamaCastIds)
    .order('published_at', { ascending: false });

  console.log(`Fukuoka Total Diaries: ${fukuokaDiaries?.length || 0}`);
  console.log(`Yokohama Total Diaries: ${yokohamaDiaries?.length || 0}`);

  // Find empty title diaries
  const fukuokaEmptyTitleDiaries = (fukuokaDiaries || []).filter(d => !d.title || d.title.trim() === '');
  const yokohamaEmptyTitleDiaries = (yokohamaDiaries || []).filter(d => !d.title || d.title.trim() === '');

  console.log(`\nFukuoka Empty Title Diaries Count: ${fukuokaEmptyTitleDiaries.length}`);
  fukuokaEmptyTitleDiaries.forEach((d, idx) => {
    console.log(` [${idx + 1}] ID: ${d.id}`);
    console.log(`     Cast Name: ${d.casts?.name}`);
    console.log(`     Title: "${d.title}"`);
    console.log(`     Body Snippet: "${(d.content || d.body || '').slice(0, 50)}..."`);
    console.log(`     Published At: ${d.published_at || d.created_at}`);
  });

  console.log(`\nYokohama Empty Title Diaries Count: ${yokohamaEmptyTitleDiaries.length}`);
  yokohamaEmptyTitleDiaries.forEach((d, idx) => {
    console.log(` [${idx + 1}] ID: ${d.id}`);
    console.log(`     Cast Name: ${d.casts?.name}`);
    console.log(`     Title: "${d.title}"`);
    console.log(`     Published At: ${d.published_at || d.created_at}`);
  });
}

investigateBugs().catch(console.error);
