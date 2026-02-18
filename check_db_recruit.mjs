import { prisma } from './src/lib/prisma.js';

async function check() {
  const pages = await prisma.recruitPage.findMany({
    include: {
      store: true,
    },
  });

  console.log('--- RecruitPage Data ---');
  pages.forEach((p) => {
    console.log(`Store: ${p.store.slug} (${p.store.name})`);
    console.log(`Section: ${p.section_key}`);
    console.log(`Content: ${JSON.stringify(p.content, null, 2)}`);
    console.log('------------------------');
  });
}

check().catch(console.error);
