import { supabase } from '@/lib/supabaseClient';

export async function uploadStoreTopImage(
  file: File,
  storeSlug: string,
  section: string,
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${storeSlug}/${section}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage.from('store-top-images').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('store-top-images').getPublicUrl(fileName);

  return publicUrl;
}

export async function deleteStoreTopImage(imageUrl: string): Promise<void> {
  // URLからファイルパスを抽出
  const url = new URL(imageUrl);
  const pathParts = url.pathname.split('/');
  const fileName = pathParts.slice(pathParts.indexOf('store-top-images') + 1).join('/');

  const { error } = await supabase.storage.from('store-top-images').remove([fileName]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}
