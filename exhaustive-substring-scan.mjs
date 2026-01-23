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
    console.log('--- GLOBAL SEARCH: "n" AT INDEX 1 ---');

    // Get all tables and columns
    const colsRes = await client.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
    `);

    for (const row of colsRes.rows) {
      const { table_name, column_name } = row;
      try {
        const query = `
          SELECT "${column_name}"::text as val 
          FROM "${table_name}" 
          WHERE SUBSTRING("${column_name}"::text, 2, 1) = 'n'
          AND "${column_name}"::text !~* '^[0-9a-f-]{36}$'
          LIMIT 5
        `;
        const res = await client.query(query);
        if (res.rows.length > 0) {
          console.log(`❌ MATCH in ${table_name}.${column_name}:`);
          res.rows.forEach((r) => console.log(`   - "${r.val}"`));
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
