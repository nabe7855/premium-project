import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const hotel = await prisma.lh_hotels.findFirst({
    where: { address: { contains: '茅ヶ崎' } },
  });

  console.log(JSON.stringify(hotel, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
