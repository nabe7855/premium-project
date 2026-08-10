import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function processSeiraThumbWebp() {
  console.log('=== CONVERTING SEIRA THUMB TO WEBP & UPLOADING TO SUPABASE ===\n');

  const sourceImagePath = 'C:/Users/nabe7/.gemini/antigravity/brain/05249213-5ec4-4daa-842a-ba7a34d81fe9/.user_uploaded/media_1786326846334.jpg';

  if (!fs.existsSync(sourceImagePath)) {
    console.error('Source image file not found:', sourceImagePath);
    return;
  }

  // 1. Convert to high-quality WebP using sharp
  const webpBuffer = await sharp(sourceImagePath)
    .webp({ quality: 90 })
    .toBuffer();

  const fileName = `seira_interview_vol4_thumb_${Date.now()}.webp`;
  const storagePath = `news-pages/seira/${fileName}`;

  // 2. Upload to Supabase Storage ('banners' bucket)
  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from('banners')
    .upload(storagePath, webpBuffer, {
      contentType: 'image/webp',
      upsert: true,
    });

  if (uploadErr) {
    console.error('Error uploading WebP to Supabase:', uploadErr);
    return;
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/banners/${storagePath}`;
  console.log('✅ WebP Converted & Uploaded Public URL:', publicUrl);

  // 3. Update DB: media_articles (slug: seira-interview-vol4)
  const { data: updatedArticle, error: artErr } = await supabase
    .from('media_articles')
    .update({ thumbnail_url: publicUrl })
    .eq('slug', 'seira-interview-vol4')
    .select();

  if (artErr) console.error('Error updating media_articles:', artErr);
  else console.log('✅ Updated media_articles thumbnail_url:', updatedArticle);

  // 4. Update DB: interview_meta (structured_data image array)
  const { data: articles } = await supabase.from('media_articles').select('*').eq('slug', 'seira-interview-vol4');
  if (articles && articles.length > 0) {
    const { data: metas } = await supabase.from('interview_meta').select('*').eq('article_id', articles[0].id);
    if (metas && metas.length > 0) {
      const meta = metas[0];
      const structuredData = meta.structured_data || [];
      if (Array.isArray(structuredData) && structuredData.length > 0) {
        structuredData[0].image = [publicUrl];
      }
      await supabase.from('interview_meta').update({
        ogp_image_url: publicUrl,
        structured_data: structuredData
      }).eq('id', meta.id);
      console.log('✅ Updated interview_meta OGP and structured_data image!');
    }
  }

  return publicUrl;
}

processSeiraThumbWebp().catch(console.error);
