import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function listAllSlugs() {
  const records = await prisma.pageRequest.findMany({
    select: { id: true, slug: true, title: true, status: true, targetStoreSlugs: true }
  });

  console.log('--- ALL NEWS SLUGS IN DB ---');
  records.forEach(r => {
    console.log(`[id: ${r.id}] slug: "${r.slug}" | title: "${r.title}" | status: ${r.status} | stores: [${r.targetStoreSlugs}]`);
  });

  await prisma.$disconnect();
}

listAllSlugs();
