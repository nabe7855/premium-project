import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function setFireworksSeoTitle() {
  console.log('=== SETTING SEO TITLE FOR FIREWORKS NEWS ===\n');

  const article = await prisma.pageRequest.findUnique({
    where: { id: '3697fe49-978a-4646-99cd-d19e8ca6f009' }
  });

  if (!article) {
    console.error('Article not found!');
    return;
  }

  const referenceUrls = article.referenceUrls || {};
  referenceUrls.seoTitle = '【福岡店】関門海峡花火大会(8/13)デート特典｜全コース30分無料延長・各日先着5名';

  await prisma.pageRequest.update({
    where: { id: article.id },
    data: { referenceUrls }
  });

  console.log('✅ seoTitle set successfully in referenceUrls!');
}

setFireworksSeoTitle().catch(console.error);
