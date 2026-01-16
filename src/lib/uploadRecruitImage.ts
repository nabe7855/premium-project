import { supabase } from './supabaseClient';

export async function uploadRecruitImage(
  storeId: string,
  sectionKey: string,
  file: File,
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const fileName = `${sectionKey}_${timestamp}.${fileExt}`;
  const filePath = `recruit/${storeId}/${fileName}`;

  // Using 'banners' bucket as it is confirmed to exist and be public
  const bucketName = 'banners';
  console.log(`📤 Uploading to bucket: ${bucketName}, path: ${filePath}`);

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error('❌ Supabase upload error detail:', JSON.stringify(uploadError, null, 2));
    return null;
  }

  // Get Public URL
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  console.log('✅ Upload success. Public URL:', data.publicUrl);

  return data.publicUrl;
}
