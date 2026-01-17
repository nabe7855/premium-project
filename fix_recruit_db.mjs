import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Fixing RecruitPage Image Paths ---');

  // 修正対象のキーワード
  const targets = [
    { old: '/福岡店募集バナー.png', new: '/福岡募集バナー.png' },
    { old: '/福岡店夜景.png', new: '/福岡夜景.png' },
    { old: '福岡店募集バナー.png', new: '福岡募集バナー.png' },
    { old: '福岡店夜景.png', new: '福岡夜景.png' },
  ];

  const pages = await prisma.recruitPage.findMany();

  for (const page of pages) {
    let contentStr = JSON.stringify(page.content);
    let updated = false;

    for (const target of targets) {
      if (contentStr.includes(target.old)) {
        console.log(
          `Found "${target.old}" in Store ID: ${page.store_id}, Section: ${page.section_key}`,
        );
        contentStr = contentStr.split(target.old).join(target.new);
        updated = true;
      }
    }

    if (updated) {
      await prisma.recruitPage.update({
        where: { id: page.id },
        data: {
          content: JSON.parse(contentStr),
        },
      });
      console.log(`Updated Store ID: ${page.store_id}, Section: ${page.section_key}`);
    }
  }

  console.log('--- Done ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
