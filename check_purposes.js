import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const purposes = await prisma.lh_purposes.findMany();
  console.log(JSON.stringify(purposes, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
