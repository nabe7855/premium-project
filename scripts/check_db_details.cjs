const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.lh_hotels.count();
  const withPlaceId = await prisma.lh_hotels.count({ where: { place_id: { not: null } } });
  const withWebsite = await prisma.lh_hotels.count({ where: { website: { not: null } } });
  const withPriceDetails = await prisma.lh_hotels.count({
    where: {
      price_details: {
        not: [],
      },
    },
  });

  console.log(`--- DB Current Status ---`);
  console.log(`Total hotels: ${total}`);
  console.log(`Hotels with place_id (Phase 1): ${withPlaceId}`);
  console.log(`Hotels with website (Phase 2): ${withWebsite}`);
  console.log(`Hotels with price_details (Phase 2): ${withPriceDetails}`);

  // Sample one that has details
  if (withWebsite > 0) {
    const sample = await prisma.lh_hotels.findFirst({
      where: { website: { not: null } },
      select: { name: true, website: true, price_details: true, room_count: true },
    });
    console.log(`\nSample Data:`, JSON.stringify(sample, null, 2));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
