import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

const env = fs
  .readFileSync('.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const line_trimmed = line.trim();
    if (!line_trimmed || line_trimmed.startsWith('#')) return acc;
    const [key, ...val] = line_trimmed.split('=');
    if (key && val)
      acc[key.trim()] = val
        .join('=')
        .trim()
        .replace(/^["'](.*)["']$/, '$1');
    return acc;
  }, {});

const connectionString = env.DATABASE_URL;

async function run() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log('--- Checking RLS on roles table ---');

    // Check if RLS is enabled
    const rlsCheck = await client.query(`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace 
      WHERE relname = 'roles' AND nspname = 'public'
    `);
    console.log('RLS Status:', rlsCheck.rows);

    // Check policies
    const policies = await client.query(`
      SELECT * FROM pg_policies WHERE tablename = 'roles'
    `);
    console.log('Policies:', policies.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
