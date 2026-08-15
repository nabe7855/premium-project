import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function inspectExistingNewsStructure() {
  console.log('=== EXISTING PAGE_REQUESTS (fukuoka news) ===\n');

  const pages = await prisma.pageRequest.findMany({
    where: {
      targetStoreSlugs: { has: 'fukuoka' },
      status: 'published'
    },
    orderBy: { updatedAt: 'desc' },
    take: 5
  });

  for (const p of pages) {
    const misc = p.referenceUrls || {};
    console.log(`slug: ${p.slug}`);
    console.log(`  title: ${p.title}`);
    console.log(`  status: ${p.status}`);
    console.log(`  thumbnailUrl: ${p.thumbnailUrl}`);
    console.log(`  targetStoreSlugs: ${JSON.stringify(p.targetStoreSlugs)}`);
    console.log(`  referenceUrls: ${JSON.stringify(misc, null, 4)}`);
    const sections = p.sections || [];
    console.log(`  sections count: ${Array.isArray(sections) ? sections.length : 'N/A'}`);
    if (Array.isArray(sections) && sections.length > 0) {
      console.log(`  section[0]: ${JSON.stringify(sections[0]).substring(0, 200)}`);
    }
    console.log('');
  }
}

inspectExistingNewsStructure().catch(console.error).finally(() => prisma.$disconnect());
