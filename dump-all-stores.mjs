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
    console.log('--- SCANNING FOR SUSPICIOUS STORES ---');
    const res = await client.query('SELECT id::text, name, slug FROM stores');

    res.rows.forEach((s) => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s.id);
      if (!isUuid || s.id.includes('n')) {
        console.log(`SUSPICIOUS: id="${s.id}", name="${s.name}", slug="${s.slug}"`);
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
