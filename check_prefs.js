import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function main() {
  const { data, error } = await supabase.from('lh_prefectures').select('id, name').limit(50);

  if (error) {
    console.log('ERROR:', error.message);
    return;
  }
  console.log('Prefectures in DB:');
  data.forEach((p) => console.log(`  id="${p.id}" name="${p.name}"`));

  // Test exact match for Niigata
  const { data: t1 } = await supabase
    .from('lh_prefectures')
    .select('id, name')
    .eq('name', '新潟県')
    .maybeSingle();
  console.log('\neq "新潟県":', JSON.stringify(t1));

  const { data: t2 } = await supabase
    .from('lh_prefectures')
    .select('id, name')
    .ilike('name', '%新潟%')
    .limit(1)
    .maybeSingle();
  console.log('ilike "%新潟%":', JSON.stringify(t2));

  if (data && data.length > 0) {
    const { data: cities } = await supabase
      .from('lh_cities')
      .select('id, name')
      .eq('prefecture_id', data[0].id)
      .limit(5);
    console.log(`\nCities for "${data[0].name}":`, JSON.stringify(cities));
  }
}

main().catch(console.error);
