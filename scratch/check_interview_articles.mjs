import { prisma } from '../src/lib/prisma.ts';

async function checkArticles() {
  console.log('=== CHECKING MEDIA ARTICLES IN DB ===\n');

  const articles = await prisma.mediaArticle.findMany({
    where: {
      OR: [
        { slug: { contains: 'voice' } },
        { slug: { contains: 'interview' } },
        { category: 'amolab' }
      ]
    },
    select: {
      id: true,
      slug: true,
      title: true,
      eyecatch_url: true,
      category: true,
      content: true,
    }
  });

  console.log(`Found ${articles.length} articles:\n`);
  for (const a of articles) {
    console.log(`- Slug: ${a.slug}`);
    console.log(`  Title: ${a.title}`);
    console.log(`  Eyecatch URL: ${a.eyecatch_url}`);
    if (a.content) {
      const imgMatches = a.content.match(/<img[^>]+src=["']([^"']+)["']/g);
      if (imgMatches) {
        console.log(`  Images in content:`, imgMatches);
      }
    }
    console.log('');
  }
}

checkArticles().catch(console.error);
