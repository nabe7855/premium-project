import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Client } = pg;

// Use DATABASE_URL from .env
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

    // Add email column
    try {
      await client.query('ALTER TABLE casts ADD COLUMN email TEXT');
      console.log('Added email column.');
    } catch (e) {
      if (e.code === '42701') {
        console.log('email column already exists.');
      } else {
        throw e;
      }
    }

    // Add login_password column
    try {
      await client.query('ALTER TABLE casts ADD COLUMN login_password TEXT');
      console.log('Added login_password column.');
    } catch (e) {
      if (e.code === '42701') {
        console.log('login_password column already exists.');
      } else {
        throw e;
      }
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
