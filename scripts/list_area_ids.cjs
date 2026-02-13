const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function list() {
  const areas = await prisma.lh_areas.findMany({
    select: { id: true, name: true, city_id: true },
  });
  console.log(JSON.stringify(areas, null, 2));
}

list().finally(() => prisma.$disconnect());
