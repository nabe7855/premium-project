import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.lh_hotel_amenities.count();
  console.log(`Total lh_hotel_amenities: ${count}`);

  const sample = await prisma.lh_hotel_amenities.findMany({ take: 5 });
  console.log('Sample:', JSON.stringify(sample, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
