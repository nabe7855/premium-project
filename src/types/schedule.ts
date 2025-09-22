// =========================
// 1. DBレスポンス用の型
// =========================
export interface CastRow {
  id: string;
  name: string;
  age: number | null;
  catch_copy: string | null;
  main_image_url: string | null;
  voice_url: string | null;
  slug: string | null;
}

export interface ScheduleRow {
  id: string;
  cast_id: string;
  store_id: string;
  work_date: string;               // YYYY-MM-DD
  start_datetime: string | null;   // e.g. 2025-09-22T15:00:00Z
  end_datetime: string | null;     // e.g. 2025-09-22T23:00:00Z
  casts: CastRow | null;           // Supabase join で取得
}

// =========================
// 2. UI用の整形後の型
// =========================
export interface StatusMaster {
  id: string;               // status_master.id
  name: string;             // 表示名（例: "新人", "店長おすすめ"）
  label_color?: string|null; // バッジ背景色
  text_color?: string|null;  // バッジ文字色
  created_at?: string;
}


export interface CastStatus {
  id: string;                // cast_statuses.id
  castId: string;           // 紐づく cast_id
  statusId: string;          // 紐づく status_master.id
  label: string;             // 表示用ラベル（status_master.name）
  labelColor?: string | null;  // 背景色（status_master.label_color）
  textColor?: string | null;   // 文字色（status_master.text_color）
}

export interface Cast {
  id: string;
  slug?: string;
  name: string;
  photo: string;
  workingHours: string;
  age: number;
  description: string;

  // ステータス系（予約枠の状態）
  status: 'available' | 'limited' | 'full';
  isFavorite: boolean;
  isRecentlyViewed: boolean;

  // バッジ系（cast_statuses から取得）
  statuses: CastStatus[];


  // 分類
  category: string;

storeSlug: string;
}

export interface ScheduleDay {
  date: string;         // 2025-09-22
  dayOfWeek: string;    // 月, 火, ...
  casts: Cast[];
  recommendedCasts: Cast[];
}


// =========================
// 3. 補助型
// =========================
export interface FilterOptions {
  favoritesOnly: boolean;
  recentlyViewedFirst: boolean;
  availableOnly: boolean;
}

export interface QuickInfo {
  todayAvailable: number;
  tomorrowRecommended: number;
  availableNow: number;
}



// types/schedule.ts
export interface Schedule {
  work_date: string;          // YYYY-MM-DD
  start_datetime: string | null;
  end_datetime: string | null;
}