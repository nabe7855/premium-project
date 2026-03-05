import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.lh_hotels.findMany({
    where: { prefecture_id: 'kanagawa' },
    select: { name: true, website: true },
    take: 50,
  });
  console.log(JSON.stringify(hotels, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
