import dotenv from 'dotenv';
import { supabase } from './src/lib/supabaseClient.ts';
dotenv.config();

async function checkSchema() {
  const { data, error } = await supabase.from('lh_hotels').select('*').limit(1);
  if (error) {
    console.error('Error fetching hotel:', error);
    return;
  }
  if (data && data.length > 0) {
    console.log('Hotel sample data keys:', Object.keys(data[0]));
    console.log('Sample data:', data[0]);
  } else {
    console.log('No hotels found to check schema.');
  }
}

checkSchema();
