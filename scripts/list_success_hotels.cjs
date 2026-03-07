const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.lh_hotels.findMany({
    where: {
      price_details: { not: [] },
      website: { not: null },
    },
    select: { name: true, address: true },
    take: 5,
  });

  console.log('Hotels with full data (Phase 2 completed):');
  hotels.forEach((h, i) => {
    console.log(`${i + 1}. ${h.name} (${h.address})`);
  });
}

main().finally(() => prisma.$disconnect());
