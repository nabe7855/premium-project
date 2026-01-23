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
    console.log('--- RAW DB SCAN START ---');

    // Scan all columns in public schema that might be UUIDs or IDs
    const query = `
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND (column_name LIKE '%id' OR data_type = 'uuid')
    `;
    const colsRes = await client.query(query);
    console.log(`Scanning ${colsRes.rows.length} columns...`);

    for (const row of colsRes.rows) {
      const { table_name, column_name } = row;
      try {
        // Search for strings containing any non-UUID character (not 0-9, a-f, -)
        // or specifically looking for 'n' which was in the error message
        const searchRes = await client.query(`
          SELECT "${column_name}"::text as val 
          FROM "${table_name}" 
          WHERE "${column_name}"::text !~* '^[0-9a-f-]*$'
          OR "${column_name}"::text LIKE '%n%'
          LIMIT 5
        `);

        if (searchRes.rows.length > 0) {
          console.log(`❌ POTENTIAL ISSUE in ${table_name}.${column_name}:`);
          searchRes.rows.forEach((r) => console.log(`   - Val: "${r.val}"`));
        }
      } catch (e) {
        // Skip tables we can't search easily
      }
    }

    console.log('--- RAW DB SCAN END ---');
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await client.end();
  }
}

run();
