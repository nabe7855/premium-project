const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const prisma = new PrismaClient();

async function uploadImage(filePath) {
  const fileData = fs.readFileSync(filePath);
  const fileName = `media_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
  
  const { data, error } = await supabase.storage
    .from('banners')
    .upload(`media/${fileName}`, fileData, {
      contentType: 'image/jpeg',
      upsert: true
    });
    
  if (error) {
    console.error(`Upload failed for ${filePath}`, error);
    return null;
  }
  
  const { data: urlData } = supabase.storage.from('banners').getPublicUrl(`media/${fileName}`);
  return urlData.publicUrl;
}

async function main() {
  console.log('Uploading images to Supabase...');
  const selfieUrl = await uploadImage('./public/images/casts/yuuhi/selfie.jpg');
  const sunsetUrl = await uploadImage('./public/images/casts/yuuhi/sunset-beach.jpg');
  const cafeUrl = await uploadImage('./public/images/casts/yuuhi/cafe-date.jpg');
  
  console.log('Uploaded URLs:', { selfieUrl, sunsetUrl, cafeUrl });
  
  const slug = 'yuuhi-interview-vol3';
  const article = await prisma.mediaArticle.findUnique({ where: { slug } });
  const meta = await prisma.interviewMeta.findUnique({ where: { article_id: article.id } });
  
  const photos = meta.photos;
  if (selfieUrl) photos.selfie_pic.url = selfieUrl;
  if (sunsetUrl) photos.sunset_beach.url = sunsetUrl;
  if (cafeUrl) photos.cafe_date.url = cafeUrl;
  
  await prisma.$executeRawUnsafe(
    `UPDATE interview_meta SET photos = $1::jsonb WHERE id = $2::uuid`,
    JSON.stringify(photos),
    meta.id
  );
  
  console.log('DB updated with Supabase URLs successfully.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
