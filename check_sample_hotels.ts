import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sampleHotels: any = await prisma.$queryRaw`
    SELECT h.name, 
           array_agg(DISTINCT a.name) as amenities,
           array_agg(DISTINCT s.name) as services
    FROM lh_hotels h
    LEFT JOIN lh_hotel_amenities ha ON h.id = ha.hotel_id
    LEFT JOIN lh_amenities a ON ha.amenity_id = a.id
    LEFT JOIN lh_hotel_services hs ON h.id = hs.hotel_id
    LEFT JOIN lh_services s ON hs.service_id = s.id
    WHERE ha.amenity_id IS NOT NULL OR hs.service_id IS NOT NULL
    GROUP BY h.id, h.name
    LIMIT 3
  `;

  console.log('--- Sample Hotel Data ---');
  sampleHotels.forEach((hotel) => {
    console.log(`Hotel: ${hotel.name}`);
    console.log(`  Amenities: ${hotel.amenities.join(', ') || 'None'}`);
    console.log(`  Services: ${hotel.services.join(', ') || 'None'}`);
    console.log('---');
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
