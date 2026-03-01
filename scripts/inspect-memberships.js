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
  const storeId = 'fc7964f7-73b6-4acb-8fb7-5dfc4f67157c'; // Osaka

  console.log('--- Checking cast_store_memberships for Osaka ---');
  const { data, error } = await supabase
    .from('cast_store_memberships')
    .select('*, casts(name)')
    .eq('store_id', storeId);

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log(`Found ${data?.length || 0} memberships.`);
  data?.forEach((m) => {
    console.log(`  Cast: ${m.casts?.name}, CastID: ${m.cast_id}, is_main: ${m.is_main}`);
  });
}

debug();
