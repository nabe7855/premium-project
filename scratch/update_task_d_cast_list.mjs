import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateTaskDCastList() {
  console.log('=== UPDATING TASK D LINK TO OFFICIAL /store/fukuoka/cast-list ===\n');

  const article = await prisma.pageRequest.findUnique({
    where: { id: '3697fe49-978a-4646-99cd-d19e8ca6f009' }
  });

  if (!article) return;

  const sections = JSON.parse(JSON.stringify(article.sections || []));
  if (sections[0] && sections[0].content) {
    let desc = sections[0].content.description || '';
    desc = desc.replace('/store/fukuoka/cast', '/store/fukuoka/cast-list');
    sections[0].content.description = desc;
  }

  await prisma.pageRequest.update({
    where: { id: article.id },
    data: { sections }
  });

  console.log('✅ Updated internal link to official /store/fukuoka/cast-list in DB!');
}

updateTaskDCastList().catch(console.error);
