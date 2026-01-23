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
    console.log('--- SCANNING EVERY FIELD IN stores ---');
    const res = await client.query('SELECT * FROM stores');

    res.rows.forEach((r) => {
      Object.keys(r).forEach((col) => {
        const val = String(r[col]);
        if (val.length > 1 && val[1].toLowerCase() === 'n') {
          console.log(
            `🎯 TARGET 'n' AT INDEX 1 in stores.${col}: "${val}" (Record Slug: ${r.slug})`,
          );
        }
      });
    });

    console.log('--- SCAN COMPLETED ---');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
