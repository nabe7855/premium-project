import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDiaries() {
  const castId = 'f65ec2f1-7091-4a04-815fdaaf1bbe'; // I assume this is the ID from the previous output truncated but I'll search by name to be sure

  // Get cast ID first
  const { data: cast } = await supabase
    .from('casts')
    .select('id')
    .eq('name', '木村２０２６２２８三回目')
    .maybeSingle();

  if (!cast) {
    console.log('No cast found');
    return;
  }

  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, created_at')
    .eq('cast_id', cast.id);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Diaries for ${cast.id} found:`, JSON.stringify(data, null, 2));
}

checkDiaries();
