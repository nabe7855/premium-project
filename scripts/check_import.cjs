const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const count = await prisma.lh_hotels.count();
  const withPrices = await prisma.lh_hotels.count({
    where: { min_price_rest: { not: null } },
  });
  const firstWithPrice = await prisma.lh_hotels.findFirst({
    where: { min_price_rest: { not: null } },
    select: { name: true, min_price_rest: true, min_price_stay: true },
  });

  console.log(`Total hotels: ${count}`);
  console.log(`Hotels with prices: ${withPrices}`);
  if (firstWithPrice) {
    console.log(
      `Sample: ${firstWithPrice.name} (Rest: ${firstWithPrice.min_price_rest}, Stay: ${firstWithPrice.min_price_stay})`,
    );
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
