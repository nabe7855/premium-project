import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.lh_hotels.findMany({
    take: 10,
  });
  console.log(JSON.stringify(hotels, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
