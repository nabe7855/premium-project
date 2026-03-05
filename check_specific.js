import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.lh_hotels.findMany({
    take: 1,
    orderBy: { created_at: 'desc' },
  });

  if (hotels.length === 0) return console.log('No hotels');
  const hotelId = hotels[0].id;
  console.log(`Checking hotel: ${hotels[0].name} (ID: ${hotelId})`);

  const amenities = await prisma.lh_hotel_amenities.findMany({
    where: { hotel_id: hotelId },
  });
  console.log(`Found ${amenities.length} linked amenities.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
