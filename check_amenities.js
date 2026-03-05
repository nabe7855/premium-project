import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const amenities = await prisma.lh_amenities.findMany({
    take: 50,
    orderBy: { name: 'asc' },
  });

  console.log(JSON.stringify(amenities, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
