import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.mediaArticle.findMany({
    select: { id: true, title: true, slug: true, status: true, target_audience: true },
  });
  console.log(`Total MediaArticles in DB: ${articles.length}`);
  
  const userArticles = articles.filter(a => a.target_audience === 'user');
  console.log(`Articles with target_audience='user' (magazine): ${userArticles.length}`);
  
  const publishedUserArticles = userArticles.filter(a => a.status === 'published');
  console.log(`Published magazine articles: ${publishedUserArticles.length}`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
