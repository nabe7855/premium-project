import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  dotenv.config();
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const nameMap = {
  'フレッシュハード': 'さがほのか',
  'フレッシュソフト': 'パールホワイト',
  'チャーミングハード': 'とちおとめ',
  'チャーミングソフト': '章姫（あきひめ）',
  'クールハード': 'スカイベリー',
  'クールソフト': 'ゆめのか',
  'エレガントハード': 'あまおう',
  'エレガントソフト': '淡雪（あわゆき）'
};

async function main() {
  console.log('Fetching face types from feature_master...');
  const { data, error } = await supabase.from('feature_master').select('*').eq('category', 'face');
  if (error) {
    console.error('Failed to fetch:', error);
    return;
  }
  
  console.log(`Found ${data.length} face records.`);
  for (const row of data) {
    console.log(`Checking: ${row.name}`);
    const newName = nameMap[row.name];
    if (newName) {
      console.log(`Updating ${row.name} -> ${newName} ...`);
      const { error: updateError } = await supabase
        .from('feature_master')
        .update({ name: newName })
        .eq('id', row.id);
      
      if (updateError) {
        console.error(`Failed to update ${row.name}:`, updateError);
      } else {
        console.log(`✅ Success`);
      }
    }
  }
  console.log('Update complete.');
}

main();
