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

    // Update casts.email from auth.users via user_id
    // Note: auth schema is usually restricted but the postgres user might have access.
    const query = `
      UPDATE public.casts
      SET email = u.email
      FROM auth.users u
      WHERE public.casts.user_id = u.id
      AND public.casts.email IS NULL
    `;

    const res = await client.query(query);
    console.log(`Backfilled ${res.rowCount} email(s) from auth.users.`);
  } catch (err) {
    console.error('Error executing query', err.message);
  } finally {
    await client.end();
  }
}

main();
