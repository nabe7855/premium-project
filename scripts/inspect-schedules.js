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
  const { data, error } = await supabase.from('schedules').select('*').limit(1);
  if (data && data[0]) {
    const keys = Object.keys(data[0]);
    console.log('--- SCHEDULE KEYS ---');
    keys.forEach((k) => console.log('KEY:', k));
    console.log('--- END SCHEDULE KEYS ---');
    console.log('Sample Row:', JSON.stringify(data[0], null, 2));
  } else {
    console.log('Error/No data in schedules:', error?.message);
  }
}

debug();
