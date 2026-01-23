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
    console.log('--- EXHAUSTIVE SCAN START ---');

    console.log('--- 1. Checking STORES table ---');
    const res = await client.query('SELECT id::text, name, slug FROM stores');
    res.rows.forEach((s) => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s.id);
      if (!isUuid) {
        console.log(`❌ INVALID STORE ID: "${s.id}" (Name: ${s.name}, Slug: ${s.slug})`);
      } else {
        console.log(`✅ OK: ${s.id} (${s.slug})`);
      }
    });

    console.log('\n--- 2. Checking relation tables for bad foreign keys ---');
    const relationChecks = [
      { table: 'price_configs', col: 'store_id' },
      { table: 'courses', col: 'price_config_id' },
      { table: 'course_plans', col: 'course_id' },
      { table: 'transport_areas', col: 'price_config_id' },
      { table: 'price_options', col: 'price_config_id' },
      { table: 'campaigns', col: 'price_config_id' },
    ];

    for (const check of relationChecks) {
      try {
        const r = await client.query(`SELECT "${check.col}"::text as val FROM "${check.table}"`);
        let badCount = 0;
        r.rows.forEach((row) => {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            row.val,
          );
          if (!isUuid && row.val !== null) {
            console.log(`❌ INVALID FK in ${check.table}.${check.col}: "${row.val}"`);
            badCount++;
          }
        });
        if (badCount === 0) console.log(`✅ ${check.table}.${check.col} is clean.`);
      } catch (e) {
        console.log(`⚠️ Could not check ${check.table}.${check.col}: ${e.message}`);
      }
    }

    console.log('\n--- EXHAUSTIVE SCAN END ---');
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await client.end();
  }
}

run();
