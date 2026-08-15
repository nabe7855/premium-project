const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ikeo = await prisma.mediaArticle.findFirst({
    where: { category: 'ikeo' }
  });
  console.log(ikeo ? ikeo.content.substring(0, 500) : "not found");
}
main().catch(console.error).finally(() => prisma.$disconnect());
