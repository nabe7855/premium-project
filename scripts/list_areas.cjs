const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const areas = await prisma.lh_areas.findMany({
    select: { id: true, name: true, city_id: true },
  });
  fs.writeFileSync('areas_list.json', JSON.stringify(areas, null, 2), 'utf8');
  console.log('areas_list.json created.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
