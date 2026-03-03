import { supabase } from './supabaseClient';

export async function uploadMediaImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const fileName = `media_${timestamp}_${randomStr}.${fileExt}`;
  const filePath = `media/${fileName}`;

  // Using 'banners' bucket as it is confirmed to exist and be public
  const bucketName = 'banners';

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error('❌ Supabase upload error:', uploadError);
    return null;
  }

  // Get Public URL
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
}
