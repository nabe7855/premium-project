import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrcnp0dmtwamNwZWpjY3lpdml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MzE0ODEsImV4cCI6MjA3MjQwNzQ4MX0.nB4T_OHDOvcYFAG5MTSB5KWius-sZLQr-wfyh2S0bTk';

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
