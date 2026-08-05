import { prisma } from '../src/lib/prisma.ts';

async function inspectAmoLab() {
  console.log('=== ALL MEDIA ARTICLES (ALL CATEGORIES) ===');
  const articles = await prisma.mediaArticle.findMany({
    include: {
      tags: { include: { tag: true } }
    }
  });

  const categories = {};
  for (const a of articles) {
    categories[a.category] = (categories[a.category] || 0) + 1;
    console.log({
      id: a.id,
      title: a.title,
      slug: a.slug,
      category: a.category,
      status: a.status,
      tags: a.tags.map(t => t.tag.name),
    });
  }

  console.log('\n=== CATEGORY COUNTS ===');
  console.log(categories);

  console.log('\n=== ALL MEDIA TAGS ===');
  const tags = await prisma.mediaTag.findMany();
  console.log(tags);
}

inspectAmoLab().catch(console.error);
