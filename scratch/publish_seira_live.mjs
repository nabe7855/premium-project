import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function publishSeiraLive() {
  console.log('=== PUBLISHING SEIRA ARTICLES TO LIVE (STATUS = PUBLISHED) ===\n');

  const slugs = ['seira-interview-vol4', 'seira-35-recruit-story'];

  const { data, error } = await supabase
    .from('media_articles')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .in('slug', slugs)
    .select('id, slug, title, status, published_at');

  if (error) {
    console.error('Error publishing articles:', error);
    return;
  }

  console.log('✅ Successfully published articles:');
  (data || []).forEach(a => {
    console.log(`  - Slug: ${a.slug}`);
    console.log(`    Title: ${a.title}`);
    console.log(`    Status: ${a.status}`);
    console.log(`    Published At: ${a.published_at}`);
  });
}

publishSeiraLive().catch(console.error);
