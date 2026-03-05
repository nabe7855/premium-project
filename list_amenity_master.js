import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const amenities = await prisma.lh_amenities.findMany({
    select: { id: true, name: true },
  });
  console.log(JSON.stringify(amenities, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
