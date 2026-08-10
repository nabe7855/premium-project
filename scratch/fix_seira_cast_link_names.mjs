import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixSeiraCastLinkNames() {
  console.log('=== FIXING SEIRA CAST LINK NAMES IN DB ===\n');

  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'seira-interview-vol4' }
  });

  if (!article) return;

  const meta = await prisma.interviewMeta.findFirst({
    where: { article_id: article.id }
  });

  if (!meta) return;

  const seiraCast = await prisma.cast.findFirst({
    where: { slug: '-130642' }
  });

  const castLinks = await prisma.interviewCastLink.findMany({
    where: { interview_meta_id: meta.id }
  });

  console.log('Current Cast Links:', castLinks);

  for (const cl of castLinks) {
    await prisma.interviewCastLink.update({
      where: { id: cl.id },
      data: {
        cast_name: '青空（せいら）',
        cast_name_romaji: '-130642',
        cast_id: seiraCast ? seiraCast.id : cl.cast_id
      }
    });
  }

  console.log('✅ Updated interview_cast_links for Seira to "青空（せいら）"!');
}

fixSeiraCastLinkNames().catch(console.error);
