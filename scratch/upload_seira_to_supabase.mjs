import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function uploadSeiraPhotosToSupabase() {
  console.log('=== UPLOADING SEIRA PHOTOS TO SUPABASE BANNERS BUCKET ===\n');

  const photo1Path = 'ストロベリーボーイズ運用/セイラ/S__52174854_0.jpg';
  const photo2Path = 'ストロベリーボーイズ運用/セイラ/S__52174855_0.jpg';

  const p1Buffer = fs.readFileSync(photo1Path);
  const p2Buffer = fs.readFileSync(photo2Path);

  const file1Name = `seira_portrait_${Date.now()}.jpg`;
  const file2Name = `seira_fullbody_${Date.now()}.jpg`;

  const { data: d1, error: e1 } = await supabase.storage
    .from('banners')
    .upload(`news-pages/seira/${file1Name}`, p1Buffer, { contentType: 'image/jpeg', upsert: true });

  if (e1) console.error('Error uploading photo 1:', e1);

  const { data: d2, error: e2 } = await supabase.storage
    .from('banners')
    .upload(`news-pages/seira/${file2Name}`, p2Buffer, { contentType: 'image/jpeg', upsert: true });

  if (e2) console.error('Error uploading photo 2:', e2);

  const url1 = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/banners/news-pages/seira/${file1Name}`;
  const url2 = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/banners/news-pages/seira/${file2Name}`;

  console.log('✅ Photo 1 URL:', url1);
  console.log('✅ Photo 2 URL:', url2);

  return { url1, url2 };
}

uploadSeiraPhotosToSupabase().catch(console.error);
