
export function getSupabasePublicUrl(path: string | null | undefined): string | undefined {
  if (!path || path.trim() === '') return undefined;
  if (path.startsWith('http')) return path;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    console.warn('⚠️ getSupabasePublicUrl: NEXT_PUBLIC_SUPABASE_URL is not defined!');
    return path;
  }

  const baseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
  
  // バケット名を補完（もし含まれていなければ 'gallery' をデフォルトとする）
  // パスが 'bucket/folder/file' 形式か 'folder/file' 形式か判定
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // もしパスの中にスラッシュが含まれていない、または 'gallery/' で始まっていない場合は補完の余地あり
  // ただし、既にバケット名が含まれている可能性もあるため、基本的には gallery を足す
  const finalPath = cleanPath.includes('/') ? cleanPath : `gallery/${cleanPath}`;
  
  return `${baseUrl}/storage/v1/object/public/${finalPath}`;
}
