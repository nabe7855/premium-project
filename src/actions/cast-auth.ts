'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function updateCastAuth(castId: string, email: string, password?: string) {
  try {
    // 1. Get user_id from casts
    const { data: cast, error: fetchError } = await supabaseAdmin
      .from('casts')
      .select('user_id')
      .eq('id', castId)
      .single();

    if (fetchError || !cast) {
      throw new Error('キャストが見つかりません');
    }
    const userId = cast.user_id;

    // 2. Update public.casts
    const updateData: any = { email };
    if (password) updateData.login_password = password;

    const { error: castUpdateError } = await supabaseAdmin
      .from('casts')
      .update(updateData)
      .eq('id', castId);

    if (castUpdateError) throw castUpdateError;

    // 3. Update auth.users
    if (userId) {
      const authData: any = { email };
      if (password) authData.password = password;

      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        authData,
      );
      if (authUpdateError) throw authUpdateError;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to update cast auth:', error);
    return { success: false, error: error.message };
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
  try {
    // 1. Insert into casts
    const { data: castData, error: castInsertError } = await supabaseAdmin
      .from('casts')
      .insert({
        user_id: userId,
        name: name,
        slug: slug,
        is_active: true,
        email: email,
        login_password: password || null,
      })
      .select('id, slug')
      .single();

    if (castInsertError) throw castInsertError;
    const castId = castData.id;

    // 2. Insert into roles
    const { error: roleError } = await supabaseAdmin
      .from('roles')
      .insert({ user_id: userId, role: 'cast' });

    if (roleError) throw roleError;

    // 3. Insert into cast_store_memberships
    if (storeId) {
      const today = new Date().toISOString().split('T')[0];
      const { error: membershipError } = await supabaseAdmin.from('cast_store_memberships').insert({
        cast_id: castId,
        store_id: storeId,
        is_main: true,
        is_temporary: false,
        start_date: today,
        end_date: '9999-12-31',
      });
      if (membershipError) throw membershipError;
    }

    return { success: true, cast: castData };
  } catch (error: any) {
    console.error('Failed to create cast profile:', error);
    return { success: false, error: error.message };
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
    const { data: blogs } = await supabaseAdmin.from('blogs').select('id').eq('cast_id', castId);

    if (blogs && blogs.length > 0) {
      const blogIds = blogs.map((b: any) => b.id);
      await supabaseAdmin.from('blog_tags').delete().in('blog_id', blogIds);
      await supabaseAdmin.from('blog_images').delete().in('blog_id', blogIds);
      await supabaseAdmin.from('blogs').delete().eq('cast_id', castId);
    }

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
      await supabaseAdmin.from('roles').delete().eq('user_id', userId);
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (authDeleteError) {
        console.error('Auth user deletion failed:', authDeleteError);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete cast profile:', error);
    return { success: false, error: error.message };
  }
}
