import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function applySeiraSupabasePhotoUrls() {
  console.log('=== APPLYING SUPABASE PUBLIC PHOTO URLS TO SEIRA INTERVIEW ===\n');

  const p1Url = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/news-pages/seira/seira_portrait_1786320401253.jpg';
  const p2Url = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/news-pages/seira/seira_fullbody_1786320401253.jpg';

  // 1. Update media_articles thumbnail_url
  const article = await prisma.mediaArticle.update({
    where: { slug: 'seira-interview-vol4' },
    data: {
      thumbnail_url: p1Url
    }
  });

  console.log('✅ Updated media_articles thumbnail_url:', article.thumbnail_url);

  // 2. Update interview_meta photos
  const meta = await prisma.interviewMeta.findFirst({
    where: { article_id: article.id }
  });

  if (meta) {
    const photosData = {
      portrait: {
        url: p1Url,
        alt: '174cm細身のセイラ'
      },
      fullbody: {
        url: p2Url,
        alt: '白Tシャツに黒パンツのシンプルな私服姿のセイラ'
      }
    };

    await prisma.interviewMeta.update({
      where: { id: meta.id },
      data: {
        photos: photosData
      }
    });

    console.log('✅ Updated interview_meta photosData with live Supabase URLs!');
  }
}

applySeiraSupabasePhotoUrls().catch(console.error);
