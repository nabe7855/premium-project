import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const total = await prisma.lh_hotels.count();
  const withAi = await prisma.lh_hotels.count({ where: { ai_description: { not: null } } });
  const withPrice = await prisma.lh_hotels.count({
    where: { OR: [{ min_price_rest: { not: null } }, { min_price_stay: { not: null } }] },
  });
  const withWebsite = await prisma.lh_hotels.count({ where: { website: { not: null } } });
  console.log('--- PROGRESS REPORT ---');
  console.log('TOTAL_HOTELS:', total);
  console.log('WITH_AI_DESC:', withAi);
  console.log('WITH_PRICE:', withPrice);
  console.log('WITH_WEBSITE:', withWebsite);
  console.log('------------------------');
}
main().finally(() => prisma.$disconnect());
