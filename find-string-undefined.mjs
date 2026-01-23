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
    console.log('--- SCANNING FOR "undefined" STRING START ---');

    const colsRes = await client.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
    `);

    for (const row of colsRes.rows) {
      const { table_name, column_name } = row;
      try {
        const query = `
          SELECT * 
          FROM "${table_name}" 
          WHERE "${column_name}"::text = 'undefined'
          LIMIT 5
        `;
        const res = await client.query(query);
        if (res.rows.length > 0) {
          console.log(`❌ FOUND "undefined" in ${table_name}.${column_name}:`);
          console.log(JSON.stringify(res.rows, null, 2));
        }
      } catch (e) {
        // Skip
      }
    }

    console.log('--- SCAN COMPLETED ---');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
