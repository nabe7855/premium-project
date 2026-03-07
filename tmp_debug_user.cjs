const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugUser(userId) {
  console.log(`--- Debugging Auth User: ${userId} ---`);

  // 1. Check casts table
  const { data: cast, error: castError } = await supabase
    .from('casts')
    .select('*')
    .or(`id.eq.${userId},user_id.eq.${userId}`)
    .maybeSingle();

  if (castError) {
    console.error('Casts fetch error:', castError);
  } else if (!cast) {
    console.log('No cast record found.');
    return;
  } else {
    console.log('Cast record found:', JSON.stringify(cast, null, 2));
  }

  // 2. Check memberships
  const { data: memberships, error: memError } = await supabase
    .from('cast_store_memberships')
    .select('*, stores(*)')
    .eq('cast_id', cast.id);

  if (memError) {
    console.error('Memberships fetch error:', memError);
  } else {
    console.log('Memberships found:', JSON.stringify(memberships, null, 2));
  }

  // 3. Check all stores
  const { data: allStores } = await supabase.from('stores').select('*');
  console.log('All stores in DB:', JSON.stringify(allStores, null, 2));
}

const targetUserId = 'b49ab429-fc9c-4f75-9d65-b9af33181bd8';
debugUser(targetUserId);
