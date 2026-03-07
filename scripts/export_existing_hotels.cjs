const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function main() {
  const prisma = new PrismaClient();
  try {
    const hotels = await prisma.lh_hotels.findMany({
      select: {
        name: true,
        address: true,
        phone: true,
      },
    });
    fs.writeFileSync('existing_hotels.json', JSON.stringify(hotels, null, 2));
    console.log(`Exported ${hotels.length} existing hotels.`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
