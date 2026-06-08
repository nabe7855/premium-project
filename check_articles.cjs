const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.mediaArticle.findMany({
    select: {
      id: true,
      slug: true,
      title: true
    }
  });
  console.log("Articles:", articles);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
