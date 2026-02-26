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
    console.log('--- DB Investigation ---');

    // 1. Check existing roles
    const roles = await client.query('SELECT * FROM public.roles');
    console.log('Current roles:', roles.rows);

    // 2. Check auth.users (if possible)
    try {
      const users = await client.query('SELECT id, email FROM auth.users');
      console.log('Auth users:', users.rows);
    } catch (e) {
      console.warn('Could not read auth.users:', e.message);
    }

    // 3. Fix: Insert admin role for strawberryadmin@gmail.com
    // Use the ID from the screenshot: f4299d71-2b76-4817-aa9a-58f86892f491
    const targetUserId = 'f4299d71-2b76-4817-aa9a-58f86892f491';

    console.log(`Inserting admin role for ${targetUserId}...`);
    await client.query(
      'INSERT INTO public.roles (user_id, role) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET role = $2',
      [targetUserId, 'admin'],
    );
    console.log('✅ Admin role inserted.');

    const finalRoles = await client.query('SELECT * FROM public.roles');
    console.log('Final roles:', finalRoles.rows);
  } catch (err) {
    console.error('Error during DB fix:', err);
  } finally {
    await client.end();
  }
}

run();
