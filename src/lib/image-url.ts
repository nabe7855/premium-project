
export function getSupabasePublicUrl(path: string | null | undefined, slug?: string): string | undefined {
  if (!path || path.trim() === '') return undefined;
  
  // プレースホルダーの置換 ({slug} 等)
  let processedPath = path;
  if (slug) {
    processedPath = processedPath.replace(/(?:\{slug\}|\[slug\]|%7Bslug%7D|%5Bslug%5D)/gi, slug);
  }

  if (processedPath.startsWith('http')) {
    return processedPath;
  }

  // ローカル静的資産（スラッシュ開始）はそのまま返す
  if (processedPath.startsWith('/')) {
    return processedPath;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return processedPath;
  }

  const baseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
  
  // 先頭のスラッシュを削除
  const cleanPath = processedPath.startsWith('/') ? processedPath.slice(1) : processedPath;
  
  // バケット名が含まれていない場合は 'gallery/' とみなす（歴史的経緯）
  const finalPath = cleanPath.includes('/') ? cleanPath : `gallery/${cleanPath}`;
  
  return `${baseUrl}/storage/v1/object/public/${finalPath}`;
}

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'origin';
  resize?: 'cover' | 'contain' | 'fill';
}

/**
 * 将来的な最適化のためのプレースホルダー
 * 現状は表示の安定性を優先し、加工せずそのまま公開URLを返す
 */
export function getTransformedImageUrl(
  path: string | null | undefined, 
  options: ImageTransformOptions & { slug?: string } = {}
): string | undefined {
  return getSupabasePublicUrl(path, options.slug);
}
