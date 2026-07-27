// Server Component - ルートトップページ (test13ハブデザイン正式適用)
import { getMediaArticles } from '@/lib/actions/media';
import { getAllCasts } from '@/lib/getAllCasts';
import { supabase } from '@/lib/supabaseClient';
import HubPageClient from './test13/HubPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '【公式】女性専用ウェルネス・出張セラピー ストロベリーボーイズ | 全国対応拠点・エリア検索',
  description: '女性専用ウェルネス・出張セラピー「ストロベリーボーイズ」公式サイト。福岡（博多・天神）・横浜（関内・みなとみらい）など全国の対応拠点から厳選されたイケメンセラピストを検索。',
  alternates: {
    canonical: 'https://www.sutoroberrys.jp/',
  },
};

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
  return { amolabArticles: [], sweetStayArticles: [], ikeoArticles: [] };
}

export const dynamic = 'force-dynamic';

export default async function RootHomePage() {
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
