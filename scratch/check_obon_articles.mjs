import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkObonArticles() {
  const records = await prisma.pageRequest.findMany({
    where: {
      OR: [
        { title: { contains: 'お盆' } },
        { slug: { contains: '1785225904472' } },
        { slug: { contains: '20260803-info' } }
      ]
    }
  });

  console.log(JSON.stringify(records, null, 2));
}

checkObonArticles().catch(console.error).finally(() => prisma.$disconnect());
