// ✅ Cloudinaryなど画像の詳細情報（今回は未使用なら削除してもOK）
export interface CastImageFormat {
  ext: string;
  url: string;
  mime: string;
  name: string;
  width: number;
  height: number;
  size: number;
  sizeInBytes?: number;
  path?: string | null;
}

// ✅ ギャラリー画像 or 動画1件分の型
export interface GalleryItem {
  id: number;
  imageUrl?: string;
  videoUrl?: string | null;
  type?: string;
  caption?: string | null;
}

// ✅ SNSリンク型（LINE以外も今後追加しやすい構造）
export interface CastSNS {
  line?: string;
  twitter?: string;
  instagram?: string;
}

// ✅ キャスト本体型（APIレスポンスに合わせて記述）
export interface Cast {
  id: number;
  customID: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  catchCopy?: string;
  imageUrl: string | null; // ← ❗ no-image対応済なら string でOK
  galleryItems: GalleryItem[]; // ← JSON上の GalleryItem[] に一致
  sns?: CastSNS;
  isNew?: boolean;
  sexinessLevel?: number;
}
