import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkFeaturedCasts() {
  console.log('=== CHECKING FEATURED_CASTS TABLE ===\n');

  const { data: featuredCasts, error } = await supabase
    .from('featured_casts')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching featured_casts:', error);
    return;
  }

  console.log(`Total records in featured_casts: ${featuredCasts.length}`);
  featuredCasts.forEach((fc, i) => {
    console.log(`[${i + 1}] ID: ${fc.id}`);
    console.log(`     Name: ${fc.name}`);
    console.log(`     Store Name: ${fc.store_name} (slug: ${fc.store_slug})`);
    console.log(`     Image URL: ${fc.image_url}`);
    console.log(`     Link URL: ${fc.link_url}`);
    console.log(`     Is Active: ${fc.is_active}`);
    console.log(`     Display Order: ${fc.display_order}`);
    console.log('---');
  });
}

checkFeaturedCasts().catch(console.error);
