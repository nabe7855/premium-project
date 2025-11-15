import { supabase } from './supabaseClient';

export async function uploadProfileImage(castId: string, file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${castId}.${fileExt}`;
  const filePath = `profiles/${fileName}`;

  // 1. アップロード
  const { error: uploadError } = await supabase.storage
    .from('cast-profile-images')
    .upload(filePath, file, { upsert: true });

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
