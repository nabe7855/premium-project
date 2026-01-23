import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Verifying stores via Prisma Client...');

  try {
    const stores = await prisma.store.findMany({
      orderBy: { name: 'asc' },
    });

    console.log(`\nFound ${stores.length} stores:`);
    stores.forEach((store) => {
      console.log(`- ${store.name} (ID: ${store.id}, Slug: ${store.slug})`);
    });

    if (stores.length === 0) {
      console.error('ERROR: No stores found!');
      process.exit(1);
    }

    // Verify detail fetching for the first store
    const firstStore = stores[0];
    console.log(`\nVerifying details for ${firstStore.name}...`);
    const fullStore = await prisma.store.findUnique({
      where: { id: firstStore.id },
      include: {
        price_config: true,
      },
    });

    if (fullStore) {
      console.log(`- Price Config: ${fullStore.price_config ? 'Found' : 'Missing'}`);
      if (fullStore.phone) console.log(`- Phone: ${fullStore.phone}`);
    } else {
      console.error('ERROR: Could not fetch store details');
    }
  } catch (error) {
    console.error('Verification Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
