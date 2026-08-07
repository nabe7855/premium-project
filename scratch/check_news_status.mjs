import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkStatus() {
  const record = await prisma.pageRequest.findFirst({
    where: { slug: 'news-1784964648172' }
  });

  console.log('Record for news-1784964648172:');
  console.log(record);

  await prisma.$disconnect();
}

checkStatus();
