const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.lh_hotels.count({ where: { place_id: { not: null } } });
  console.log('Hotels with place_id:', count);
}

main().finally(() => prisma.$disconnect());
