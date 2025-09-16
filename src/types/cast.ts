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
  label_en?: string; // 内部用ラベル
  created_at?: string;
}

// キャストに紐づく状態（DB: cast_statuses）
export interface CastStatus {
  id: string;
  cast_id: string;
  status_id: string;
  status_master?: Status;
  created_at?: string;
}

// ==============================
// 完全なキャスト情報（一覧・詳細用）
// ==============================
export interface Cast {
  id: string;              // uuid
  slug: string;
  name: string;

  age?: number;
  height?: number;
  weight?: number;

  catchCopy?: string;        // DB: catch_copy
  profile?: string | null;          // DB: profile
  managerComment?: string | null;   // DB: manager_comment

  imageUrl?: string | null;         // DB: image_url
  mainImageUrl?: string | null;     // DB: main_image_url
  galleryItems?: GalleryItem[];     // DB: gallery_items

  sns?: CastSNS;                    // SNSリンク

  isNew?: boolean;                  // UI専用
  sexinessLevel?: number;           // UI専用
  isReception?: boolean;            // UI専用
  stillwork?: boolean;              // UI専用（在籍フラグ）

  isActive: boolean;                // DB: is_active
  voiceUrl?: string | null;         // DB: voice_url

  statuses?: Status[];              // 複数の状態タグ（リレーション）

  // 外部キー
  mbtiId?: string | null;           // DB: mbti_id
  animalId?: string | null;         // DB: animal_id
  faceId?: string | null;           // DB: face_id
  userId?: string | null;           // DB: user_id

  createdAt?: string;               // DB: created_at
}


// ==============================
// キャスト一覧用の軽量データ
// ==============================
export interface CastSummary {
  id: string;
  name: string;
  age?: number;
  height?: number;
  weight?: number;
  catchCopy?: string;
  imageUrl?: string;
  galleryItems?: GalleryItem[];
  isWorking?: boolean;
  schedule?: string[];
  stillwork?: boolean;
  diaryUrl?: string;
  snsUrl?: string;
  bloodType?: string;
  customID?: string;
  slug?: string;
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
  | 'service';   // ✅ サービスを追加

export interface FeatureMaster {
  id: string;                  // uuid
  category: FeatureCategory;
  name: string;                // 表示名
  label_en?: string;
  created_at?: string;
}

// キャストに紐づく特徴（DB: cast_features）
export interface CastFeature {
  id: string;
  cast_id: string;
  feature_id: string;
  feature_master?: FeatureMaster;
  created_at?: string;
  level?: 'NG' | '要相談' | '普通' | '得意'; // ✅ サービス用に追加
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

  // 単一選択（castsテーブルに外部キー）
  mbtiId?: string;     // feature_master.id (category='MBTI')
  animalId?: string;   // feature_master.id (category='animal')
  faceId?: string;     // feature_master.id (category='face')

  // 複数選択（cast_featuresテーブル経由）
  personalityIds: string[]; // feature_master.id[] (category='personality')
  appearanceIds: string[];  // feature_master.id[] (category='appearance')

  // 任意属性
  sexinessLevel?: number;
  bloodType?: string;

  // 施術内容の4段階（UI用）
  services?: {
    [key: string]: 'NG' | '要相談' | '普通' | '得意';
  };

  // SNS
  snsUrl?: string;

  // 質問一覧
  questions?: {
    [key: string]: string;
  };

  // ✅ 状態タグ
  statuses?: Status[];
}

// ==============================
// DBから直接取れるキャストデータ (Supabase/Strapiレスポンス用)
// ==============================
export interface StrapiCastItem {
  id: string | number;
  slug: string;
  name: string;
  age?: number;
  height?: number;
  weight?: number;
  catchCopy?: string;
  imageUrl?: string;
  isNew?: boolean;
  sexinessLevel?: number;
  isReception?: boolean;
  stillwork?: boolean;
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