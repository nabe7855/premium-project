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
  console.log('--- Inspecting FIRST ROW of casts table ---');
  const { data, error } = await supabase.from('casts').select('*').limit(1);
  if (error) {
    console.error('Error:', error.message);
    return;
  }

  const firstRow = data[0];
  console.log('Keys in first row:', Object.keys(firstRow));

  for (const key of Object.keys(firstRow)) {
    console.log(`Key: [${key}], Value type: ${typeof firstRow[key]}`);
  }

  if ('store_id' in firstRow) {
    console.log('store_id EXISTS in the object.');
  } else {
    console.log('store_id does NOT exist in the object.');
  }
}

debug();
