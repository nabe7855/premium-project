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
    console.log('Casts row keys (JSON):', JSON.stringify(Object.keys(data[0])));
    console.log('Casts first row sample:', JSON.stringify(data[0], null, 2));
  } else {
    console.log('No data found in casts table or error:', error?.message);
  }
}

debug();
