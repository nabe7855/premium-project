import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fixKazuyaByMetaId() {
  const { data: articles } = await supabase.from('media_articles').select('id').eq('slug', 'kazuya-interview');
  console.log('Article ID:', articles[0].id);

  const { data: metas } = await supabase.from('interview_meta').select('id, photos, dialogue_data').eq('article_id', articles[0].id);
  const meta = metas[0];
  console.log('Meta ID:', meta.id);

  const now = 1786328729046;
  const baseUrl = `https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/news-pages/kazuya`;

  const photos = {
    staff_photos: meta.photos?.staff_photos || {},
    dome: {
      url: `${baseUrl}/kazuya_dome_${now}.webp`,
      alt: 'PayPayドーム前に立つ176cm長身のカズヤ',
      caption: 'PayPayドーム前で。落ち着いた立ち姿が印象的',
      layout: 'portrait'
    },
    hand: {
      url: `${baseUrl}/kazuya_hand_${now}.webp`,
      alt: '美しい手でスタバのドリンクを持つカズヤ',
      caption: '綺麗な手元と、カフェでのリラックスしたひととき',
      layout: 'portrait'
    }
  };

  // Fix dialogue_data type image → photo
  const dialogue = meta.dialogue_data;
  for (const sec of dialogue.sections) {
    for (const item of sec.items) {
      if (item.photo_key) {
        item.type = 'photo';
      }
    }
  }

  // Use meta.id directly for the WHERE clause
  const { data, error } = await supabase
    .from('interview_meta')
    .update({ photos, dialogue_data: dialogue })
    .eq('id', meta.id)
    .select();

  if (error) {
    console.error('ERROR:', error);
  } else {
    console.log('✅ Updated successfully! Row count:', data.length);
    console.log('New photos.dome.url:', data[0].photos.dome?.url);
    console.log('New photos.hand.url:', data[0].photos.hand?.url);
    const dialogueItems = [];
    for (const sec of data[0].dialogue_data.sections) {
      for (const item of sec.items) {
        if (item.photo_key) dialogueItems.push({ type: item.type, photo_key: item.photo_key });
      }
    }
    console.log('Dialogue photo items:', dialogueItems);
  }
}

fixKazuyaByMetaId().catch(console.error);
