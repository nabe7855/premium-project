'use client'; // ← App Routerでは忘れずに！

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ 追加
import { useAuth } from '@/hooks/useAuth';
import { Heart, Lock, User } from 'lucide-react';

export default function LoginForm() {
  const [username, setUsername] = useState('ルカワ');
  const [password, setPassword] = useState('aaa');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter(); // ✅ 追加

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        router.push('/cast-dashboard'); // ✅ 成功したら遷移！
      } else {
        setError('ユーザー名とパスワードを入力してください');
      }
    } catch (err) {
      setError('ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-white to-rose-100 p-4">
      <div className="w-full max-w-md rounded-3xl border border-pink-200 bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 sm:h-16 sm:w-16">
            <Heart className="h-6 w-6 text-white sm:h-8 sm:w-8" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl">キャストマイページ</h1>
          <p className="text-sm text-gray-600 sm:text-base">Sweet Growth Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">
              セラピストネーム
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:h-5 sm:w-5" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-4 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-pink-500 sm:py-3 sm:pl-10 sm:text-base"
                placeholder="ユーザー名を入力"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:h-5 sm:w-5" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-4 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-pink-500 sm:py-3 sm:pl-10 sm:text-base"
                placeholder="パスワードを入力"
                required
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 text-sm font-medium text-white transition-all hover:from-pink-600 hover:to-rose-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 sm:text-base"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-500 sm:mt-6">
          どんなユーザー名・パスワードでもログインできます
        </div>
      </div>
    </div>
  );
}
