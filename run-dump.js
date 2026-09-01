import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
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
    console.log(`Dumping ${table}...`);
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error(`Error reading ${table}:`, error);
      continue;
    }
    fs.writeFileSync(`${table}.json`, JSON.stringify(data, null, 2), 'utf8');
  }
  console.log('Done.');
}

run();
