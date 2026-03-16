const { createClient } = require('@supabase/supabase-client');
require('dotenv').config({ path: '.env.local' });

async function checkPrefectures() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data, error } = await supabase.from('lh_prefectures').select('id, name');
  if (error) {
    console.error(error);
    return;
  }
  console.log('Prefectures in DB:');
  console.log(JSON.stringify(data, null, 2));
}

checkPrefectures();
