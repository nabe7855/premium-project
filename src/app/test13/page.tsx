// Server Component - データを直接フェッチ
import { getMediaArticles } from '@/lib/actions/media';
import { getAllCasts } from '@/lib/getAllCasts';
import { supabase } from '@/lib/supabaseClient';
import HubPageClient from './HubPageClient';

async function getStores() {
  const { data, error } = await supabase
    .from('stores')
    .select(
      'id, name, slug, image_url, catch_copy, description, address, is_active, use_external_url, external_url',
    )
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
    .from('blogs')
    .select(
      'id, title, content, cast_id, created_at, casts!inner(id, name, image_url, main_image_url, is_active), images:blog_images(image_url)',
    )
    .eq('status', 'published')
    .eq('casts.is_active', true)
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) {
    console.error('getLatestDiaries error:', error.message);
    return [];
  }
  return data || [];
}

async function getOwnedMediaArticles() {
  const [userRes, recruitRes] = await Promise.allSettled([
    getMediaArticles(undefined, 'user'),
    getMediaArticles(undefined, 'recruit'),
  ]);

  const rawUserArticles =
    userRes.status === 'fulfilled' && userRes.value.success
      ? (userRes.value.articles?.filter((a: any) => a.status === 'published') ?? [])
      : [];

  const rawRecruitArticles =
    recruitRes.status === 'fulfilled' && recruitRes.value.success
      ? (recruitRes.value.articles?.filter((a: any) => a.status === 'published') ?? [])
      : [];

  // カテゴリごとに抽出
  const amolabArticles = rawUserArticles.filter((a: any) => a.category === 'amolab').slice(0, 4);
  const sweetStayArticles = rawUserArticles.filter((a: any) => a.category === 'sweetstay').slice(0, 4);
  const ikeoArticles = rawRecruitArticles.filter((a: any) => a.category === 'ikeo').slice(0, 4);

  return { amolabArticles, sweetStayArticles, ikeoArticles };
}

export const dynamic = 'force-dynamic';

export default async function Test13Page() {
  const [casts, stores, videos, diaries, mediaArticles] = await Promise.allSettled([
    getAllCasts(),
    getStores(),
    getLatestVideos(),
    getLatestDiaries(),
    getOwnedMediaArticles(),
  ]);

  return (
    <HubPageClient
      casts={casts.status === 'fulfilled' ? casts.value : []}
      stores={stores.status === 'fulfilled' ? stores.value : []}
      videos={videos.status === 'fulfilled' ? videos.value : []}
      diaries={diaries.status === 'fulfilled' ? diaries.value : []}
      mediaArticles={
        mediaArticles.status === 'fulfilled'
          ? (mediaArticles.value as any)
          : { amolabArticles: [], sweetStayArticles: [], ikeoArticles: [] }
      }
    />
  );
}
