"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AuthUser } from "@/types/cast-dashboard";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 初期化（現在ログイン中のユーザーをチェック）
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser({
          id: user.id,
          email: user.email!,
          isAuthenticated: true,
        });
      }
      setLoading(false);
    };

    getUser();

    // 🔹 ログイン/ログアウトイベントを監視
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            isAuthenticated: true,
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔹 ログイン処理（Supabase Auth）
  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("ログインエラー:", error.message);
      return false;
    }

    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email!,
        isAuthenticated: true,
      });
      return true;
    }

    return false;
  };

  // 🔹 ログアウト処理
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
  };
}
