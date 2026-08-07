import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkSlugs() {
  const records = await prisma.pageRequest.findMany({
    where: {
      OR: [
        { title: { contains: '無料モニター' } },
        { title: { contains: 'オープニングセラピスト募集' } },
        { slug: { contains: 'news-1774078959842' } }
      ]
    }
  });

  console.log('--- Matching Records ---');
  console.log(records.map(r => ({ id: r.id, slug: r.slug, title: r.title, status: r.status })));

  await prisma.$disconnect();
}

checkSlugs();
