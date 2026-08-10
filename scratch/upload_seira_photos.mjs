import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function uploadSeiraPhotos() {
  console.log('=== UPLOADING SEIRA PHOTOS TO SUPABASE STORAGE ===\n');

  const baseDir = 'C:\\Users\\nabe7\\.gemini\\antigravity\\scratch\\obsidian-antigravity-nexus\\dev\\premium-project\\ストロベリーボーイズ運用\\セイラ';
  const photo1Path = path.join(baseDir, 'S__52174854_0.jpg'); // portrait
  const photo2Path = path.join(baseDir, 'S__52174855_0.jpg'); // fullbody

  // Convert to WebP
  const portraitWebp = await sharp(photo1Path).resize(1200, null, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  const fullbodyWebp = await sharp(photo2Path).resize(1200, null, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();

  const time = Date.now();
  const portraitFileName = `seira/portrait_${time}.webp`;
  const fullbodyFileName = `seira/fullbody_${time}.webp`;

  // Upload to gallery bucket
  const { data: pData, error: pErr } = await supabase.storage.from('gallery').upload(portraitFileName, portraitWebp, {
    contentType: 'image/webp',
    upsert: true
  });
  if (pErr) console.error('Error uploading portrait photo:', pErr);

  const { data: fData, error: fErr } = await supabase.storage.from('gallery').upload(fullbodyFileName, fullbodyWebp, {
    contentType: 'image/webp',
    upsert: true
  });
  if (fErr) console.error('Error uploading fullbody photo:', fErr);

  const portraitUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${portraitFileName}`;
  const fullbodyUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${fullbodyFileName}`;

  console.log('Uploaded Portrait URL:', portraitUrl);
  console.log('Uploaded Fullbody URL:', fullbodyUrl);

  // Write URLs to scratch file for data script to consume
  fs.writeFileSync('scratch/uploaded_seira_urls.json', JSON.stringify({ portraitUrl, fullbodyUrl }, null, 2));
}

uploadSeiraPhotos().catch(console.error);
