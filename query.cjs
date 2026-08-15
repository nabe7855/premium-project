const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const articles = await prisma.mediaArticle.findMany({});
  console.log(articles.map(a => a.slug + " | " + a.category + " | " + a.title).join('\n'));
}
run().catch(console.error).finally(() => prisma.$disconnect());
