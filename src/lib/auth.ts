import { createCastProfile } from '@/actions/cast-auth';
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

  // 3. サーバー側でRSLをバイパスしてロール等を一括登録
  const result = await createCastProfile(user.id, name, slug, email, password, storeId);

  if (!result.success) {
    throw new Error(result.error || 'プロフィールの作成に失敗しました');
  }

  return { user, cast: result.cast }; // ✅ slug も返せるようにした
}
