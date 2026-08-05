import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const records = await prisma.pageRequest.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      referenceUrls: true,
    },
  });

  console.log('=== EXISTING PAGE_REQUEST CATEGORY VALUES ===');
  const categoryCounts = {};

  records.forEach((r) => {
    const misc = r.referenceUrls || {};
    const cat = misc.category !== undefined ? String(misc.category) : 'UNDEFINED';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    console.log(`- Slug: ${r.slug.padEnd(35)} | Category: "${cat}" | Title: ${r.title}`);
  });

  console.log('\n=== CATEGORY COUNTS SUMMARY ===');
  console.dir(categoryCounts);
}

main().catch(console.error).finally(() => prisma.$disconnect());
