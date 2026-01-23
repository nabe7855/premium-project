import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  try {
    console.log('--- Scanning stores table for invalid IDs ---');
    // We cast to text to prevent Prisma from trying to parse as UUID on the way back
    const stores = await prisma.$queryRaw`SELECT id::text as id_text, name, slug FROM stores`;
    console.log('Total stores found in raw query:', stores.length);

    const invalidStores = (stores || []).filter((s) => {
      // UUID regex
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        s.id_text,
      );
      return !isUuid;
    });

    if (invalidStores.length > 0) {
      console.log('❌ Found invalid store IDs:');
      console.log(JSON.stringify(invalidStores, null, 2));
    } else {
      console.log('✅ All store IDs are valid UUIDs in raw query.');
      console.log('Full store list for reference:');
      console.log(JSON.stringify(stores, null, 2));
    }
  } catch (error) {
    console.error('Fatal error in diagnostic:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
