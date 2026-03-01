import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  const { data, error } = await supabase.from('casts').select('*').limit(1);
  if (data && data[0]) {
    const keys = Object.keys(data[0]);
    console.log('--- START KEYS ---');
    keys.forEach((k) => console.log('KEY:', k));
    console.log('--- END KEYS ---');
  } else {
    console.log('Error/No data:', error?.message);
  }
}

debug();
