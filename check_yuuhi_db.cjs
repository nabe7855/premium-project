const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const article = await prisma.mediaArticle.findFirst({
    where: { slug: 'yuuhi-interview-vol3' },
    include: { interview_meta: true }
  });
  console.log(JSON.stringify(article.interview_meta.dialogue_data, null, 2));
}
main().finally(() => prisma.$disconnect());
