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

export interface CastSchedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'posted' | 'draft';
  createdAt: string;
}

export interface CastDiary {
  id: string;
  date: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  likes: number;
  createdAt: string;
}

export interface AuthUser {
  id: string;              // SupabaseのユーザーID
  email: string;           // Supabaseのメールアドレス
  isAuthenticated: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}