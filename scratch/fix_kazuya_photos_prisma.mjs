import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixKazuyaPhotosPrisma() {
  console.log('=== FIXING KAZUYA PHOTOS & DIALOGUE VIA PRISMA ===\n');

  const article = await prisma.mediaArticle.findUnique({ where: { slug: 'kazuya-interview' } });
  if (!article) { console.error('Article not found'); return; }
  console.log('Article ID:', article.id);

  const meta = await prisma.interviewMeta.findFirst({ where: { article_id: article.id } });
  if (!meta) { console.error('Meta not found'); return; }
  console.log('Meta ID:', meta.id);

  const now = 1786328729046;
  const baseUrl = `https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/news-pages/kazuya`;

  const existingPhotos = meta.photos || {};

  const photos = {
    ...existingPhotos,
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

  // Fix dialogue_data: type 'image' → 'photo'
  const dialogue = meta.dialogue_data;
  if (dialogue && dialogue.sections) {
    for (const sec of dialogue.sections) {
      for (const item of sec.items) {
        if (item.photo_key && item.type === 'image') {
          item.type = 'photo';
          console.log(`  Fixed item ${item.id}: type=photo, photo_key=${item.photo_key}`);
        }
      }
    }
  }

  await prisma.interviewMeta.update({
    where: { id: meta.id },
    data: { photos, dialogue_data: dialogue }
  });

  console.log('\n✅ Updated via Prisma successfully!');
  console.log('dome URL:', photos.dome.url);
  console.log('hand URL:', photos.hand.url);
}

fixKazuyaPhotosPrisma().catch(console.error).finally(() => prisma.$disconnect());
