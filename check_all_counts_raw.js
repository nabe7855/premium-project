import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`
    SELECT h.name, COUNT(ha.hotel_id) as amenity_count 
    FROM lh_hotels h 
    LEFT JOIN lh_hotel_amenities ha ON h.id = ha.hotel_id 
    GROUP BY h.id, h.name 
    ORDER BY amenity_count DESC 
    LIMIT 20
  `;

  const serialized = JSON.stringify(
    result,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value),
    2,
  );
  console.log('Hotels with amenity counts:', serialized);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
