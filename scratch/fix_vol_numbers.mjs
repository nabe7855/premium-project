import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixVolNumbers() {
  console.log('=== FIXING VOL NUMBERS FOR KAZUYA & YUUHI ===\n');

  // Fix Kazuya: vol_number 2 → 3
  const kazuya = await prisma.mediaArticle.findUnique({ where: { slug: 'kazuya-interview' } });
  if (kazuya) {
    const kazuyaMeta = await prisma.interviewMeta.findFirst({ where: { article_id: kazuya.id } });
    if (kazuyaMeta) {
      await prisma.interviewMeta.update({
        where: { id: kazuyaMeta.id },
        data: { vol_number: 3, series_slug: 'ito-naked-interview' }
      });
      console.log('✅ kazuya-interview: vol_number → 3, series_slug → ito-naked-interview');
    }
  }

  // Fix Yuuhi: vol_number 1 → 2
  const yuuhi = await prisma.mediaArticle.findUnique({ where: { slug: 'yuuhi-interview-vol2' } });
  if (yuuhi) {
    const yuuhiMeta = await prisma.interviewMeta.findFirst({ where: { article_id: yuuhi.id } });
    if (yuuhiMeta) {
      await prisma.interviewMeta.update({
        where: { id: yuuhiMeta.id },
        data: { vol_number: 2, series_slug: 'ito-naked-interview' }
      });
      console.log('✅ yuuhi-interview-vol2: vol_number → 2, series_slug → ito-naked-interview');
    }
  }

  // Also fix Sai to ensure series_slug is consistent
  const sai = await prisma.mediaArticle.findUnique({ where: { slug: 'sai-interview-vol1' } });
  if (sai) {
    const saiMeta = await prisma.interviewMeta.findFirst({ where: { article_id: sai.id } });
    if (saiMeta) {
      await prisma.interviewMeta.update({
        where: { id: saiMeta.id },
        data: { vol_number: 1, series_slug: 'ito-naked-interview' }
      });
      console.log('✅ sai-interview-vol1: vol_number confirmed 1, series_slug → ito-naked-interview');
    }
  }

  console.log('\n=== FINAL STATE ===');
  const allMetas = await prisma.interviewMeta.findMany({
    where: { article: { category: 'interview' } },
    include: { article: { select: { slug: true } } }
  });
  for (const m of allMetas) {
    console.log(`slug: ${m.article?.slug} | vol: ${m.vol_number} | series: ${m.series_slug}`);
  }
}

fixVolNumbers().catch(console.error).finally(() => prisma.$disconnect());
