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
    const cast_id = '21e6000b-4d89-43e4-8fb5-ac9c583b1df6';
    console.log(`--- Checking Memberships for cast_id: ${cast_id} ---`);
    const memberships = await client.query(
      `
        SELECT m.*, s.slug 
        FROM cast_store_memberships m 
        JOIN stores s ON m.store_id = s.id 
        WHERE m.cast_id = $1
    `,
      [cast_id],
    );
    console.log('Memberships:', memberships.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
