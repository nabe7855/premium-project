import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const targetSlug = 'news-1785718651524';
  const article = await prisma.pageRequest.findUnique({
    where: { slug: targetSlug },
  });

  if (!article) {
    console.error('❌ Article not found');
    return;
  }

  console.log('=== TARGET ARTICLE TITLE ===');
  console.log('Title:', article.title);

  console.log('\n=== SECTIONS DATA ===');
  console.log(JSON.stringify(article.sections, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
