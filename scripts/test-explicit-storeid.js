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
  console.log('--- Explicitly selecting store_id from casts ---');
  const { data, error } = await supabase.from('casts').select('id, name, store_id').limit(1);
  if (error) {
    console.error('Error with explicit select:', error.message);
  } else {
    console.log('Result:', JSON.stringify(data[0], null, 2));
  }
}

debug();
