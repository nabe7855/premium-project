import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function investigateNewsArticles() {
  console.log('=== MEDIA ARTICLES (recent news) ===\n');

  const articles = await prisma.mediaArticle.findMany({
    where: {
      category: { in: ['news', 'ikejo', 'fukuoka'] }
    },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      status: true,
      published_at: true,
      target_audience: true,
      tags: { include: { tag: true } }
    },
    orderBy: { published_at: 'desc' },
    take: 10
  });

  for (const a of articles) {
    console.log(`slug: ${a.slug}`);
    console.log(`  title: ${a.title}`);
    console.log(`  category: ${a.category} | status: ${a.status} | audience: ${a.target_audience}`);
    console.log(`  published_at: ${a.published_at}`);
    console.log(`  tags: ${a.tags.map(t => t.tag.name).join(', ')}`);
    console.log('');
  }

  // Check all distinct categories
  const all = await prisma.mediaArticle.findMany({ select: { category: true, status: true, slug: true }, orderBy: { created_at: 'desc' }, take: 30 });
  const cats = [...new Set(all.map(a => a.category))];
  console.log('ALL CATEGORIES USED:', cats);
  console.log('\nSAMPLE SLUGS BY CATEGORY:');
  for (const cat of cats) {
    const sample = all.filter(a => a.category === cat).slice(0, 3);
    console.log(`  ${cat}: ${sample.map(a => `${a.slug}(${a.status})`).join(', ')}`);
  }
}

investigateNewsArticles().catch(console.error).finally(() => prisma.$disconnect());
