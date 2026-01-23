import { createClient } from '@supabase/supabase-js';

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
