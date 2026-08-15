import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fixKazuyaDialogueKeys() {
  console.log('=== FIXING KAZUYA DIALOGUE & PHOTO KEYS ===\n');

  const { data: articles } = await supabase.from('media_articles').select('*').eq('slug', 'kazuya-interview');
  if (!articles || articles.length === 0) return;

  const { data: metas } = await supabase.from('interview_meta').select('*').eq('article_id', articles[0].id);
  if (!metas || metas.length === 0) return;

  const meta = metas[0];
  const dialogue = meta.dialogue_data;

  // Make sure items with photo_key are type: 'photo' and have photo_key
  for (const sec of dialogue.sections) {
    for (const item of sec.items) {
      if (item.photo_key) {
        item.type = 'photo';
      }
    }
  }

  await supabase.from('interview_meta').update({
    dialogue_data: dialogue
  }).eq('id', meta.id);

  console.log('✅ Updated Kazuya dialogue_data so image items have type: "photo"');
}

fixKazuyaDialogueKeys().catch(console.error);
