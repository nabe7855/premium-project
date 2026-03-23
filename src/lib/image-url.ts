
export function getSupabasePublicUrl(path: string | null | undefined, slug?: string): string | undefined {
  if (!path || path.trim() === '') return undefined;
  
  // プレースホルダーの置換 ({slug} 等)
  let processedPath = path;
  if (slug) {
    processedPath = processedPath.replace(/(?:\{slug\}|\[slug\]|%7Bslug%7D|%5Bslug%5D)/gi, slug);
  }

  if (processedPath.startsWith('http')) return processedPath;
  if (processedPath.startsWith('/')) return processedPath;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    if (typeof window !== 'undefined') {
      console.warn('⚠️ getSupabasePublicUrl: NEXT_PUBLIC_SUPABASE_URL is not defined!');
    }
    return processedPath;
  }

  const baseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
  
  // 先頭のスラッシュを削除
  const cleanPath = processedPath.startsWith('/') ? processedPath.slice(1) : processedPath;
  
  // 'gallery/' で始まっていない場合は補完する
  // (supabase の public URL は バケット名/パス の形式になるため)
  const finalPath = cleanPath.startsWith('gallery/') ? cleanPath : `gallery/${cleanPath}`;
  const finalUrl = `${baseUrl}/storage/v1/object/public/${finalPath}`;

  if (typeof window !== 'undefined') {
    // 開発環境に限らずログ出しして本番の原因究明を助ける
    console.log(`[ImageURL] Normalizing: "${path}" -> "${finalUrl}"`);
  }

  return finalUrl;
}

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'origin';
  resize?: 'cover' | 'contain' | 'fill';
}

/**
 * Supabase Image Transformations を適用したURLを取得
 * ※有料プランまたはセルフホスティングで有効な機能です
 */
export function getTransformedImageUrl(
  path: string | null | undefined, 
  options: ImageTransformOptions & { slug?: string } = {}
): string | undefined {
  const originalUrl = getSupabasePublicUrl(path, options.slug);
  if (!originalUrl) return undefined;
  if (!originalUrl.includes('/storage/v1/object/public/')) return originalUrl;

  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    resize = 'cover'
  } = options;

  // Supabase Transformation URL format:
  // storage/v1/render/image/public/[bucket]/[path]?width=...
  const transformUrl = originalUrl.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
  
  const params = new URLSearchParams();
  if (width) params.set('width', width.toString());
  if (height) params.set('height', height.toString());
  params.set('quality', quality.toString());
  if (format !== 'origin') params.set('format', format);
  params.set('resize', resize);

  const finalUrl = `${transformUrl}?${params.toString()}`;

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`[ImageTransform] ${width}x${height} (${format}): ${finalUrl}`);
  }

  return finalUrl;
}
