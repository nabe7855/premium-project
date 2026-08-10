import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function cleanFireworksHeroTitle() {
  console.log('=== CLEANING HERO TITLE IN DB FOR FIREWORKS NEWS ===\n');

  const article = await prisma.pageRequest.findUnique({
    where: { id: '3697fe49-978a-4646-99cd-d19e8ca6f009' }
  });

  if (!article) return;

  const sections = JSON.parse(JSON.stringify(article.sections || []));
  if (sections[0] && sections[0].content) {
    // Set section title to exact page title or remove it to prevent duplicate H2
    delete sections[0].content.title;
  }

  await prisma.pageRequest.update({
    where: { id: article.id },
    data: { sections }
  });

  console.log('✅ Deleted section content.title in DB to remove duplicate H2!');
}

cleanFireworksHeroTitle().catch(console.error);
