const { Client } = require('pg');

const connectionString =
  'postgresql://postgres.vkrztvkpjcpejccyiviw:qH7fqFPYxhvw@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

async function run() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log('--- Scanning stores table with raw pg driver ---');
    const res = await client.query('SELECT id, name, slug FROM stores');
    console.log('Total stores found:', res.rows.length);

    const invalidStores = res.rows.filter((s) => {
      // UUID regex
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s.id);
      return !isUuid;
    });

    if (invalidStores.length > 0) {
      console.log('❌ Found invalid store IDs:');
      console.log(JSON.stringify(invalidStores, null, 2));
    } else {
      console.log('✅ All store IDs are valid UUIDs in raw pg query.');
      console.log('Full store list:');
      console.log(JSON.stringify(res.rows, null, 2));
    }
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await client.end();
  }
}

run();
