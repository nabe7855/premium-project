const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data: h, error } = await supabase
    .from('lh_hotels')
    .select('name, min_price_rest, min_price_stay, rest_price_min_weekday, stay_price_min_weekday')
    .not('min_price_rest', 'is', null)
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  console.log('Hotel:', h.name);
  console.log('min_price_rest:', h.min_price_rest);
  console.log('rest_price_min_weekday:', h.rest_price_min_weekday);
}

main();
