"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signUpCast } from "@/lib/auth"
import { supabase } from "@/lib/supabaseClient"

export default function CastSignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [storeId, setStoreId] = useState("") // ✅ 店舗選択
  const [stores, setStores] = useState<{ id: string; name: string }[]>([]) // ✅ 店舗リスト

  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  // 🔹 店舗一覧を取得
  useEffect(() => {
    const fetchStores = async () => {
      const { data, error } = await supabase.from("stores").select("id, name")
      if (error) {
        console.error("❌ 店舗一覧取得エラー:", error.message)
      } else {
        setStores(data)
      }
    }
    fetchStores()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (password.length < 6) {
      setErrorMessage("パスワードは6文字以上にしてください。")
      return
    }
    if (!storeId) {
      setErrorMessage("所属店舗を選択してください。")
      return
    }

    try {
      const user = await signUpCast(name, email, password, storeId) // ✅ storeId 追加
      console.log("キャスト登録完了:", user)

      setSuccessMessage("会員登録が完了しました 🎉 ログイン画面へ移動します...")

      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      console.error("登録エラー:", err)
      setErrorMessage(err.message || "登録に失敗しました。")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-white to-purple-200 px-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md flex flex-col gap-6 border border-pink-100"
      >
        <h2 className="text-xl sm:text-2xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          キャスト会員登録
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 text-center">
          特別な空間で、あなただけの魅力を輝かせましょう ✨
        </p>

        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 text-sm text-center">{successMessage}</p>}

        <div className="flex flex-col gap-4">
          <input type="text" placeholder="名前" value={name} onChange={e => setName(e.target.value)} required className="p-3 rounded-xl border focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all text-sm sm:text-base" />
          <input type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} required className="p-3 rounded-xl border focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all text-sm sm:text-base" />
          <input type="password" placeholder="パスワード（6文字以上）" value={password} onChange={e => setPassword(e.target.value)} required className="p-3 rounded-xl border focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all text-sm sm:text-base" />

          {/* ✅ 店舗選択セレクトボックス */}
          <select 
            value={storeId} 
            onChange={(e) => setStoreId(e.target.value)} 
            required
            className="p-3 rounded-xl border focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all text-sm sm:text-base"
          >
            <option value="">所属店舗を選択してください</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:opacity-90 transition-all text-sm sm:text-base">
          登録する
        </button>
        <p className="text-[10px] sm:text-xs text-center text-gray-500">
          登録することで利用規約に同意したものとみなされます
        </p>
      </form>
    </div>
  )
}
