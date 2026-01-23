import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  try {
    console.log('Fetching ALL stores via RAW SQL...');
    const stores = await prisma.$queryRawUnsafe(
      'SELECT id::text as id_str, name, slug FROM stores',
    );
    console.log('Stores found:', stores.length);
    stores.forEach((s, i) => {
      console.log(`[Store ${i}] ID: ${s.id_str}, Slug: ${s.slug}`);
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s.id_str)) {
        console.log('!!! ILLEGAL ID FOUND:', s.id_str);
      }
    });

    console.log('\nFetching ALL price_configs via RAW SQL...');
    const configs = await prisma.$queryRawUnsafe(
      'SELECT id::text as id_str, store_id::text as store_id_str FROM price_configs',
    );
    configs.forEach((c, i) => {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c.id_str)) {
        console.log('!!! ILLEGAL CONFIG ID:', c.id_str);
      }
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c.store_id_str)) {
        console.log('!!! ILLEGAL CONFIG STORE_ID:', c.store_id_str);
      }
    });
  } catch (err) {
    console.error('CRASH DURING RAW QUERY:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
