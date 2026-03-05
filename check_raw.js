import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result =
    await prisma.$queryRaw`SELECT h.name, COUNT(ha.id) as count FROM lh_hotels h JOIN lh_hotel_amenities ha ON h.id = ha.hotel_id GROUP BY h.name HAVING COUNT(ha.id) > 0 LIMIT 10`;
  console.log('Hotels with amenities:', JSON.stringify(result, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
