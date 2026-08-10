import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function runFullCrossExposureAudit() {
  console.log('=== FULL CROSS EXPOSURE AUDIT FOR SLUG x CATEGORY ===\n');

  const { data: articles } = await supabase
    .from('media_articles')
    .select('slug, category, title, status')
    .order('category', { ascending: true });

  console.log(`Total DB Articles: ${articles?.length || 0}\n`);

  const categorized = {};
  (articles || []).forEach(a => {
    categorized[a.category] = categorized[a.category] || [];
    categorized[a.category].push(a);
  });

  for (const cat in categorized) {
    console.log(`--- Category: "${cat}" (${categorized[cat].length} articles) ---`);
    categorized[cat].forEach(a => {
      console.log(`  - Slug: "${a.slug}" (Status: ${a.status})`);
      console.log(`    Title: ${a.title}`);
    });
    console.log('');
  }
}

runFullCrossExposureAudit().catch(console.error);
