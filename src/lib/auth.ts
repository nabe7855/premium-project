import { supabase } from "./supabaseClient"

export async function signUpCast(
  name: string,
  email: string,
  password: string,
  storeId: string // ✅ サインアップ時に選ばれた店舗ID
) {
  // 1. Supabase Auth にユーザー作成
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.signUp({ email, password })

  if (authError) throw authError
  if (!user) throw new Error("ユーザー作成に失敗しました")

  // 2. casts にプロフィール作成
  const { data: castData, error: castError } = await supabase
    .from("casts")
    .insert({
      user_id: user.id,
      name: name,
      is_active: true,
    })
    .select("id") // ← cast.id を取得する
    .single()

  if (castError) throw castError

  const castId = castData.id

  // 3. roles にキャスト登録
  const { error: roleError } = await supabase.from("roles").insert({
    user_id: user.id,
    role: "cast",
  })
  if (roleError) throw roleError

// 4. 所属店舗を登録
const { error: membershipError } = await supabase
  .from("cast_store_memberships")
  .insert({
    cast_id: castId,
    store_id: storeId,
    is_main: true,
    is_temporary: false,
    start_date: new Date().toISOString().split("T")[0], // 今日
    end_date: "9999-12-31", // ← 無期限扱い
  });


  if (membershipError) throw membershipError

  return user
}
