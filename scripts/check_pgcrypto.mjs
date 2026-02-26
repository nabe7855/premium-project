import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to database.');

    const res = await client.query("SELECT extname FROM pg_extension WHERE extname = 'pgcrypto'");
    if (res.rowCount > 0) {
      console.log('pgcrypto extension is available.');
    } else {
      console.log('pgcrypto extension is NOT available.');
    }
  } catch (err) {
    console.error('Error executing query', err.message);
  } finally {
    await client.end();
  }
}

main();
