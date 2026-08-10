import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function inspectExistingInterviews() {
  console.log('=== INSPECTING EXISTING INTERVIEW ARTICLES VIA PRISMA ===\n');

  const articles = await prisma.article.findMany({
    where: { category: 'interview' },
    include: { interview_meta: true }
  });

  articles.forEach(a => {
    console.log(`Slug: ${a.slug}`);
    console.log(`Title: ${a.title}`);
    console.log(`Status: ${a.status}`);
    console.log('---');
  });
}

inspectExistingInterviews().catch(console.error);
