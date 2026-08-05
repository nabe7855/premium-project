import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const idObon = '2ead2c96-017e-4628-9aab-990a0c7e1839';
  const obon = await prisma.pageRequest.findUnique({ where: { id: idObon } });

  if (!obon) throw new Error('Obon page not found');

  const obonSections = JSON.parse(JSON.stringify(obon.sections));
  if (obonSections.length > 0 && obonSections[0].content) {
    // Clear content.title so old title '8月13日〜17日の営業について' is not rendered inside hero block
    obonSections[0].content.title = '';
  }

  const updated = await prisma.pageRequest.update({
    where: { id: idObon },
    data: {
      title: '【福岡店】お盆期間(8月13日〜17日)も通常営業｜ご予約はお早めに',
      sections: obonSections,
    },
  });

  console.log('✅ Successfully updated Obon page title and section content title!');
  console.log('Page Title:', updated.title);
  console.log('Section Content Title:', updated.sections[0]?.content?.title);
  console.log('Section Content Description:\n', updated.sections[0]?.content?.description);
}

main().finally(() => prisma.$disconnect());
