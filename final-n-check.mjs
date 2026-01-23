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
    console.log('--- PRECISION SCAN: stores.id ---');
    const res = await client.query('SELECT id::text, name, slug FROM stores');

    res.rows.forEach((s) => {
      // Manual check for 'n' at index 1
      if (s.id.length > 1 && s.id[1] === 'n') {
        console.log(`❌ FOUND 'n' at index 1: id="${s.id}", name="${s.name}"`);
      }
      // Manual check for any non-hex at start
      if (!/^[0-9a-f]$/i.test(s.id[0])) {
        console.log(`❌ NON-HEX AT START: id="${s.id}" (Start: ${s.id[0]})`);
      }
      // Complete regex check
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s.id)) {
        console.log(`❌ INVALID FORMAT: id="${s.id}"`);
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
