// apply_fix.mjs
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyFix() {
  console.log('Applying database schema fix...');

  const sql = `
    ALTER TABLE "reservations" 
    ADD COLUMN IF NOT EXISTS "client_nickname" TEXT,
    ADD COLUMN IF NOT EXISTS "is_over_18" BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS "therapist_name" TEXT,
    ADD COLUMN IF NOT EXISTS "consent_text_snapshot" TEXT,
    ADD COLUMN IF NOT EXISTS "consent_log_id" TEXT,
    ADD COLUMN IF NOT EXISTS "consent_date" TEXT,
    ADD COLUMN IF NOT EXISTS "progress_json" JSONB DEFAULT '[]'::jsonb;
  `;

  // Supabase direct SQL execution isn't exposed via JS SDK in a standard way for schema changes
  // We'll use the RPC if standard setup exists, or just log what needs to be done.
  // Given this is a real task, I will try to find if there's an existing migration or fix tool.
  // Actually, I'll provide the SQL clearly for the user if I cannot run it directly.

  console.log('SQL to execute in Supabase SQL Editor:');
  console.log(sql);

  // Checking existing columns for verification
  const { data, error } = await supabase.from('reservations').select('*').limit(1);
  if (error) {
    console.error('Error checking reservations table:', error.message);
  } else {
    console.log(
      'Current table first row sample (keys):',
      data.length > 0 ? Object.keys(data[0]) : 'No data',
    );
  }
}

applyFix();
