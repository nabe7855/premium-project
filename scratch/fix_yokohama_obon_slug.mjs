import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.pageRequest.update({
    where: { id: '8f330216-2a55-4405-9030-781ee49eb80a' },
    data: { slug: 'news-20260803-info' },
  });

  console.log('✅ Updated Yokohama Obon Slug:', updated.slug);
}

main().catch(console.error).finally(() => prisma.$disconnect());
