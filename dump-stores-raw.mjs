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
    const res = await client.query('SELECT * FROM stores');
    res.rows.forEach((r) => {
      console.log(`STORE_RECORD: ${JSON.stringify(r)}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
