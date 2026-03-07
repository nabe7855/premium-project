const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hotel = await prisma.lh_hotels.findFirst({
    where: {
      price_details: { not: [] },
    },
    select: { id: true, name: true, price_details: true, website: true },
  });
  console.log(JSON.stringify(hotel, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
