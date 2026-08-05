import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.pageRequest.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  console.log('--- Top 12 pages in DB ---');
  pages.slice(0, 12).forEach((p, i) => {
    const ref = p.referenceUrls || {};
    const storeSettings = ref.storeSettings;
    const fukuokaStatus = storeSettings?.fukuoka?.status;

    console.log(`[${i}] ID: ${p.id}`);
    console.log(`    Slug: ${p.slug}`);
    console.log(`    Title: "${p.title}"`);
    console.log(`    Status: global=${p.status} | fukuoka=${fukuokaStatus}`);
    console.log(`    TargetStores: ${JSON.stringify(p.targetStoreSlugs)}`);
    console.log(`    UpdatedAt: ${p.updatedAt}`);
    if (Array.isArray(p.sections) && p.sections.length > 0) {
      const sec0 = p.sections[0];
      console.log(`    Section[0] type: ${sec0.type}`);
      console.log(`    Section[0] content title: "${sec0.content?.title || ''}"`);
      console.log(`    Section[0] content desc snippet: "${(sec0.content?.description || '').slice(0, 100).replace(/\n/g, ' ')}"`);
    }
    console.log('--------------------------------------------------');
  });
}

main().finally(() => prisma.$disconnect());
