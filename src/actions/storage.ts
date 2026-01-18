'use server';

import { supabase } from '@/lib/supabaseClient';

/**
 * ストレージからファイルを削除する (Server Action)
 * @param imageUrl 削除する画像のフルURL
 * @returns 成功したかどうか
 */
export async function deleteStorageFile(imageUrl: string) {
  try {
    if (!imageUrl || !imageUrl.startsWith('http')) {
      console.log(
        '⚠️ deleteStorageFile: Invalid URL or local path, skipping storage deletion:',
        imageUrl,
      );
      return { success: true }; // デフォルト画像などは削除不要なので成功扱い
    }

    console.log('🗑️ deleteStorageFile: Starting deletion for URL:', imageUrl);

    // URLからバケット名とパスを抽出する
    // 例: https://xxx.supabase.co/storage/v1/object/public/banners/store-top/tokyo/header_123.png
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');

    // 'public' の後の最初の要素をバケット名、それ以降をパスとする
    const publicIndex = pathParts.indexOf('public');
    if (publicIndex === -1 || publicIndex + 2 >= pathParts.length) {
      console.error('❌ deleteStorageFile: Could not parse bucket and path from URL:', imageUrl);
      return { success: false, error: 'URL形式が正しくありません' };
    }

    const bucketName = pathParts[publicIndex + 1];
    const filePath = pathParts.slice(publicIndex + 2).join('/');

    console.log(`🗑️ deleteStorageFile: Parsed bucket=[${bucketName}], path=[${filePath}]`);

    const { error } = await supabase.storage.from(bucketName).remove([filePath]);

    if (error) {
      console.error(
        '❌ deleteStorageFile: Supabase storage remove error:',
        JSON.stringify(error, null, 2),
      );
      return { success: false, error: error.message };
    }

    console.log('✅ deleteStorageFile: Successfully deleted from storage');
    return { success: true };
  } catch (error: any) {
    console.error('❌ deleteStorageFile: Unexpected error:', error);
    return { success: false, error: error.message || '予期せぬエラーが発生しました' };
  }
}
