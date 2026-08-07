import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkOrder() {
  const rec = await prisma.pageRequest.findFirst({
    where: { slug: 'mousho-wari-2026' }
  });

  console.log('targetStoreSlugs order:', rec?.targetStoreSlugs);

  await prisma.$disconnect();
}

checkOrder();
