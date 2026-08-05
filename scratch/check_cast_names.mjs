import { supabase } from '../src/lib/supabaseClient.ts';

async function checkCasts() {
  const { data: casts, error } = await supabase.from('casts').select('id, name, slug');
  console.log('Error:', error);
  console.log('Casts in DB:', JSON.stringify(casts, null, 2));
}

checkCasts().catch(console.error);
