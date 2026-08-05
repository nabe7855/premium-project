import { prisma } from '../src/lib/prisma.ts';

async function checkDates() {
  const metas = await prisma.interviewMeta.findMany({
    orderBy: { created_at: 'desc' },
  });

  const articles = await prisma.mediaArticle.findMany();

  for (const m of metas) {
    const art = articles.find(a => a.id === m.article_id);
    console.log({
      id: m.id,
      article_id: m.article_id,
      title: art?.title,
      slug: art?.slug,
      status: art?.status,
      category: art?.category,
      area: m.area,
      created_at: m.created_at,
    });
  }
}

checkDates().catch(console.error);
