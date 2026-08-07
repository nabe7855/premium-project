import { prisma } from '../src/lib/prisma.ts';

async function verifyAyaArticle() {
  console.log('=== VERIFYING AYA ARTICLE IN DB ===\n');

  const ayaArticle = await prisma.mediaArticle.findFirst({
    where: { slug: 'voice-aya' }
  });

  if (ayaArticle) {
    console.log(`Article found: ${ayaArticle.title}`);
    console.log(`Thumbnail URL: ${ayaArticle.thumbnail_url}`);
    
    // サムネイルURLを "/images/amolab/aya/aya-photo-top.webp" に維持・設定
    await prisma.mediaArticle.update({
      where: { id: ayaArticle.id },
      data: {
        thumbnail_url: '/images/amolab/aya/aya-photo-top.webp'
      }
    });

    console.log('✅ Updated DB thumbnail_url to /images/amolab/aya/aya-photo-top.webp');
  }
}

verifyAyaArticle().catch(console.error);
