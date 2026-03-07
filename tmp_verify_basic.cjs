const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hotel = await prisma.lh_hotels.findFirst({
    where: { place_id: { not: null }, website: { not: null } },
  });
  console.log(JSON.stringify(hotel, null, 2));
}

main().finally(() => prisma.$disconnect());
