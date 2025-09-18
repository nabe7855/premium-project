// ==============================
// ギャラリー画像・動画
// ==============================
export interface GalleryItem {
  id: string;
  castId: string;
  imageUrl: string;
  caption?: string;
  isMain: boolean;
  type?: 'image' | 'video';
  videoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==============================
// SNSリンク
// ==============================
export interface CastSNS {
  line?: string;
  twitter?: string;
  instagram?: string;
}

// ==============================
// キャスト状態マスタ（DB: status_master）
// ==============================
export interface Status {
  id: string;        // uuid
  name: string;      // 表示名（例: 新人, 店長おすすめ）
  label_color?: string;  // ✅ 追加
  text_color?: string;   // ✅ 追加
  created_at?: string;
}

// キャストに紐づく状態（DB: cast_statuses）
export interface CastStatus {
  id: string;
  cast_id: string;
  status_id: string;
  is_active: boolean;       // ✅ ON/OFF フラグ
  status_master: Status;    // ✅ 必須に変更
  created_at?: string;
}

// ==============================
// 完全なキャスト情報（一覧・詳細用）
// ==============================
export interface Cast {
  id: string;              // uuid
  slug: string;
  customID?: string;        // カスタムID
  storeSlug?: string;       // 店舗slug
  name: string;

  age?: number;
  height?: number;

  // プロフィール系
  catchCopy?: string;
  catchphrase?: string;
  profile?: string | null;
  managerComment?: string | null;
  story?: string;

  // 画像
  imageUrl?: string | null;
  mainImageUrl?: string | null;
  avatar?: string;
  images?: string[];
  galleryItems?: GalleryItem[];

  // SNS
  sns?: CastSNS;
  snsLink?: string;

  // ステータス系
  sexinessLevel?: number;
  sexinessStrawberry?: string; // 🍓表現を追加
  isReception?: boolean;
  isActive: boolean;
  isOnline?: boolean;
  statuses?: CastStatus[];
  voiceUrl?: string; 

  // UI用数値系
  rating?: number;
  reviewCount?: number;
  bookingCount?: number;
  responseRate?: number;
  responseTime?: string;

  // 外部キー
  mbtiId?: string | null;
  animalId?: string | null;
  faceId?: string | null;
  userId?: string | null;

  // タグや特徴
  tags?: string[];
  mbtiType?: string;
  faceType?: string[];

  // 追加データ
  profileDetail?: {
    introduction: string;
    experience: string;
    specialties: string[];
    hobbies: string[];
  };

  services?: { name: string; price: number }[];

  // スケジュール/出勤
  availability?: { [key: string]: string[] };

  // レーダーチャート用
  radarData?: Array<{
    label: string;
    value: number;
    emoji: string;
  }>;

  createdAt?: string;
}

// ==============================
// 診断検索用の拡張型
// ==============================
export type ScoredCast = Cast & {
  compatibilityScore: number;
};

// ==============================
// キャスト一覧用の軽量データ
// ==============================
export interface CastSummary {
  id: string;
  name: string;
  age?: number;
  height?: number;
  catchCopy?: string;
  imageUrl?: string;
  galleryItems?: GalleryItem[];
  isWorking?: boolean;
  isActive?: boolean;
  schedule?: string[];
  diaryUrl?: string;
  snsUrl?: string;
  bloodType?: string;
  customID?: string;
  slug?: string;
  voiceUrl?: string;
}

// ==============================
// 特徴マスタ（DB: feature_master）
// ==============================
export type FeatureCategory =
  | 'MBTI'
  | 'animal'
  | 'face'
  | 'personality'
  | 'appearance'
  | 'service';

export interface FeatureMaster {
  id: string;
  category: FeatureCategory;
  name: string;
  created_at?: string;
}

export interface CastFeature {
  id: string;
  cast_id: string;
  feature_id: string;
  feature_master?: FeatureMaster;
  created_at?: string;
  level?: 'NG' | '要相談' | '普通' | '得意';
}

// ==============================
// プロフィール編集用（Dashboard / ProfileEditor 用）
// ==============================
export interface CastProfile {
  id: string;
  name: string;
  age?: number;
  height?: number;
  profile?: string;
  imageUrl?: string;
  voiceUrl?: string | null;
  is_active: boolean;

  mbtiId?: string;
  animalId?: string;
  faceId?: string;

  personalityIds: string[];
  appearanceIds: string[];

  sexinessLevel?: number;
  bloodType?: string;

  services?: {
    [key: string]: 'NG' | '要相談' | '普通' | '得意';
  };

  snsUrl?: string;

  questions?: {
    [key: string]: string;
  };

  statuses?: CastStatus[];
}

// ==============================
// DBから直接取れるキャストデータ
// ==============================
export interface StrapiCastItem {
  id: string | number;
  slug: string;
  name: string;
  age?: number;
  height?: number;
  catchCopy?: string;
  imageUrl?: string;
  sexinessLevel?: number;
  isReception?: boolean;
  is_active?: boolean;
}

// ==============================
// 質問関連
// ==============================
export interface QuestionMaster {
  id: string;
  text: string;
  category?: string;
  is_active: boolean;
  created_at?: string;
}

export interface CastQuestion {
  id: string;
  cast_id: string;
  question_id: string;
  answer: string;
  question?: QuestionMaster;
  created_at?: string;
  updated_at?: string;
}

// ==============================
// 写メ日記
// ==============================
export interface CastDiary {
  id: string;
  castId: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  createdAt: string;
}

// ==============================
// 今日の出勤キャスト
// ==============================
export interface TodayCast {
  id: string;
  name: string;
  age?: number;
  catch_copy?: string;
  main_image_url?: string;
  image_url?: string;
  mbti_name?: string;
  face_name?: string;
  start_datetime?: string;
  end_datetime?: string;
}

// ==============================
// 動画
// ==============================
export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  viewCount: string;
  uploadDate: string;
  platform: 'youtube' | 'instagram' | 'tiktok';
  url: string;
  isNew?: boolean;
  isPopular?: boolean;
}

// ==============================
// レビュー
// ==============================
export interface Review {
  id: string;
  castId: string;
  rating: number;
  comment: string;
  date: string;
  author: string;
  tags: string[];
}
