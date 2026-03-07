const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data: hotels, error } = await supabase
    .from('lh_hotels')
    .select('name, price_details, website')
    .not('price_details', 'is', null)
    .limit(5);

  if (error) {
    console.error('Supabase Error:', error);
    return;
  }

  console.log('Supabase API Results:');
  hotels.forEach((h) => {
    const hasPrice = Array.isArray(h.price_details) && h.price_details.length > 0;
    console.log(
      `Name: ${h.name.padEnd(30)} | Web: ${h.website ? 'YES' : 'NO '} | Price: ${hasPrice ? 'YES' : 'NO '}`,
    );
  });
}

main();
