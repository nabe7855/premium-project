// src/types/cast.ts

// ギャラリー画像・動画
export interface GalleryItem {
  id: number;
  imageUrl: string;
  caption?: string;
  videoUrl?: string | null;
  type?: 'image' | 'video';
}

// SNSリンク
export interface CastSNS {
  line: string;
}

// 完全なキャスト情報
export interface Cast {
  id: number;
  slug: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  catchCopy?: string;
  imageUrl: string | null;
  galleryItems: GalleryItem[];
  sns: CastSNS;
  isNew: boolean;
  sexinessLevel: number;
  isReception?: boolean;
  stillwork: boolean;
}

// キャスト一覧用の軽量データ
export interface CastSummary {
  id: string;             // キャストのID
  name: string;           // キャストの名前
  age: number;            // 年齢
  height: number;         // 身長
  weight: number;         // 体重
  catchCopy?: string;     // キャッチコピー
  imageUrl?: string;      // 画像URL
  galleryItems?: GalleryItem[];
  isWorking: boolean;     // 出勤中かどうか
  schedule?: string[];
  stillwork?: boolean;
  diaryUrl?: string;
  snsUrl?: string;
  bloodType?: string;
  customID?: string;
  slug?: string;
}

// 特徴マスタ（CSVに対応）
export interface FeatureMaster {
  id: number;
  category: string;  // "MBTI" | "personality" | "face" | "appearance"
  label: string;
  name: string;
}

// キャストに紐づく特徴
export interface CastFeature {
  id: number;
  feature_master: FeatureMaster;
  value_text?: string;
  value_number?: number;
  value_boolean?: boolean;
}

// ✅ プロフィール編集用（Dashboard / ProfileEditor 用）
export interface CastProfile {
  id: string;
  name: string;
  age?: number;
  height?: number;
  mbti?: string;
  personality?: string[];  // 複数選択
  face?: string;           // 単一選択
  appearance?: string[];
  sexinessLevel?: number;
  bloodType?: string;
  profile?: string;
  imageUrl?: string;
  is_active: boolean;

  // 追加
  features?: string[]; // 特徴カテゴリー（複数選択）
  animal?: string;     // 動物占い（単一選択）

  // 施術内容の4段階
  services?: {
    [key: string]: "NG" | "要相談" | "普通" | "得意";
  };

  // ✅ SNS URL
  snsUrl?: string;

  // ✅ 質問一覧（キー: 質問文, 値: 回答）
  questions?: {
    [key: string]: string;
  };
}
