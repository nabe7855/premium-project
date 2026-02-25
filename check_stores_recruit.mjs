import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const stores = await prisma.store.findMany({
    include: {
      recruit_pages: true,
    },
  });

  console.log('--- Stores and RecruitPages ---');
  stores.forEach((store) => {
    console.log(`Store: ${store.name} (slug: ${store.slug}, id: ${store.id})`);
    store.recruit_pages.forEach((page) => {
      console.log(`  - Section: ${page.section_key}`);
      if (page.section_key === 'hero') {
        console.log(`    Content: ${JSON.stringify(page.content, null, 2)}`);
      }
    });
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
