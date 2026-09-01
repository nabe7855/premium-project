import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vkrztvkpjcpejccyiviw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Checking recruit_pages...');
  const { data, error } = await supabase.from('recruit_pages').select('store_id');
  if (error) {
    console.error('Error:', error);
    return;
  }
  data.forEach((r) => {
    console.log('RecruitPage store_id:', r.store_id);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(r.store_id)) {
      console.log('!!! NON-UUID STORE_ID FOUND:', r.store_id);
    }
  });
  console.log('Done.');
}

run();
