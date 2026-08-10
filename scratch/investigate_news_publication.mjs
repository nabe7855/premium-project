import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function investigateNewsPublication() {
  console.log('=== INVESTIGATING NEWS PUBLICATION STATUS & STORES ===\n');

  // Find all news / announcements / posts
  const { data: newsList, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log('Error querying "news" table, checking other tables:', error.message);
    const { data: posts } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    console.log('Posts:', posts);
    return;
  }

  console.log(`Found ${newsList?.length || 0} news items in DB:\n`);

  (newsList || []).forEach((n, idx) => {
    console.log(`[${idx + 1}] ID: ${n.id}`);
    console.log(`     Title: ${n.title}`);
    console.log(`     Category: ${n.category}`);
    console.log(`     Store Slug: ${n.store_slug}`);
    console.log(`     Stores/Target Stores:`, n.stores, n.target_stores, n.store_settings);
    console.log(`     Is Published: ${n.is_published} | Status: ${n.status} | Published At: ${n.published_at}`);
    console.log(`     Is Slider: ${n.is_slider || n.is_slide_display}`);
    console.log('---');
  });
}

investigateNewsPublication().catch(console.error);
