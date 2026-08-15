import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function findAyaArticle() {
  const articles = await prisma.mediaArticle.findMany({
    where: {
      category: 'amolab',
      status: 'published'
    }
  });
  console.log('Amolab Articles:');
  for (const a of articles) {
    console.log(`- ${a.title} (${a.slug})`);
  }
}

findAyaArticle().catch(console.error).finally(() => prisma.$disconnect());
