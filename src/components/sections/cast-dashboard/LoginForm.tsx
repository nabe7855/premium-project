'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Heart, Lock, Mail } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Supabaseでログイン
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('メールアドレスまたはパスワードが正しくありません');
        return;
      }

      if (!data.user) {
        setError('ユーザー情報が取得できませんでした');
        return;
      }

      // ここでロールチェック（rolesテーブルに cast ロールがあるかどうか）
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (roleError || !roleData) {
        setError('ロール情報を取得できませんでした');
        return;
      }

      if (roleData.role === 'cast') {
        router.push('/cast/cast-dashboard');
      } else {
        setError('キャストアカウントではありません');
      }
    } catch (err) {
      setError('ログイン処理中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-white to-rose-100 p-4">
      <div className="w-full max-w-md rounded-3xl border border-pink-200 bg-white p-6 shadow-2xl sm:p-8">
        {/* ヘッダー */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 sm:h-16 sm:w-16">
            <Heart className="h-6 w-6 text-white sm:h-8 sm:w-8" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl">
            キャストマイページ
          </h1>
          <p className="text-sm text-gray-600 sm:text-base">
            Sweet Growth Dashboard
          </p>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* メール */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              メールアドレス
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:h-5 sm:w-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off" // SSR差分を防ぐ
                className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-4 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-pink-500 sm:py-3 sm:pl-10 sm:text-base"
                placeholder="メールアドレスを入力"
                required
              />
            </div>
          </div>

          {/* パスワード */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              パスワード
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:h-5 sm:w-5" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off" // SSR差分を防ぐ
                className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-4 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-pink-500 sm:py-3 sm:pl-10 sm:text-base"
                placeholder="パスワードを入力"
                required
              />
            </div>
          </div>

          {/* エラーメッセージ */}
          <div className="min-h-[2rem]">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 text-sm font-medium text-white transition-all hover:from-pink-600 hover:to-rose-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 sm:text-base"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  );
}
