import pkg from 'pg';
const { Client } = pkg;

const connectionString =
  'postgresql://postgres.vkrztvkpjcpejccyiviw:qH7fqFPYxhvw@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

async function run() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log('--- PRECISION SCAN: price_configs ---');
    const res = await client.query('SELECT id::text, store_id::text FROM price_configs');

    res.rows.forEach((r) => {
      const isIdUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(r.id);
      const isStoreIdUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        r.store_id,
      );

      if (!isIdUuid) console.log(`❌ INVALID id: "${r.id}"`);
      if (!isStoreIdUuid) console.log(`❌ INVALID store_id: "${r.store_id}"`);
      if (r.id.includes('n') || r.store_id.includes('n')) {
        // Check index 1 specifically
        if (r.id[1] === 'n' || r.store_id[1] === 'n') {
          console.log(`❌ FOUND 'n' at index 1: id="${r.id}", store_id="${r.store_id}"`);
        }
      }
    });

    console.log('--- SCAN END ---');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
