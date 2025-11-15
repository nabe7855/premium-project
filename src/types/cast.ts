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
// 店舗
// ==============================
export interface Store {
  id: string;
  name: string;
  slug?: string;
}

// ==============================
// キャスト状態マスタ（DB: status_master）
// ==============================
export interface Status {
  id: string;             // uuid
  name: string;           // 表示名（例: 新人, 店長おすすめ）
  label_color?: string | null; // バッジ背景色
  text_color?: string | null;  // バッジ文字色
  created_at?: string;
}

// ==============================
// キャストに紐づく状態（DB: cast_statuses）
// ==============================
export interface CastStatus {
  id: string;             // uuid
  cast_id: string;        // 紐づくキャストID
  status_id: string;      // 紐づくステータスID
  isActive: boolean;     // ON/OFF フラグ
  created_at?: string;

  // 🔽 リレーションでJOINして取得する
  status_master?: Status | null;
}

// ==============================
// 完全なキャスト情報（一覧・詳細用）
// ==============================
export type ServiceLevel = 'NG' | '要相談' | '普通' | '得意';

export type SortOption = 'default' | 'reviewCount' | 'newcomerOnly' | 'todayAvailable'


export interface Cast {
  id: string;              // uuid
  slug: string;
  customID?: string;       // カスタムID
  storeSlug?: string;      // 店舗slug
  name: string;
  bloodType?: string;

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
  sexinessStrawberry?: string; // 🍓表現
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

  // タグや特徴（UI用）
  tags?: string[];
  mbtiType?: string;        // MBTI名
  animalName?: string;      // 動物占い名
  faceType?: string[];      // 顔型名リスト

  // ✅ 特徴IDリスト
  personalityIds?: string[];
  appearanceIds?: string[];

  // ✅ 特徴名リスト（UI用に追加）
  personalityNames?: string[];
  appearanceNames?: string[];

  // 詳細プロフィール
  profileDetail?: {
    introduction: string;
    experience: string;
    specialties: string[];
    hobbies: string[];
  };

  // サービススキル
  services?: { name: string; level: ServiceLevel }[];

  // スケジュール/出勤
  availability?: { [key: string]: string[] };

  // レーダーチャート用
  radarData?: Array<{
    label: string;
    value: number;
    emoji: string;
  }>;

  createdAt?: string;

  // ✅ 店舗が管理するおすすめ順フラグ
  priority?: number;

  // ✅ 新人フラグ（status_master の「新人」で判定）
  isNewcomer?: boolean;

  // ✅ 所属店舗（JOIN用）
  stores?: Store[];

  // 🆕 最新のつぶやき（24h以内の最新1件）
  latestTweet?: string | null;

  // 🆕 Q&A一覧
  castQuestions?: CastQuestion[];
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
  isActive: boolean;

  mbtiId?: string;
  animalId?: string;
  faceId?: string;

  personalityIds: string[];
  appearanceIds: string[];

  sexinessLevel?: number;
  bloodType?: string;
  catchCopy?: string;

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


// ==============================
// ユーザー表示用キャスト情報
// ==============================
export interface CastProfilePublic extends CastProfileBase {
  slug: string; // 👈 追加（必須）
  age?: number;
  height?: number;
  profile?: string;
  voiceUrl?: string | null; // 👈 null許容に修正
  mbtiId?: string;
  animalId?: string;
  faceId?: string;
  personalityIds: string[];
  appearanceIds: string[];
  sexinessLevel?: number;
  bloodType?: string;
  services?: Record<string, 'NG' | '要相談' | '普通' | '得意'>;
  statuses?: CastStatus[];
  catchCopy?: string;        // 👈 追加
  personalities?: FeatureTag[]; // 👈 FeatureTag 型で明示
  appearances?: FeatureTag[];   // 👈 FeatureTag 型で明示
}

// ==============================
// 管理画面専用キャスト情報
// ==============================
export interface CastProfileAdmin extends CastProfilePublic {
  managerComment?: string;  // 管理者コメント（非公開）
  storeMemberships?: { storeId: string; role: string }[]; // 所属店舗・役割
  approvalStatus?: 'pending' | 'approved' | 'rejected';   // 承認フラグ
}

// ==============================
// 共通ベース型
// ==============================
export interface CastProfileBase {
  id: string;
  name: string;
  imageUrl?: string;
  isActive: boolean;
}

// =======================
// 共通のタグ型
// =======================
export interface FeatureTag {
  id: string;
  name: string;
}

export interface CastSchedule {
  id: string;
  castId: string;
  start: string; // ISO文字列
  end: string;   // ISO文字列
}

