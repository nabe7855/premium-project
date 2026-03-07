// Server Component - データを直接フェッチ
import { getAllCasts } from '@/lib/getAllCasts';
import { supabase } from '@/lib/supabaseClient';
import HubPageClient from './HubPageClient';

async function getStores() {
  const { data, error } = await supabase
    .from('stores')
    .select('id, name, slug, image_url, catch_copy, description, address, is_active')
    .eq('is_active', true)
    .limit(10);
  if (error) return [];
  return data || [];
}

async function getLatestVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select('id, url, title, store_id, created_at, thumbnail_url, stores(name, slug)')
    .order('created_at', { ascending: false })
    .limit(8);
  if (error) return [];
  return data || [];
}

async function getLatestDiaries() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, content, cast_id, created_at, images:blog_images(image_url)')
    .order('created_at', { ascending: false })
    .limit(6);
  if (error) return [];
  return data || [];
}

export const dynamic = 'force-dynamic';

export default async function Test13Page() {
  const [casts, stores, videos, diaries] = await Promise.allSettled([
    getAllCasts(),
    getStores(),
    getLatestVideos(),
    getLatestDiaries(),
  ]);

  return (
    <HubPageClient
      casts={casts.status === 'fulfilled' ? casts.value : []}
      stores={stores.status === 'fulfilled' ? stores.value : []}
      videos={videos.status === 'fulfilled' ? videos.value : []}
      diaries={diaries.status === 'fulfilled' ? diaries.value : []}
    />
  );
}
