import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const article = await prisma.pageRequest.findUnique({
    where: { id: '2ead2c96-017e-4628-9aab-990a0c7e1839' },
  });

  if (article) {
    console.log('=== FUKUOKA OBON ARTICLE FULL SECTIONS ===');
    console.log(JSON.stringify(article.sections, null, 2));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
