import { prisma } from '../src/lib/prisma.ts';

async function investigateInterviews() {
  console.log('=== ALL MEDIA ARTICLES WITH CATEGORY = interview ===');
  const articles = await prisma.mediaArticle.findMany({
    where: { category: 'interview' },
  });

  for (const a of articles) {
    console.log({
      id: a.id,
      title: a.title,
      slug: a.slug,
      status: a.status,
      category: a.category,
    });
  }

  console.log('\n=== ALL INTERVIEW METAS ===');
  const metas = await prisma.interviewMeta.findMany({
    include: {
      cast_links: true,
    },
  });

  for (const m of metas) {
    const art = articles.find(a => a.id === m.article_id);
    console.log({
      meta_id: m.id,
      article_id: m.article_id,
      area: m.area,
      vol_number: m.vol_number,
      article_status: art?.status,
      article_category: art?.category,
      article_title: art?.title,
      article_slug: art?.slug,
      cast_links: m.cast_links.map(cl => ({ cast_name: cl.cast_name, role: cl.role })),
    });
  }

  console.log('\n=== ALL MEDIA ARTICLES REGARDLESS OF CATEGORY ===');
  const allArticles = await prisma.mediaArticle.findMany();
  for (const a of allArticles) {
    if (a.title.includes('インタビュー') || a.title.includes('vol') || a.title.includes('Vol')) {
      console.log({
        id: a.id,
        title: a.title,
        slug: a.slug,
        status: a.status,
        category: a.category,
      });
    }
  }
}

investigateInterviews().catch(console.error);
