import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Checking RecruitPage entries ---');
  const pages = await prisma.recruitPage.findMany({
    include: {
      store: true,
    },
  });

  pages.forEach((page) => {
    console.log(`Store: ${page.store.slug}, Section: ${page.section_key}`);
    console.log('Content:', JSON.stringify(page.content, null, 2));
    console.log('---');
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
