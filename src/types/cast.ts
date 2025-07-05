// cast.ts

export interface GalleryItem {
  id: number;
  imageUrl: string;
  caption?: string;
  videoUrl?: string | null;
  type?: 'image' | 'video';
}

export interface CastSNS {
  line: string;
}

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

export interface CastSummary {
  id: string; // 必須: キャストのID
  name: string; // 必須: キャストの名前
  age: number; // 必須: キャストの年齢
  height: number; // 必須: キャストの身長
  weight: number; // 必須: キャストの体重
  catchCopy?: string; // 任意: キャッチコピー（あれば設定）
  imageUrl?: string; // 任意: 画像URL（あれば設定）
  galleryItems?: GalleryItem[]; // 任意: ギャラリーアイテム（あれば設定）
  isWorking: boolean; // 必須: 出勤中かどうか
  schedule?: string[]; // 任意: スケジュール（あれば設定）
  stillwork?: boolean; // 任意: まだ働いているかどうか（あれば設定）
  diaryUrl?: string; // 任意: 写メ日記のURL（あれば設定）
  snsUrl?: string; // 任意: SNSのURL（あれば設定）
  bloodType?: string; // 任意: 血液型（あれば設定）
  customID?: string; // 任意: カスタムID（あれば設定）
  slug?: string; // 任意: スラッグ（あれば設定）
}

export interface FeatureMaster {
  id: number;
  category: string; // 例: "MBTI", "personality", "appearance"
  label: string;
  name: string;
}

export interface CastFeature {
  id: number;
  feature_master: FeatureMaster;
  value_text?: string;
  value_number?: number;
  value_boolean?: boolean;
}
