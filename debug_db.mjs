import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment variables are missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  try {
    console.log('--- Table Check ---');

    const tables = ['RecruitPage', 'Store', 'lh_prefectures'];
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`❌ ${table} Error: ${error.message}`);
      } else {
        console.log(`✅ ${table} exists. (Sample data: ${data.length > 0 ? 'found' : 'empty'})`);
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

debug();
