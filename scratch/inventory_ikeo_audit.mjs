import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function runIkeoAudit() {
  console.log('=====================================================');
  console.log('=== IKEO / RECRUIT MEDIA ARTICLES INVENTORY AUDIT ===');
  console.log('=====================================================\n');

  // 1. Query media_articles table
  const { data: articles, error } = await supabase
    .from('media_articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching media_articles:', error);
    return;
  }

  console.log(`Total media_articles in DB: ${articles?.length || 0}`);

  const ikeoArticles = (articles || []).filter(a => 
    a.category === 'ikeo' || 
    a.slug?.includes('ikeo') || 
    a.slug?.includes('recruit') || 
    a.slug?.includes('guide') ||
    a.title?.includes('求人') ||
    a.title?.includes('採用') ||
    a.title?.includes('イケオ')
  );

  console.log(`Matching IKEO/Recruit articles in media_articles: ${ikeoArticles.length}\n`);

  fs.writeFileSync(
    path.join(process.cwd(), 'scratch', 'ikeo_db_raw.json'),
    JSON.stringify(articles, null, 2)
  );

  console.log('Saved all media_articles to scratch/ikeo_db_raw.json');
}

runIkeoAudit().catch(console.error);
