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
    console.log('--- Stores ---');
    const stores = await client.query(`SELECT id, slug, name FROM stores`);
    console.log(stores.rows);

    console.log('--- Recent Blogs with Store Info ---');
    const blogs = await client.query(`
      SELECT b.id, b.title, b.created_at, c.name as cast_name, s.slug as store_slug
      FROM blogs b
      JOIN casts c ON b.cast_id = c.id
      JOIN cast_store_memberships m ON c.id = m.cast_id
      JOIN stores s ON m.store_id = s.id
      ORDER BY b.created_at DESC
      LIMIT 5
    `);
    console.log(blogs.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
