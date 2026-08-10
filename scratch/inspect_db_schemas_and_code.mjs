import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function inspectSchemaAndRecords() {
  console.log('=== INSPECTING DB SCHEMAS AND TARGET RECORDS ===\n');

  // 1. Inspect Reviews table sample record
  const { data: sampleReview } = await supabase.from('reviews').select('*').limit(1);
  console.log('Sample Review Record Keys:', Object.keys(sampleReview?.[0] || {}));
  console.log('Sample Review Record:', sampleReview?.[0]);

  // Fetch 5 reviews for Fukuoka to inspect all fields
  const { data: fukuokaReviewsSample } = await supabase.from('reviews').select('*').limit(5);
  console.log('\nFirst 5 Reviews raw objects:');
  console.log(JSON.stringify(fukuokaReviewsSample, null, 2));

  // 2. Inspect Diary Posts table sample record and find 青空(せいら)'s post on 2026-08-09
  const { data: sampleDiary } = await supabase.from('diary_posts').select('*').limit(1);
  console.log('\nSample Diary Record Keys:', Object.keys(sampleDiary?.[0] || {}));

  // Fetch recent diary_posts
  const { data: recentDiaries } = await supabase
    .from('diary_posts')
    .select('*, casts(id, name, slug)')
    .order('created_at', { ascending: false })
    .limit(10);

  console.log('\nRecent 10 Diary Posts:');
  recentDiaries?.forEach((d, i) => {
    console.log(`[${i + 1}] ID: ${d.id}`);
    console.log(`     Cast: ${d.casts?.name} (slug: ${d.casts?.slug})`);
    console.log(`     Title: "${d.title}"`);
    console.log(`     Created At: ${d.created_at}`);
    console.log(`     Published At: ${d.published_at}`);
    console.log(`     Content Snippet: "${(d.content || d.body || '').slice(0, 40)}..."`);
    console.log('---');
  });

  // Find all diary_posts with empty title
  const { data: allDiaries } = await supabase.from('diary_posts').select('id, title, cast_id, created_at, casts(name)');
  const emptyTitleDiaries = (allDiaries || []).filter(d => !d.title || d.title.trim() === '');
  console.log(`\nTotal Empty Title Diaries in DB: ${emptyTitleDiaries.length}`);
  emptyTitleDiaries.forEach((d, i) => {
    console.log(` [${i + 1}] ID: ${d.id}, Cast: ${d.casts?.name}, CreatedAt: ${d.created_at}, Title: "${d.title}"`);
  });
}

inspectSchemaAndRecords().catch(console.error);
