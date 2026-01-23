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
    console.log('--- DEEP SCAN FOR "N" START ---');

    const tables = [
      'stores',
      'price_configs',
      'courses',
      'course_plans',
      'transport_areas',
      'price_options',
      'campaigns',
      'store_top_configs',
    ];

    for (const table of tables) {
      try {
        const colsQuery = `
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = '${table}' 
          AND (column_name LIKE '%id' OR data_type = 'uuid' OR column_name = 'id')
        `;
        const cols = await client.query(colsQuery);

        for (const col of cols.rows) {
          const c = col.column_name;
          const search = await client.query(`
            SELECT "${c}"::text as val, * 
            FROM "${table}" 
            WHERE "${c}"::text !~* '^[0-9a-f-]*$'
            OR "${c}"::text LIKE '%n%'
          `);

          if (search.rows.length > 0) {
            console.log(`❌ FOUND in ${table}.${c}:`);
            search.rows.forEach((r) => {
              console.log(`   - Val: "${r.val}" (Raw record: ${JSON.stringify(r)})`);
            });
          }
        }
      } catch (e) {
        console.log(`⚠️ Error scanning ${table}: ${e.message}`);
      }
    }

    console.log('--- DEEP SCAN END ---');
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await client.end();
  }
}

run();
