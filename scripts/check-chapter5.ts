import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const article = await prisma.mediaArticle.findUnique({ where: { slug: 'jyosei-fuzoku-guide' } });
  if (article && article.content) {
    const match = article.content.match(/<h2[^>]*>[\s\S]*?(?=<h2|$)/g);
    if (match && match.length >= 5) {
      console.log('Chapter 5 content preview:\n', match[4].substring(0, 500));
    } else {
      console.log('Could not find Chapter 5.');
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
