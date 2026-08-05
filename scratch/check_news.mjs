import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const p = await prisma.pageRequest.findUnique({
    where: { id: 'ae3488b5-10bc-4f0b-990a-2c3965b1c933' }
  });
  console.log('Record 1 referenceUrls:', JSON.stringify(p.referenceUrls, null, 2));
}

main().finally(() => prisma.$disconnect());
