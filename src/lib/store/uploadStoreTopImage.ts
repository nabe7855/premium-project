import { supabase } from '../supabaseClient';
import { compressAndConvertToWebP } from '../utils/image-processing';

/**
 * 店舗トップページ用の画像をアップロードする
 * @param storeSlug 店舗のslug
 * @param section セクション名 (hero, concept, campaign など)
 * @param file アップロードするファイル
 * @param options 圧縮オプション
 * @returns 公開URL
 */
export async function uploadStoreTopImage(
  storeSlug: string,
  section: string,
  file: File,
  options: { maxWidth?: number; quality?: number } = {},
): Promise<string | null> {
  // WebP 圧縮・変換処理を試行
  let uploadData: Blob | File = file;
  let fileExt = file.name.split('.').pop();

  try {
    // クライアントサイドでのみ実行（SSR対策）
    if (typeof window !== 'undefined') {
      console.log('⚡ [uploadStoreTopImage] Compressing and converting to WebP...', options);
      const webpBlob = await compressAndConvertToWebP(
        file,
        options.quality || 0.8,
        options.maxWidth || 1200,
      );
      uploadData = webpBlob;
      fileExt = 'webp';
      console.log('✨ [uploadStoreTopImage] WebP conversion success');
    }
  } catch (err) {
    console.warn('⚠️ [uploadStoreTopImage] WebP conversion failed, using original file:', err);
  }

  // 常に新規ファイルとして扱うため、秒単位まで含めたタイムスタンプを使用
  const timestamp = Date.now();
  const fileName = `${section}_${timestamp}.${fileExt}`;
  const filePath = `store-top/${storeSlug}/${fileName}`;

  // 'banners' バケットを使用
  const bucketName = 'banners';
  console.log(`📤 [uploadStoreTopImage] Uploading to bucket: ${bucketName}, path: ${filePath}`);

  // upsertをfalseにすることで、既存ファイルの更新権限(UPDATE)ではなく、
  // 公開されている追加権限(INSERT/SELECT)だけで動作するようにする
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, uploadData, { upsert: false });

  if (uploadError) {
    console.error(
      '❌ [uploadStoreTopImage] Supabase upload error:',
      JSON.stringify(uploadError, null, 2),
    );
    return null;
  }

  // 公開URLを取得
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  console.log('✅ [uploadStoreTopImage] Upload success. Public URL:', data.publicUrl);

  return data.publicUrl;
}

/**
 * 店舗トップページ用の画像を削除する
 * @param imageUrl 削除する画像のURL
 * @returns 成功したかどうか
 */
export async function deleteStoreTopImage(imageUrl: string): Promise<boolean> {
  try {
    if (!imageUrl || !imageUrl.startsWith('http')) {
      return true; // 削除不要なURL
    }

    // URLからファイルパスを抽出
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');

    // バケット名 ('banners') を探し、その後のパスを結合する
    const bucketName = 'banners';
    const bucketIndex = pathParts.findIndex((part) => part === bucketName);

    if (bucketIndex === -1) {
      console.warn(
        '⚠️ [deleteStoreTopImage] Bucket not found in URL, skipping storage deletion:',
        imageUrl,
      );
      return true;
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/');

    console.log(`🗑️ [deleteStoreTopImage] Deleting from bucket: ${bucketName}, path: ${filePath}`);

    const { error } = await supabase.storage.from(bucketName).remove([filePath]);

    if (error) {
      console.error(
        '❌ [deleteStoreTopImage] Supabase delete error:',
        JSON.stringify(error, null, 2),
      );
      return false;
    }

    console.log('✅ [deleteStoreTopImage] Image deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ [deleteStoreTopImage] Unexpected error:', error);
    return false;
  }
}
