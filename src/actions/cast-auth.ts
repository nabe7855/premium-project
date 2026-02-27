'use server';

import pg from 'pg';

const { Pool } = pg;

// Use Pool for better management in Server Actions
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function updateCastAuth(castId: string, email: string, password?: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Get user_id from casts
    const castRes = await client.query('SELECT user_id FROM public.casts WHERE id = $1', [castId]);
    if (castRes.rowCount === 0) {
      throw new Error('キャストが見つかりません');
    }
    const userId = castRes.rows[0].user_id;

    // 2. Update public.casts (email and login_password for management view)
    if (password) {
      await client.query('UPDATE public.casts SET email = $1, login_password = $2 WHERE id = $3', [
        email,
        password,
        castId,
      ]);
    } else {
      await client.query('UPDATE public.casts SET email = $1 WHERE id = $2', [email, castId]);
    }

    // 3. Update auth.users (linked via user_id)
    if (userId) {
      if (password) {
        // Update both email and password in Auth
        // Note: We use crypt() for password hashing compatible with Supabase Auth
        await client.query(
          "UPDATE auth.users SET email = $1, encrypted_password = crypt($2, gen_salt('bf')) WHERE id = $3",
          [email, password, userId],
        );
      } else {
        // Update only email in Auth
        await client.query('UPDATE auth.users SET email = $1 WHERE id = $2', [email, userId]);
      }
    }

    await client.query('COMMIT');
    return { success: true };
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Failed to update cast auth:', error);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
}

export async function createCastProfile(
  userId: string,
  name: string,
  slug: string,
  email: string,
  password?: string,
  storeId?: string,
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert into casts
    const castInsertRes = await client.query(
      `INSERT INTO public.casts (user_id, name, slug, is_active, email, login_password)
       VALUES ($1, $2, $3, true, $4, $5)
       RETURNING id, slug`,
      [userId, name, slug, email, password || null],
    );

    const castData = castInsertRes.rows[0];
    const castId = castData.id;

    // 2. Insert into roles
    await client.query(`INSERT INTO public.roles (user_id, role) VALUES ($1, 'cast')`, [userId]);

    // 3. Insert into cast_store_memberships
    if (storeId) {
      const today = new Date().toISOString().split('T')[0];
      await client.query(
        `INSERT INTO public.cast_store_memberships (cast_id, store_id, is_main, is_temporary, start_date, end_date)
         VALUES ($1, $2, true, false, $3, '9999-12-31')`,
        [castId, storeId, today],
      );
    }

    await client.query('COMMIT');
    return { success: true, cast: castData };
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Failed to create cast profile:', error);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
}
