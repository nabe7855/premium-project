import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function executeTaskAandE() {
  console.log('=== EXECUTING TASK A & E (FIX WEDNESDAY TO THURSDAY & UPDATE ALT) ===\n');

  const article = await prisma.pageRequest.findUnique({
    where: { id: '3697fe49-978a-4646-99cd-d19e8ca6f009' }
  });

  if (!article) {
    console.error('Article not found!');
    return;
  }

  const sections = JSON.parse(JSON.stringify(article.sections || []));
  if (sections[0] && sections[0].content) {
    // 1. Fix Description: 8月13日(水) -> 8月13日(木)
    sections[0].content.description = sections[0].content.description.replace('8月13日(水)', '8月13日(木)');

    // 2. Fix Alt
    sections[0].content.alt = '関門海峡花火大会の夜空に打ち上がる花火';
  }

  await prisma.pageRequest.update({
    where: { id: article.id },
    data: { sections }
  });

  console.log('✅ Task A & E applied successfully in DB!');
}

executeTaskAandE().catch(console.error);
