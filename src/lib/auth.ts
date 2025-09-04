import { supabase } from "./supabaseClient"

export async function signUpCast(name: string, email: string, password: string) {
  // 1. Supabase Auth にユーザー作成
  const { data: { user }, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  if (!user) throw new Error("ユーザー作成に失敗しました")

  // 2. casts にプロフィール作成
  const { error: castError } = await supabase.from("casts").insert({
    user_id: user.id,
    name: name,
    is_active: true
  })
  if (castError) throw castError

  // 3. roles にキャスト登録
  const { error: roleError } = await supabase.from("roles").insert({
    user_id: user.id,
    role: "cast"
  })
  if (roleError) throw roleError

  return user
}
