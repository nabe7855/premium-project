import { supabase } from '../supabaseClient';

/**
 * 料金管理用の画像をアップロードする (クライアントサイド)
 * @param storeSlug 店舗のslug
 * @param path パス (hero, icon など)
 * @param file アップロードするファイル
 * @returns 公開URL
 */
export async function uploadPriceImageClient(
  storeSlug: string,
  path: string,
  file: File,
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const fileName = `${path}_${timestamp}.${fileExt}`;
  const filePath = `price/${storeSlug}/${fileName}`;

  // 'banners' バケットを使用（既にパブリックでアップロード可能なことが確認されているため）
  const bucketName = 'banners';
  console.log(`📤 [uploadPriceImageClient] Uploading to bucket: ${bucketName}, path: ${filePath}`);

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { upsert: false });

  if (uploadError) {
    console.error('❌ [uploadPriceImageClient] Upload error:', uploadError);
    // ユーザーに詳細を伝えるためにエラーオブジェクトを加工
    const msg = uploadError.message || 'Unknown error';
    const status = (uploadError as any).status || 'no-status';
    throw new Error(`Supabase Upload Failed: ${msg} (Status: ${status})`);
  }

  // 公開URLを取得
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
}
