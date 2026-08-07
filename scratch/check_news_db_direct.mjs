import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkDirect() {
  const rec = await prisma.pageRequest.findFirst({
    where: { slug: 'news-1773289329952' }
  });

  console.log('DB Record for news-1773289329952:');
  console.log(rec);

  await prisma.$disconnect();
}

checkDirect();
