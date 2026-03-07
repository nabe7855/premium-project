const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hotel = await prisma.lh_hotels.findFirst({
    where: { place_id: '2206' }, // The example hotel we looked at
  });

  if (!hotel) {
    console.log('Hotel 2206 not found in DB. Make sure Phase 1 is done.');
    return;
  }

  // Use the scraper function (we can't easily import it without refactoring, so let's just run the actual script with a limit)
  console.log('Testing scraper on hotel 2206...');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
