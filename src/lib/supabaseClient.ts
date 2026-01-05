// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// .env.local の値を読み込む
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL is not defined. Using placeholder.');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. Using placeholder.');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Supabase クライアントを作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
