import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const targetSlug = 'news-1785718651524';
  const article = await prisma.pageRequest.findUnique({
    where: { slug: targetSlug },
  });

  console.log('=== CLIENT EDITED ARTICLE DATA ===');
  console.log('ID:', article?.id);
  console.log('Title:', article?.title);
  console.log('Status:', article?.status);
  console.log('Slug:', article?.slug);
  console.log('targetStoreSlugs:', article?.targetStoreSlugs);
  console.log('UpdatedAt:', article?.updatedAt);
  console.log('\n--- Full Sections JSON ---');
  console.log(JSON.stringify(article?.sections, null, 2));

  console.log('\n--- Reference URLs / storeSettings ---');
  console.log(JSON.stringify(article?.referenceUrls, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
