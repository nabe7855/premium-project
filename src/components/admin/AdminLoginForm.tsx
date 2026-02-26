'use client';

import { getRoleFromServer } from '@/actions/auth-debug';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function AdminLoginForm() {
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
      console.log(`[AdminLoginForm] Attempting login for: ${email} at ${new Date().toISOString()}`);
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('[AdminLoginForm] Auth error:', authError);
        setError(`認証に失敗しました: ${authError.message}`);
        return;
      }

      console.log(
        `[AdminLoginForm] User authenticated: ${data.user?.id} at ${new Date().toISOString()}`,
      );

      if (!data.user) {
        setError('ユーザー情報を取得できませんでした。');
        return;
      }

      // Role check
      console.log('[AdminLoginForm] Starting role check...');
      let roleData: any = null;
      let roleError: any = null;

      try {
        // Create a timeout race for the client-side check
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('TIMEOUT')), 4000),
        );

        const clientRolePromise = supabase
          .from('roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        const result: any = await Promise.race([clientRolePromise, timeoutPromise]);
        roleData = result.data;
        roleError = result.error;
      } catch (err: any) {
        console.warn(`[AdminLoginForm] Client-side role check failed or timed out: ${err.message}`);
      }

      // Fallback to server-side if client-side didn't give us a clear answer
      if (roleError || !roleData) {
        console.log('[AdminLoginForm] Falling back to server-side role check...');
        const serverResult = await getRoleFromServer(data.user.id);
        if (serverResult.success) {
          roleData = { role: serverResult.role };
          roleError = null;
        }
      }

      console.log(`[AdminLoginForm] Role check final result at ${new Date().toISOString()}:`, {
        roleData,
        roleError,
      });

      if (roleError || !roleData) {
        console.error('[AdminLoginForm] Role fetch error:', roleError);
        setError('アクセス権限を確認できませんでした。');
        return;
      }

      if (roleData.role === 'admin') {
        console.log('[AdminLoginForm] Admin role confirmed, pushing to /admin/admin');
        router.push('/admin/admin');
      } else {
        console.warn(`[AdminLoginForm] User is not admin. Role: ${roleData.role}`);
        setError('管理者権限がありません。');
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('システムエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4 font-sans text-gray-100">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          {/* Header Accent */}
          <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" />

          <div className="p-8 sm:p-10">
            {/* Logo/Icon */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h1 className="mb-1 text-2xl font-bold tracking-tight text-white">OVERLORD ACCESS</h1>
              <p className="text-sm font-medium uppercase tracking-widest text-gray-400">
                管理者管理システム
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    管理者ID (メールアドレス)
                  </label>
                  <div className="group relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-cyan-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 transition-all focus:border-cyan-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                      placeholder="admin@example.com"
                      required
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    セキュリティトークン (パスワード)
                  </label>
                  <div className="group relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-cyan-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 transition-all focus:border-cyan-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                      placeholder="••••••••"
                      required
                      suppressHydrationWarning
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="animate-pulse rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-400">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-cyan-500/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    認証中...
                  </div>
                ) : (
                  'アクセス開始'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600">
                保護された暗号化接続 [ v2.4.0 ]
              </p>
            </div>
          </div>
        </div>

        {/* Decorative corner */}
        <div className="pointer-events-none absolute -right-1 -top-1 h-8 w-8 rounded-tr-xl border-r-2 border-t-2 border-cyan-500/50" />
        <div className="pointer-events-none absolute -bottom-1 -left-1 h-8 w-8 rounded-bl-xl border-b-2 border-l-2 border-cyan-500/50" />
      </div>
    </div>
  );
}
