import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function processKazuyaImages() {
  console.log('=== CONVERTING KAZUYA IMAGES TO WEBP & UPLOADING TO SUPABASE ===\n');

  // User uploaded file paths (ordered by prompt):
  // 1. Thumbnail image: media_1786328393838.jpg
  // 2. PayPay Dome / Fukuoka building & standing Kazuya image: media_1786328524197.jpg
  // 3. Hand holding Starbucks drink image: media_1786328524212.jpg

  const thumbPath = 'C:/Users/nabe7/.gemini/antigravity/brain/05249213-5ec4-4daa-842a-ba7a34d81fe9/.user_uploaded/media_1786328393838.jpg';
  const domePath = 'C:/Users/nabe7/.gemini/antigravity/brain/05249213-5ec4-4daa-842a-ba7a34d81fe9/.user_uploaded/media_1786328524197.jpg';
  const handPath = 'C:/Users/nabe7/.gemini/antigravity/brain/05249213-5ec4-4daa-842a-ba7a34d81fe9/.user_uploaded/media_1786328524212.jpg';

  const now = Date.now();

  // Convert all 3 images to WebP
  const thumbWebp = await sharp(thumbPath).webp({ quality: 90 }).toBuffer();
  const domeWebp = await sharp(domePath).webp({ quality: 90 }).toBuffer();
  const handWebp = await sharp(handPath).webp({ quality: 90 }).toBuffer();

  const thumbName = `kazuya_thumb_${now}.webp`;
  const domeName = `kazuya_dome_${now}.webp`;
  const handName = `kazuya_hand_${now}.webp`;

  // Upload to Supabase Storage ('banners' bucket)
  const { error: e1 } = await supabase.storage.from('banners').upload(`news-pages/kazuya/${thumbName}`, thumbWebp, { contentType: 'image/webp', upsert: true });
  const { error: e2 } = await supabase.storage.from('banners').upload(`news-pages/kazuya/${domeName}`, domeWebp, { contentType: 'image/webp', upsert: true });
  const { error: e3 } = await supabase.storage.from('banners').upload(`news-pages/kazuya/${handName}`, handWebp, { contentType: 'image/webp', upsert: true });

  if (e1 || e2 || e3) {
    console.error('Upload error:', { e1, e2, e3 });
    return;
  }

  const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/banners/news-pages/kazuya`;
  const thumbUrl = `${baseUrl}/${thumbName}`;
  const domeUrl = `${baseUrl}/${domeName}`;
  const handUrl = `${baseUrl}/${handName}`;

  console.log('✅ Uploaded WebP URLs:');
  console.log('  Thumbnail:', thumbUrl);
  console.log('  PayPay Dome:', domeUrl);
  console.log('  Drink Hand:', handUrl);

  // Update media_articles (thumbnail_url)
  const { data: updatedArticles, error: artErr } = await supabase
    .from('media_articles')
    .update({ thumbnail_url: thumbUrl })
    .eq('slug', 'kazuya-interview')
    .select();

  if (artErr) console.error('Error updating media_articles:', artErr);
  else console.log('✅ Updated media_articles thumbnail_url!');

  // Update interview_meta photos and structured_data
  const { data: articles } = await supabase.from('media_articles').select('*').eq('slug', 'kazuya-interview');
  if (articles && articles.length > 0) {
    const { data: metas } = await supabase.from('interview_meta').select('*').eq('article_id', articles[0].id);
    if (metas && metas.length > 0) {
      const meta = metas[0];
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
          caption: '綺麗な手元と、カフェでのリラックスしたひととき',
          layout: 'portrait'
        }
      };

      const structuredData = meta.structured_data || [];
      if (Array.isArray(structuredData) && structuredData.length > 0) {
        structuredData[0].image = [thumbUrl];
      }

      await supabase.from('interview_meta').update({
        ogp_image_url: thumbUrl,
        photos,
        structured_data: structuredData
      }).eq('id', meta.id);

      console.log('✅ Updated interview_meta photos and structured_data with new WebP URLs!');
    }
  }
}

processKazuyaImages().catch(console.error);
