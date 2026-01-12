import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs
  .readFileSync('.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const line_trimmed = line.trim();
    if (!line_trimmed || line_trimmed.startsWith('#')) return acc;
    const [key, ...val] = line_trimmed.split('=');
    if (key && val)
      acc[key.trim()] = val
        .join('=')
        .trim()
        .replace(/^["'](.*)["']$/, '$1');
    return acc;
  }, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('--- Checking DB Schema for Auth Restoration ---');

  // 1. Check roles table
  const { data: rolesData, error: rolesError } = await supabase.from('roles').select('id');
  if (rolesError) {
    console.log('❌ roles table lookup failed:', rolesError.message);
    if (rolesError.code === '42P01') {
      console.log('   -> Table "roles" does NOT exist.');
    }
  } else {
    console.log(`✅ roles table exists. (Count: ${rolesData.length})`);
    if (rolesData.length === 0) {
      console.log('   ℹ️ roles table is EMPTY. Data linking might be needed.');
    }
  }

  // 2. Check casts.user_id column
  // We try to select user_id from casts. If it fails, column likely missing.
  const { error: castError } = await supabase.from('casts').select('user_id').limit(1);
  if (castError) {
    console.log('❌ casts.user_id lookup failed:', castError.message);
    if (castError.message.includes('column "user_id" does not exist')) {
      console.log('   -> Column "user_id" does NOT exist in "casts" table.');
    }
  } else {
    console.log('✅ casts.user_id column exists.');
  }
}

check();
