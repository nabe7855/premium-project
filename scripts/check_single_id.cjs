const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const result = await prisma.lh_areas.findFirst({
    where: { id: 'Kokurakita-ku' },
  });
  console.log('Result:', JSON.stringify(result, null, 2));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
