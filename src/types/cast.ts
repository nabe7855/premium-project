// ギャラリー画像・動画
export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption?: string;
  videoUrl?: string | null;
  type?: 'image' | 'video';
}

// SNSリンク
export interface CastSNS {
  line?: string;
  twitter?: string;
  instagram?: string;
}

// 完全なキャスト情報（一覧・詳細用）
export interface Cast {
  id: string;              // uuid
  slug: string;
  name: string;
  age?: number;
  height?: number;
  weight?: number;
  catchCopy?: string;
  imageUrl?: string;
  galleryItems?: GalleryItem[];
  sns?: CastSNS;
  isNew?: boolean;
  sexinessLevel?: number;
  isReception?: boolean;
  stillwork?: boolean;
  is_active: boolean;
}

// キャスト一覧用の軽量データ
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

// 特徴マスタ（DB: feature_master）
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

// ✅ プロフィール編集用（Dashboard / ProfileEditor 用）
export interface CastProfile {
  id: string;
  name: string;
  age?: number;
  height?: number;
  profile?: string;
  imageUrl?: string;
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
}

// DBから直接取れるキャストデータ (Supabase/Strapiレスポンス用)
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
  is_active?: boolean; // ✅ ここを追加
}
