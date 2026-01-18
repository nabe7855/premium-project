import { supabase } from '../supabaseClient';

/**
 * 店舗トップページ用の画像をアップロードする
 * @param storeSlug 店舗のslug
 * @param section セクション名 (hero, concept, campaign など)
 * @param file アップロードするファイル
 * @returns 公開URL
 */
export async function uploadStoreTopImage(
  storeSlug: string,
  section: string,
  file: File,
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const fileName = `${section}_${timestamp}.${fileExt}`;
  const filePath = `store-top/${storeSlug}/${fileName}`;

  // 'banners' バケットが公開設定、かつ存在が確認されているためこれを使用
  const bucketName = 'banners';
  console.log(`📤 Uploading store top image to bucket: ${bucketName}, path: ${filePath}`);

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error('❌ Supabase upload error detail:', JSON.stringify(uploadError, null, 2));
    return null;
  }

  // 公開URLを取得
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  console.log('✅ Upload success. Public URL:', data.publicUrl);

  return data.publicUrl;
}
