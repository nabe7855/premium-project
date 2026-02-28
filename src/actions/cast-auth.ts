'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
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

export async function deleteCastProfile(castId: string) {
  try {
    // 1. Get user_id from casts before deletion
    const { data: cast, error: fetchError } = await supabaseAdmin
      .from('casts')
      .select('user_id')
      .eq('id', castId)
      .single();

    if (fetchError) throw new Error('キャストの取得に失敗しました');
    const userId = cast?.user_id;

    // 2. Delete related data in public schema
    // Note: If foreign keys are set to ON DELETE CASCADE, some of these might be redundant,
    // but we'll do it manually to be sure as per user request.

    // Get blog ids to delete related tags/images
    const { data: blogs } = await supabaseAdmin.from('blogs').select('id').eq('cast_id', castId);

    if (blogs && blogs.length > 0) {
      const blogIds = blogs.map((b) => b.id);
      await supabaseAdmin.from('blog_tags').delete().in('blog_id', blogIds);
      await supabaseAdmin.from('blog_images').delete().in('blog_id', blogIds);
      await supabaseAdmin.from('blogs').delete().eq('cast_id', castId);
    }

    // Delete other related records
    await supabaseAdmin.from('cast_features').delete().eq('cast_id', castId);
    await supabaseAdmin.from('cast_questions').delete().eq('cast_id', castId);
    await supabaseAdmin.from('cast_statuses').delete().eq('cast_id', castId);
    await supabaseAdmin.from('cast_store_memberships').delete().eq('cast_id', castId);
    await supabaseAdmin.from('reviews').delete().eq('cast_id', castId);
    await supabaseAdmin.from('gallery_items').delete().eq('cast_id', castId);

    // 3. Delete cast profile itself
    const { error: castDeleteError } = await supabaseAdmin.from('casts').delete().eq('id', castId);

    if (castDeleteError) throw castDeleteError;

    // 4. Delete from auth.users and roles if userId exists
    if (userId) {
      // Delete role
      await supabaseAdmin.from('roles').delete().eq('user_id', userId);

      // Delete user from auth
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (authDeleteError) {
        console.error('Auth user deletion failed:', authDeleteError);
        // We don't necessarily throw here if the DB records are already gone
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete cast profile:', error);
    return { success: false, error: error.message };
  }
}
