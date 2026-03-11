import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Client } = pg;

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to DB');

    // Check if column exists
    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='media_articles' AND column_name='category';
    `);

    if (res.rowCount === 0) {
      console.log('Adding category column...');
      await client.query(
        "ALTER TABLE media_articles ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'ikejo';",
      );
      console.log('Column added');
    } else {
      console.log('Column already exists');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
