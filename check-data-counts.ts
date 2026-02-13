import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hotelCount = await prisma.lh_hotels.count();
  const reviewCount = await prisma.lh_reviews.count();
  console.log('Hotel Count:', hotelCount);
  console.log('Review Count:', reviewCount);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
