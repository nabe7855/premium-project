import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrcnp0dmtwamNwZWpjY3lpdml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MzE0ODEsImV4cCI6MjA3MjQwNzQ4MX0.nB4T_OHDOvcYFAG5MTSB5KWius-sZLQr-wfyh2S0bTk';

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
