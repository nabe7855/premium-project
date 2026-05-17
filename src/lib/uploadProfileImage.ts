import { supabase } from './supabaseClient';

import imageCompression from 'browser-image-compression';

export async function uploadProfileImage(castId: string, file: File): Promise<string | null> {
  let fileToUpload = file;
  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: 'image/webp' as const,
    };
    fileToUpload = await imageCompression(file, options);
  } catch (error) {
    console.warn('⚠️ Profile image compression failed, using original file:', error);
  }

  const fileExt = 'webp';
  const fileName = `${castId}_${Date.now()}.${fileExt}`;
  const filePath = `profiles/${fileName}`;

  // 1. アップロード
  const { error: uploadError } = await supabase.storage
    .from('cast-profile-images')
    .upload(filePath, fileToUpload, { upsert: true });

  if (uploadError) {
    console.error('❌ upload error:', uploadError);
    return null;
  }

  // 2. 公開URLを取得
  const { data } = supabase.storage
    .from('cast-profile-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
