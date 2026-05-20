import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- ALL METAS IDS ---');
  const metas = await prisma.interviewMeta.findMany({
    select: {
      id: true,
      article_id: true,
      area: true
    }
  });
  console.log(JSON.stringify(metas, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
