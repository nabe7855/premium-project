import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Searching RecruitPage for suspicious strings ---');

  const suspiciousStrings = ['福岡店募集バナー', '福岡店夜景', '募集バナー', '夜景'];

  const pages = await prisma.recruitPage.findMany({
    include: { store: true },
  });

  for (const page of pages) {
    const contentStr = JSON.stringify(page.content);

    suspiciousStrings.forEach((s) => {
      if (contentStr.includes(s)) {
        console.log(`[FOUND] "${s}" in Store: ${page.store.slug}, Section: ${page.section_key}`);
        console.log(
          `Full Content Part: ${contentStr.substring(contentStr.indexOf(s) - 20, contentStr.indexOf(s) + 50)}`,
        );
      }
    });
  }

  console.log('--- Search Done ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
