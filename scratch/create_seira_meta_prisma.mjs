import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createSeiraMetaPrisma() {
  console.log('=== CREATING SEIRA INTERVIEW META & CAST LINKS VIA PRISMA ===\n');

  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'seira-interview-vol4' }
  });

  if (!article) {
    console.error('Article not found!');
    return;
  }

  const existingMeta = await prisma.interviewMeta.findFirst({
    where: { article_id: article.id }
  });

  let metaId = existingMeta ? existingMeta.id : null;

  if (!metaId) {
    const newMeta = await prisma.interviewMeta.create({
      data: {
        article_id: article.id,
        article_type: 'solo_interview',
        series_slug: 'seira-interview',
        vol_number: 4,
        area: 'fukuoka'
      }
    });
    metaId = newMeta.id;
    console.log('✅ Created interview_meta via Prisma:', metaId);
  } else {
    console.log('interview_meta already exists:', metaId);
  }

  const existingLinks = await prisma.interviewCastLink.findMany({
    where: { interview_meta_id: metaId }
  });

  if (existingLinks.length === 0) {
    const link1 = await prisma.interviewCastLink.create({
      data: {
        interview_meta_id: metaId,
        cast_id: '8df77013-ed2c-435f-8f9e-83f1cb60f41f',
        cast_name: '青空（せいら）',
        cast_name_romaji: '-130642',
        role: 'interviewee',
        display_order: 0
      }
    });
    console.log('✅ Created interview_cast_link for Seira:', link1.id);
  } else {
    console.log('interview_cast_links already exist:', existingLinks);
  }
}

createSeiraMetaPrisma().catch(console.error);
