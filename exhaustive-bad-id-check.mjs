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
    console.log('--- GLOBAL UUID INTEGRITY CHECK ---');

    const tablesRes = await client.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND (column_name LIKE '%id' OR data_type = 'uuid' OR column_name = 'id')
    `);

    for (const row of tablesRes.rows) {
      const { table_name, column_name } = row;
      try {
        const query = `
          SELECT "${column_name}"::text as val 
          FROM "${table_name}"
        `;
        const res = await client.query(query);
        let count = 0;
        res.rows.forEach((r) => {
          if (
            r.val &&
            r.val !== '' &&
            !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(r.val)
          ) {
            console.log(`❌ INVALID UUID in ${table_name}.${column_name}: "${r.val}"`);
            count++;
          }
        });
        if (count > 0) console.log(`   Found ${count} bad records in ${table_name}.${column_name}`);
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
