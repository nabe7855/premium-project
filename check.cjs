const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const store = await prisma.store.findUnique({ where: { slug: 'yokohama' } });
  if (!store) return console.log('Store not found');
  const config = await prisma.storeTopConfig.findUnique({ where: { store_id: store.id } });
  if (!config) return console.log('Config not found');
  console.log(JSON.stringify(config.config.concept, null, 2));
}
check().finally(() => prisma.$disconnect());
