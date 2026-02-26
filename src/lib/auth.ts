import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';

// slug 自動生成関数
function generateSlug(name: string): string {
  const random = uuidv4().slice(0, 6); // UUIDの一部で一意性確保
  return (
    name
      .normalize('NFKD') // 全角文字を分解
      .replace(/[^\w]/g, '') // 英数字以外削除
      .toLowerCase() +
    '-' +
    random
  );
}

export async function signUpCast(name: string, email: string, password: string, storeId: string) {
  // 1. Supabase Auth にユーザー作成
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.signUp({ email, password });

  if (authError) throw authError;
  if (!user) throw new Error('ユーザー作成に失敗しました');

  // 2. slug を生成
  const slug = generateSlug(name);

  // 3. casts にプロフィール作成
  const { data: castData, error: castError } = await supabase
    .from('casts')
    .insert({
      user_id: user.id,
      name: name,
      slug: slug, // ✅ ここで自動生成された slug を保存
      is_active: true,
      email: email,
      login_password: password,
    })
    .select('id, slug') // cast.id と slug を取得
    .single();

  if (castError) throw castError;

  const castId = castData.id;

  // 4. roles にキャスト登録
  const { error: roleError } = await supabase.from('roles').insert({
    user_id: user.id,
    role: 'cast',
  });
  if (roleError) throw roleError;

  // 5. 所属店舗を登録
  const { error: membershipError } = await supabase.from('cast_store_memberships').insert({
    cast_id: castId,
    store_id: storeId,
    is_main: true,
    is_temporary: false,
    start_date: new Date().toISOString().split('T')[0], // 今日
    end_date: '9999-12-31', // ← 無期限扱い
  });

  if (membershipError) throw membershipError;

  return { user, cast: castData }; // ✅ slug も返せるようにした
}
