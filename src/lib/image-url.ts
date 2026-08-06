
export interface SupabaseUrlOptions {
  slug?: string;
  raw?: boolean;
  width?: number;
  quality?: number;
}

export function getSupabasePublicUrl(
  path: string | null | undefined, 
  options?: SupabaseUrlOptions | string
): string | undefined {
  if (!path || path.trim() === '') return undefined;

  const opts: SupabaseUrlOptions = typeof options === 'string' ? { slug: options } : (options || {});
  
  // プレースホルダーの置換 ({slug} 等)
  let processedPath = path;
  if (opts.slug) {
    processedPath = processedPath.replace(/(?:\{slug\}|\[slug\]|%7Bslug%7D|%5Bslug%5D)/gi, opts.slug);
  }

  let publicUrl = processedPath;
  if (!processedPath.startsWith('http') && !processedPath.startsWith('/')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) return processedPath;
    const baseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
    const cleanPath = processedPath.startsWith('/') ? processedPath.slice(1) : processedPath;
    const finalPath = cleanPath.includes('/') ? cleanPath : `gallery/${cleanPath}`;
    publicUrl = `${baseUrl}/storage/v1/object/public/${finalPath}`;
  }

  // raw: true の場合は変換せず原寸 URL をそのまま返す (OGP・管理画面用)
  if (opts.raw) {
    return publicUrl;
  }

  // Supabase Storage URL の場合は動的最適化を自動適用 (デフォルト width: 800)
  if (publicUrl.includes('/storage/v1/object/public/')) {
    const width = opts.width || 800;
    const quality = opts.quality || 75;
    const params = new URLSearchParams();
    params.append('width', width.toString());
    params.append('quality', quality.toString());
    params.append('resize', 'contain');
    params.append('format', 'webp');

    return publicUrl.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') + '?' + params.toString();
  }

  return publicUrl;
}

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'origin';
  resize?: 'cover' | 'contain' | 'fill';
}

/**
 * Supabase Render API を使用して画像を動的に変換・最適化する
 * format=webp をデフォルトで付与し、Acceptヘッダー非送信のボットにも常時WebPを配信する
 */
export function getTransformedImageUrl(
  path: string | null | undefined, 
  options: ImageTransformOptions & { slug?: string } = {}
): string | undefined {
  const publicUrl = getSupabasePublicUrl(path, options.slug);
  if (!publicUrl) return undefined;

  // SupabaseのストレージURLかつ /storage/v1/object/public/ 形式の場合のみ変換処理を適用する
  const isSupabaseStorage = publicUrl.includes('/storage/v1/object/public/');
  if (!isSupabaseStorage) {
    return publicUrl;
  }

  // クエリパラメータの構築
  const params = new URLSearchParams();
  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  
  // 品質指定 (デフォルト75)
  const quality = options.quality || 75;
  params.append('quality', quality.toString());
  
  // リサイズ指定 (アスペクト比維持のためデフォルト contain)
  const resize = options.resize || 'contain';
  params.append('resize', resize);

  // フォーマット指定 (デフォルトで明示的に webp を付与しクローラーにもWebPを保証)
  const format = options.format || 'webp';
  if (format !== 'origin') {
    params.append('format', format);
  }

  const paramString = params.toString();

  // object/public/ を render/image/public/ に置換してパラメータを付与
  return publicUrl.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') + '?' + paramString;
}

export type ImagePreset = 'hero' | 'banner' | 'content' | 'thumb' | 'icon';

export const IMAGE_PRESETS = {
  hero: { width: 800, quality: 75 },     // メインビジュアル、FVヒーロー (LCP最優先)
  banner: { width: 800, quality: 75 },   // バナー、ニュース画像
  content: { width: 800, quality: 75 },  // 本文挿入画像、詳細画像
  thumb: { width: 400, quality: 75 },    // キャストサムネイル、日記カード
  icon: { width: 300, quality: 75 },     // アイコン、小サムネイル
} as const;

/**
 * プリセットを指定して画像を最適化するラッパー関数
 */
export function getOptimizedImageUrl(
  path: string | null | undefined,
  preset: ImagePreset,
  slug?: string
): string | undefined {
  const config = IMAGE_PRESETS[preset];
  return getTransformedImageUrl(path, { width: config.width, quality: config.quality, slug }) || (path || undefined);
}

