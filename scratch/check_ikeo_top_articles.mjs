import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkIkeoTopArticles() {
  console.log('=== CHECKING IKEO TOP PAGE ARTICLES & TAGS ===\n');

  const { data: articles } = await supabase
    .from('media_articles')
    .select('id, slug, title, category, status, published_at')
    .eq('category', 'ikeo')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  console.log(`Published Articles with category='ikeo': ${articles?.length || 0}`);
  (articles || []).forEach((a, idx) => {
    console.log(`[${idx + 1}] Slug: "${a.slug}"`);
    console.log(`     Title: ${a.title}`);
  });
}

checkIkeoTopArticles().catch(console.error);
