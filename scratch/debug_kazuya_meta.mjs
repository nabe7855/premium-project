import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function debugKazuyaMeta() {
  const { data: articles } = await supabase.from('media_articles').select('*').eq('slug', 'kazuya-interview');
  const { data: metas } = await supabase.from('interview_meta').select('*').eq('article_id', articles[0].id);
  const meta = metas[0];

  console.log('--- PHOTOS FIELD ---');
  console.log(JSON.stringify(meta.photos, null, 2));

  console.log('\n--- DIALOGUE SECTION 2 items (hand) ---');
  const sec2 = meta.dialogue_data.sections[1];
  console.log(JSON.stringify(sec2.items, null, 2));

  console.log('\n--- DIALOGUE SECTION 3 items (dome) ---');
  const sec3 = meta.dialogue_data.sections[2];
  console.log(JSON.stringify(sec3.items, null, 2));
}

debugKazuyaMeta().catch(console.error);
