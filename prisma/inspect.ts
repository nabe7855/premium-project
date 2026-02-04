import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const slug = 'fukuoka';
  const store = await prisma.store.findUnique({ where: { slug } });
  if (!store) {
    console.log('Store not found');
    return;
  }
  const config = await prisma.storeTopConfig.findUnique({ where: { store_id: store.id } });
  if (config) {
    fs.writeFileSync('fukuoka_config.json', JSON.stringify(config.config, null, 2));
    console.log('Saved config to fukuoka_config.json');
  } else {
    console.log('No config found');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
