import { prisma } from './src/lib/prisma.js';

async function test() {
  console.log('--- DIAGNOSTIC START ---');
  try {
    const storesRaw = await prisma.$queryRaw`SELECT id::text as id, name FROM stores LIMIT 1`;
    console.log('Raw result:', storesRaw);

    if (storesRaw.length > 0) {
      const id = storesRaw[0].id;
      console.log('Attempting findUnique for ID:', id);
      const fullStore = await prisma.store.findUnique({
        where: { id: id },
        include: { price_config: true },
      });
      console.log('FullStore result:', fullStore);
    } else {
      console.log('No stores found in DB.');
    }
  } catch (err) {
    console.error('DIAGNOSTIC ERROR:', err);
  } finally {
    await prisma.$disconnect();
    console.log('--- DIAGNOSTIC END ---');
  }
}

test();
