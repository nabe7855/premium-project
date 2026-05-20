import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    const stores = await prisma.store.findMany();
    console.log(`Found ${stores.length} stores.`);
    
    for (const store of stores) {
      console.log(`Store: ${store.slug} (ID: ${store.id})`);
      
      const config = await prisma.storeTopConfig.findUnique({
        where: { store_id: store.id }
      });
      
      if (!config) {
        console.log('No store top config found.');
        continue;
      }
      
      const configData = config.config;
      console.log('Header Config logoUrl:', configData?.header?.logoUrl);
      console.log('Header Config navLinks:');
      if (configData?.header?.navLinks) {
        configData.header.navLinks.forEach((link, i) => {
          console.log(`  [${i}] ${link.name}: imageUrl = ${link.imageUrl}, href = ${link.href}`);
        });
      }
      console.log('---');
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
