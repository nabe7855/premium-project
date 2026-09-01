import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vkrztvkpjcpejccyiviw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tables = [
  'stores',
  'price_configs',
  'courses',
  'course_plans',
  'transport_areas',
  'price_options',
  'campaigns',
];

async function run() {
  for (const table of tables) {
    console.log(`Checking ${table}...`);
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error(`Error reading ${table}:`, error);
      continue;
    }
    data.forEach((row) => {
      // Check ID
      if (row.id && typeof row.id === 'string') {
        if (row.id[1] === 'n') console.log(`[${table}] ID starts with ?n: ${row.id}`);
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(row.id)) {
          console.log(`[${table}] NON-UUID ID: ${row.id}`);
        }
      }
      // Check foreign keys
      for (const key in row) {
        if (key.endsWith('_id') && row[key] && typeof row[key] === 'string') {
          if (row[key][1] === 'n') console.log(`[${table}] ${key} starts with ?n: ${row[key]}`);
          if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(row[key])) {
            console.log(`[${table}] NON-UUID ${key}: ${row[key]}`);
          }
        }
      }
    });
  }
}

run();
