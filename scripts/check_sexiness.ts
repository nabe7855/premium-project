import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: cast } = await supabase.from('casts').select('id, name, sexiness_level').limit(1).single();
  if (!cast) return;

  console.log(`Updating ${cast.name}...`);
  const { data: updated, error } = await supabase
    .from('casts')
    .update({ sexiness_level: 150 })
    .eq('id', cast.id)
    .select()
    .single();

  if (error) {
    console.error('Update Error:', error);
  } else {
    console.log('Result:', updated.sexiness_level);
  }

  // set it back
  await supabase.from('casts').update({ sexiness_level: cast.sexiness_level }).eq('id', cast.id);
}

main().catch(console.error);
