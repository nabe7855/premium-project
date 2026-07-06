const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const articles = await prisma.mediaArticle.count();
    console.log('MediaArticle count:', articles);
    if (articles > 0) {
      const first = await prisma.mediaArticle.findFirst();
      console.log('First article title:', first.title);
    }
  } catch(e) {
    console.log('Error:', e.message);
  }
}
main().finally(() => prisma.$disconnect());
