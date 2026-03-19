
export function getSupabasePublicUrl(path: string | null | undefined): string | undefined {
  if (!path || path.trim() === '') return undefined;
  if (path.startsWith('http')) return path;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    if (typeof window !== 'undefined') {
      console.warn('⚠️ getSupabasePublicUrl: NEXT_PUBLIC_SUPABASE_URL is not defined!');
    }
    return path;
  }

  const baseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
  
  // 先頭のスラッシュを削除
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
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
