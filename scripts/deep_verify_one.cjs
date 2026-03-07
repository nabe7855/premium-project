const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hotel = await prisma.lh_hotels.findFirst({
    where: { website: { not: null } },
  });

  if (!hotel) {
    console.log('No hotel with website found.');
    return;
  }

  console.log(`Hotel: ${hotel.name}`);
  console.log(`Website: ${hotel.website}`);
  console.log(`min_price_rest (general): ${hotel.min_price_rest}`);
  console.log(`rest_price_min_weekday (dashboard column): ${hotel.rest_price_min_weekday}`);
  console.log(
    `Price Details: ${Array.isArray(hotel.price_details) ? hotel.price_details.length : 0} items`,
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
