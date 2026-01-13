export interface CastPerformance {
  イケメン度: number;
  ユーモア力: number;
  傾聴力: number;
  テクニック: number;
  癒し度: number;
  余韻力: number;
}

export interface CastLevel {
  level: number;
  maxLevel: number;
  rankName: string;
  description: string;
  experience: number;
  maxExperience: number;
}

export interface AuthUser {
  id: string; // SupabaseのユーザーID
  email: string; // Supabaseのメールアドレス
  isAuthenticated: boolean;
  role?: string; // ユーザーロール (admin, cast, etc.)
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export type ScheduleStatus = '予約可能' | '残りあとわずか' | '満員御礼' | '応相談';

// src/types/cast-dashboard.ts
export interface CastSchedule {
  id: string;
  cast_id: string;
  store_id: string;
  work_date: string; // YYYY-MM-DD
  start_datetime: string; // ISO形式
  end_datetime: string; // ISO形式
  status: ScheduleStatus;
}

export interface CastTweet {
  id: string;
  cast_id: string;
  content: string;
  created_at: string;
  expires_at: string;
}
