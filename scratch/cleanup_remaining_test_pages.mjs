import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.pageRequest.deleteMany({
    where: { title: { startsWith: '[TEST]' } },
  });

  console.log(`🗑️ Deleted ${result.count} leftover test articles from DB.`);

  const remaining = await prisma.pageRequest.count({
    where: { title: { startsWith: '[TEST]' } },
  });
  console.log(`Remaining test articles in DB: ${remaining}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
