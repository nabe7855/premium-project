import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fixKazuyaPhotosAndDialogue() {
  console.log('=== FIXING KAZUYA PHOTOS & DIALOGUE FULLY ===\n');

  const { data: articles } = await supabase.from('media_articles').select('*').eq('slug', 'kazuya-interview');
  if (!articles || articles.length === 0) { console.error('Article not found'); return; }

  const { data: metas } = await supabase.from('interview_meta').select('*').eq('article_id', articles[0].id);
  if (!metas || metas.length === 0) { console.error('Meta not found'); return; }

  const meta = metas[0];
  const now = 1786328729046; // same timestamp as the uploaded files

  const baseUrl = `https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/news-pages/kazuya`;
  const thumbUrl = `${baseUrl}/kazuya_thumb_${now}.webp`;
  const domeUrl = `${baseUrl}/kazuya_dome_${now}.webp`;
  const handUrl = `${baseUrl}/kazuya_hand_${now}.webp`;

  // Fix 1: Update photos object to use the Supabase WebP URLs
  const photos = {
    ...(meta.photos || {}),
    dome: {
      url: domeUrl,
      alt: 'PayPayドーム前に立つ176cm長身のカズヤ',
      caption: 'PayPayドーム前で。落ち着いた立ち姿が印象的',
      layout: 'portrait'
    },
    hand: {
      url: handUrl,
      alt: '美しい手でドリンクを持つカズヤ',
      caption: '綺麗な手元と、スタバでのリラックスしたひととき',
      layout: 'portrait'
    }
  };

  // Fix 2: Update dialogue_data to convert type: 'image' → 'photo' for items with photo_key
  const dialogue = meta.dialogue_data;
  for (const sec of dialogue.sections) {
    for (const item of sec.items) {
      if (item.photo_key && item.type === 'image') {
        item.type = 'photo';
        console.log(`  Fixed item ${item.id}: photo_key=${item.photo_key} → type changed to "photo"`);
      }
    }
  }

  const { error } = await supabase.from('interview_meta').update({
    photos,
    dialogue_data: dialogue
  }).eq('id', meta.id);

  if (error) {
    console.error('Error updating meta:', error);
    return;
  }

  console.log('\n✅ photos field updated to Supabase WebP URLs!');
  console.log('✅ dialogue_data image items converted to type: "photo"!');
  console.log('\nPhoto URLs set:');
  console.log('  dome:', domeUrl);
  console.log('  hand:', handUrl);
}

fixKazuyaPhotosAndDialogue().catch(console.error);
