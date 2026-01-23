const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    console.log('--- Scanning stores table for invalid IDs ---');
    const stores = await prisma.$queryRaw`SELECT id::text, name, slug FROM stores`;
    console.log('Total stores found in raw query:', stores.length);

    const invalidStores = stores.filter((s) => {
      // UUID regex
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s.id);
      return !isUuid;
    });

    if (invalidStores.length > 0) {
      console.log('❌ Found invalid store IDs:');
      console.log(JSON.stringify(invalidStores, null, 2));
    } else {
      console.log('✅ All store IDs are valid UUIDs in raw query.');
    }

    // Check related tables too
    const tables = ['courses', 'course_plans', 'transport_areas', 'price_options', 'campaigns'];
    for (const table of tables) {
      try {
        const badRecords = await prisma.$queryRawUnsafe(
          `SELECT * FROM ${table} WHERE price_config_id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' LIMIT 10`,
        );
        if (badRecords.length > 0) {
          console.log(`❌ Found invalid IDs in ${table}:`, badRecords.length);
        }
      } catch (e) {
        // Some tables might have different fk names
      }
    }
  } catch (error) {
    console.error('Fatal error in diagnostic:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
