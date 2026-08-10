import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function inspectTop5News() {
  console.log('=== TOP 5 MOST RECENT PAGE_REQUESTS ===\n');

  const records = await prisma.pageRequest.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5
  });

  records.forEach((r, idx) => {
    console.log(`[${idx + 1}] ID: ${r.id}`);
    console.log(`     Title: "${r.title}"`);
    console.log(`     Global Status: "${r.status}"`);
    console.log(`     Target Store Slugs:`, r.targetStoreSlugs);
    console.log(`     Updated At:`, r.updatedAt.toISOString());
    console.log(`     Reference URLs (Misc):`, JSON.stringify(r.referenceUrls, null, 2));
    console.log('----------------------------------------------------------------\n');
  });
}

inspectTop5News().catch(console.error);
