
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
 * Supabase Render API を使用して画像を動的に変換・最適化する
 * unoptimized: true を解除した際、Vercelの無料枠画像制限を回避しつつ高速化するために使用
 */
export function getTransformedImageUrl(
  path: string | null | undefined, 
  options: ImageTransformOptions & { slug?: string } = {}
): string | undefined {
  const publicUrl = getSupabasePublicUrl(path, options.slug);
  if (!publicUrl) return undefined;

  // SupabaseのストレージURLかつ画像である場合のみ変換処理を適用する
  const isSupabaseStorage = publicUrl.includes('/storage/v1/object/public/');
  if (!isSupabaseStorage) {
    return publicUrl;
  }

  // クエリパラメータの構築
  const params = new URLSearchParams();
  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  if (options.quality) {
    params.append('quality', options.quality.toString());
  } else if (options.width || options.height) {
    // リサイズ指定がある場合はデフォルト品質80を設定して圧縮
    params.append('quality', '80');
  }
  if (options.resize) params.append('resize', options.resize);

  // オプションが何も指定されていない場合はオリジナルのURLを返す
  const paramString = params.toString();
  if (!paramString) return publicUrl;

  // object/public/ を render/image/public/ に置換してパラメータを付与
  return publicUrl.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') + '?' + paramString;
}
