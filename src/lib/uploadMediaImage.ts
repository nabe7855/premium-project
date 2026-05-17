import { supabase } from './supabaseClient';

import imageCompression from 'browser-image-compression';

export async function uploadMediaImage(file: File): Promise<string | null> {
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
    console.warn('⚠️ Media image compression failed, using original file:', error);
  }

  const fileExt = 'webp';
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const fileName = `media_${timestamp}_${randomStr}.${fileExt}`;
  const filePath = `media/${fileName}`;

  // Using 'banners' bucket as it is confirmed to exist and be public
  const bucketName = 'banners';

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, fileToUpload, { upsert: true });

  if (uploadError) {
    console.error('❌ Supabase upload error:', uploadError);
    return null;
  }

  // Get Public URL
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
}
