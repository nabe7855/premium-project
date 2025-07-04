export interface GalleryItem {
  id: number;
  imageUrl: string;
  caption?: string;
  videoUrl?: string | null; // ✅ 追加
  type?: 'image' | 'video'; // ✅ 画像 or 動画判別用
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
  id: number;
  slug?: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  bloodType?: string;
  catchCopy?: string;
  imageUrl?: string;
  diaryUrl?: string;
  snsUrl?: string;
  isReception?: boolean;
  stillwork?: boolean;
  customID?: string;

  // ✅ 追加
  galleryItems?: GalleryItem[];
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
