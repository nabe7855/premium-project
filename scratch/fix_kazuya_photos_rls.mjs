import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fixKazuyaPhotosRLS() {
  // Get data
  const { data: articles } = await supabase.from('media_articles').select('id').eq('slug', 'kazuya-interview');
  const articleId = articles[0].id;
  const { data: metas } = await supabase.from('interview_meta').select('id, photos, dialogue_data').eq('article_id', articleId);
  const meta = metas[0];

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

  const dialogue = meta.dialogue_data;
  for (const sec of dialogue.sections) {
    for (const item of sec.items) {
      if (item.photo_key) {
        item.type = 'photo';
      }
    }
  }

  // Check if RLS is allowing update by checking update response
  const { data: updateResult, error: updateError, status, statusText, count } = await supabase
    .from('interview_meta')
    .update({ photos, dialogue_data: dialogue })
    .eq('id', meta.id)
    .select('id, photos');

  console.log('Update status:', status, statusText);
  console.log('Update count:', count);
  console.log('Update result:', JSON.stringify(updateResult, null, 2));
  if (updateError) console.error('Update error:', updateError);
}

fixKazuyaPhotosRLS().catch(console.error);
