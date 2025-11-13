export interface StoreData {
  id: string;
  name: string;
  slug: string;          // ← DB の slug
  catch_copy?: string;   // ← DB と合わせる
  image_url?: string;    // ← 画像
  theme_color?: string;  // ← テーマカラー
  tags?: string[];       // ← Supabase の _text 型
  link: string;          // ← フロントで生成するURL
  gradient?: string;     // ← UI用に生成する値
}

