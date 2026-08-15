import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Use service role key for RLS bypass
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixKazuyaPhotosServiceRole() {
  const { data: articles } = await supabase.from('media_articles').select('id').eq('slug', 'kazuya-interview');
  const articleId = articles[0].id;
  console.log('Article ID:', articleId);

  const { data: metas, error: fetchError } = await supabase.from('interview_meta').select('id, photos, dialogue_data').eq('article_id', articleId);
  if (fetchError) { console.error('Fetch error:', fetchError); return; }
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

  const dialogue = meta.dialogue_data;
  for (const sec of dialogue.sections) {
    for (const item of sec.items) {
      if (item.photo_key) {
        item.type = 'photo';
        console.log(`  Fixed: ${item.id} → type=photo, photo_key=${item.photo_key}`);
      }
    }
  }

  // Try upsert instead of update
  const { data: updated, error: updateError } = await supabase
    .from('interview_meta')
    .upsert({ id: meta.id, article_id: articleId, photos, dialogue_data: dialogue }, { onConflict: 'id' })
    .select();

  if (updateError) {
    console.error('Upsert error:', updateError);
    return;
  }

  if (updated && updated.length > 0) {
    console.log('\n✅ Upserted successfully!');
    console.log('dome URL:', updated[0].photos?.dome?.url);
    console.log('hand URL:', updated[0].photos?.hand?.url);
  } else {
    console.log('No rows returned from upsert, trying direct patch...');
    // Try a direct fetch to confirm
    const { data: check } = await supabase.from('interview_meta').select('photos').eq('id', meta.id);
    console.log('Current photos after upsert:', JSON.stringify(check?.[0]?.photos, null, 2));
  }
}

fixKazuyaPhotosServiceRole().catch(console.error);
