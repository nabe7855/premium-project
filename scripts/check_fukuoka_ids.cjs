const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const cities = await prisma.lh_cities.findMany({
    where: { name: { contains: '福岡' } },
  });
  console.log('Fukuoka Cities:', JSON.stringify(cities, null, 2));

  if (cities.length > 0) {
    const areas = await prisma.lh_areas.findMany({
      where: { city_id: cities[0].id },
    });
    console.log('Areas in First City:', JSON.stringify(areas, null, 2));
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
