const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUserStore(userId) {
  console.log(`Checking store membership for user: ${userId}`);

  const { data, error } = await supabase
    .from('cast_store_memberships')
    .select('stores(name, slug)')
    .eq('cast_id', userId);

  if (error) {
    console.error('Error fetching memberships:', error);
    return;
  }

  console.log('Memberships found:', JSON.stringify(data, null, 2));

  if (data && data.length > 0) {
    const slug = data[0].stores.slug;
    console.log(`Checking if store data exists for slug: ${slug}`);
    // I can't easily call getStoreData from hier without bundling, but I can check the keys.
    const knownSlugs = ['fukuoka', 'yokohama'];
    if (knownSlugs.includes(slug)) {
      console.log(`Slug ${slug} is KNOWN.`);
    } else {
      console.log(`Slug ${slug} is UNKNOWN! This will cause the dashboard to hang.`);
    }
  } else {
    console.log('No store memberships found for this cast user!');
  }
}

const userId = '804357e4-1898-49fe-9d7a-9880d2a1f5cc';
checkUserStore(userId);
