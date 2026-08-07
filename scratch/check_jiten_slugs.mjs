import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkJitenSlugs() {
  const articles = await prisma.mediaArticle.findMany({
    where: { category: 'amolab-jiten' },
    select: { slug: true, title: true }
  });

  console.log('=== AMOLAB JITEN ARTICLES (total:', articles.length, ') ===');
  articles.forEach((a, i) => {
    console.log(`${i + 1}. [${a.slug}] ${a.title}`);
  });

  await prisma.$disconnect();
}

checkJitenSlugs();
