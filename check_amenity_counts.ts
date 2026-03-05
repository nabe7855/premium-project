import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hotelCount = await prisma.lh_hotels.count();
  const amenityCount = await prisma.lh_amenities.count();
  const serviceCount = await prisma.lh_services.count();
  const hotelAmenityCount: any = await prisma.$queryRaw`SELECT count(*) FROM lh_hotel_amenities`;
  const hotelServiceCount: any = await prisma.$queryRaw`SELECT count(*) FROM lh_hotel_services`;

  console.log('--- Database Stats ---');
  console.log('Total Hotels:', hotelCount);
  console.log('Master Amenities:', amenityCount);
  console.log('Master Services:', serviceCount);
  console.log('Hotel-Amenity Links:', hotelAmenityCount[0].count);
  console.log('Hotel-Service Links:', hotelServiceCount[0].count);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
