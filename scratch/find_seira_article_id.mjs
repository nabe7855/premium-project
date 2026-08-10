import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function findSeiraArticleId() {
  console.log('=== FINDING SEIRA ARTICLE ID ===\n');

  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'seira-interview-vol4' }
  });

  const seiraCast = await prisma.cast.findFirst({
    where: { name: { contains: 'せいら' } }
  });

  console.log('Seira Article:', article);
  console.log('Seira Cast:', seiraCast);
}

findSeiraArticleId().catch(console.error);
