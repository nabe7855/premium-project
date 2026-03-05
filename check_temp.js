import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.lh_hotels.findMany({
    select: {
      id: true,
      name: true,
      website: true,
      _count: {
        select: {
          amenities: true,
          services: true,
          purposes: true,
        },
      },
    },
    take: 10,
    orderBy: { created_at: 'desc' },
  });

  console.log(JSON.stringify(hotels, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
