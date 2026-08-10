import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function investigateBlogs() {
  console.log('=== INVESTIGATING BLOGS (DIARY) TABLE ===\n');

  // Fetch recent blogs with cast info
  const { data: blogs, error } = await supabase
    .from('blogs')
    .select(`
      id,
      title,
      content,
      created_at,
      published_at,
      casts (
        name,
        is_active,
        cast_store_memberships (
          stores ( slug )
        )
      )
    `)
    .in('status', ['published', 'scheduled'])
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blogs:', error);
    return;
  }

  // Filter for Fukuoka & Yokohama
  const fukuokaBlogs = (blogs || []).filter(b => {
    const cast = Array.isArray(b.casts) ? b.casts[0] : b.casts;
    const memberships = cast?.cast_store_memberships || [];
    return memberships.some(m => m.stores?.slug === 'fukuoka');
  });

  const yokohamaBlogs = (blogs || []).filter(b => {
    const cast = Array.isArray(b.casts) ? b.casts[0] : b.casts;
    const memberships = cast?.cast_store_memberships || [];
    return memberships.some(m => m.stores?.slug === 'yokohama');
  });

  console.log(`Fukuoka Total Published Blogs: ${fukuokaBlogs.length}`);
  console.log(`Yokohama Total Published Blogs: ${yokohamaBlogs.length}\n`);

  console.log('--- Top 4 Fukuoka Blogs for Store Front ---');
  fukuokaBlogs.slice(0, 4).forEach((b, i) => {
    const cast = Array.isArray(b.casts) ? b.casts[0] : b.casts;
    console.log(`[Card ${i + 1}] Blog ID: ${b.id}`);
    console.log(`    Cast Name: ${cast?.name}`);
    console.log(`    Title Raw Value: ${JSON.stringify(b.title)}`);
    console.log(`    Title Length: ${b.title ? b.title.length : 0}`);
    console.log(`    Published At: ${b.published_at || b.created_at}`);
    console.log(`    Content Snippet: "${(b.content || '').slice(0, 50)}..."`);
    console.log('---');
  });

  // Find all blogs with empty or whitespace title across all published blogs
  const emptyTitleFukuoka = fukuokaBlogs.filter(b => !b.title || b.title.trim() === '');
  const emptyTitleYokohama = yokohamaBlogs.filter(b => !b.title || b.title.trim() === '');

  console.log(`\nFukuoka Empty Title Blogs Count: ${emptyTitleFukuoka.length}`);
  emptyTitleFukuoka.forEach((b, i) => {
    const cast = Array.isArray(b.casts) ? b.casts[0] : b.casts;
    console.log(` [Fukuoka ${i + 1}] ID: ${b.id}, Cast: ${cast?.name}, PublishedAt: ${b.published_at}, Title: ${JSON.stringify(b.title)}`);
  });

  console.log(`\nYokohama Empty Title Blogs Count: ${emptyTitleYokohama.length}`);
  emptyTitleYokohama.forEach((b, i) => {
    const cast = Array.isArray(b.casts) ? b.casts[0] : b.casts;
    console.log(` [Yokohama ${i + 1}] ID: ${b.id}, Cast: ${cast?.name}, PublishedAt: ${b.published_at}, Title: ${JSON.stringify(b.title)}`);
  });
}

investigateBlogs().catch(console.error);
