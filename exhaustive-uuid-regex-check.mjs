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
    console.log('--- GLOBAL REGEX ID SCAN START ---');

    const tables = [
      'stores',
      'price_configs',
      'courses',
      'course_plans',
      'transport_areas',
      'price_options',
      'campaigns',
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
          `);

          search.rows.forEach((r) => {
            const val = r.val;
            if (val && !/^[0-9a-f-]*$/i.test(val)) {
              console.log(`❌ NON-HEX CHAR in ${table}.${c}: "${val}"`);
            }
            if (val && val.length > 1 && val[1].toLowerCase() === 'n') {
              console.log(`🎯 TARGET 'n' AT INDEX 1 in ${table}.${c}: "${val}"`);
            }
          });
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
