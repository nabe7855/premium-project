import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co';
const anonKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=["']?(.*?)["']?$/m);
const key = anonKeyMatch[1].trim();

const supabase = createClient(supabaseUrl, key);

async function inspectSchemaAndCasts() {
  console.log('===========================================================');
  console.log('=== INSPECTING REVIEWS SCHEMA & FUKUOKA CAST MEMBERSHIPS ===');
  console.log('===========================================================\n');

  // 1. Fetch 1 review to inspect object keys
  const { data: sampleReview } = await supabase.from('reviews').select('*').limit(1);
  console.log('Sample Review record keys:', sampleReview ? Object.keys(sampleReview[0]) : 'None');

  // 2. Fetch Fukuoka store ID
  const { data: fukuokaStore } = await supabase.from('stores').select('*').eq('slug', 'fukuoka').single();
  console.log('Fukuoka store:', fukuokaStore);

  // 3. Fetch all Fukuoka casts and their memberships
  const { data: fukuokaMemberships } = await supabase
    .from('cast_store_memberships')
    .select('cast_id, store_id, casts(id, name, is_active, slug)')
    .eq('store_id', fukuokaStore.id);

  console.log(`\nFukuoka Cast Memberships count: ${fukuokaMemberships?.length}`);
  console.log('Fukuoka Casts:');
  fukuokaMemberships?.forEach(m => {
    console.log(`- Cast [${m.casts?.name}] (id: ${m.cast_id}, is_active: ${m.casts?.is_active})`);
  });

  // 4. Fetch all reviews in DB and group by cast_id
  const { data: allReviews } = await supabase.from('reviews').select('id, cast_id, user_name, comment, created_at');
  
  const fukuokaCastIds = new Set(fukuokaMemberships?.map(m => m.cast_id));
  const reviewsForFukuokaCasts = allReviews?.filter(r => fukuokaCastIds.has(r.cast_id));

  console.log(`\nTotal reviews for Fukuoka Casts in DB: ${reviewsForFukuokaCasts?.length}`);
  console.log('Reviews for Fukuoka Casts:', reviewsForFukuokaCasts);
}

inspectSchemaAndCasts().catch(console.error);
