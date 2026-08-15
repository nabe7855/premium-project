import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkKazuyaPhotosAfterFix() {
  const { data: articles } = await supabase.from('media_articles').select('id').eq('slug', 'kazuya-interview');
  const { data: metas } = await supabase.from('interview_meta').select('photos, dialogue_data').eq('article_id', articles[0].id);
  const meta = metas[0];

  console.log('Current photos field in DB:');
  console.log(JSON.stringify(meta.photos, null, 2));

  console.log('\nDialogue items with photo_key:');
  for (const sec of meta.dialogue_data.sections) {
    for (const item of sec.items) {
      if (item.photo_key) {
        console.log(`  type=${item.type}, photo_key=${item.photo_key}`);
      }
    }
  }
}

checkKazuyaPhotosAfterFix().catch(console.error);
