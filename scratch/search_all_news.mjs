import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const records = await prisma.pageRequest.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  console.log(`Total PageRequest records: ${records.length}`);
  for (const r of records) {
    console.log(`\nID: ${r.id} | Slug: ${r.slug} | Status: ${r.status}`);
    console.log(`Title: ${r.title}`);
    console.log(`TargetStores: ${JSON.stringify(r.targetStoreSlugs)}`);
    console.log(`UpdatedAt: ${r.updatedAt}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
