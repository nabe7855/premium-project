import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const article = await prisma.pageRequest.findFirst({
    where: {
      OR: [
        { slug: { contains: '1785376605692' } },
        { title: { contains: 'お盆' } },
      ],
    },
  });

  console.log('=== OBON ARTICLE IN DB ===');
  if (article) {
    console.log('ID:', article.id);
    console.log('Title:', article.title);
    console.log('Slug:', article.slug);
    console.log('TargetStoreSlugs:', article.targetStoreSlugs);
    console.log('ReferenceUrls:', JSON.stringify(article.referenceUrls, null, 2));
  } else {
    console.log('Not found');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
