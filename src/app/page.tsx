// Server Component - ルートトップページ (test13ハブデザイン正式適用)
import { getMediaArticles } from '@/lib/actions/media';
import { getAllCasts } from '@/lib/getAllCasts';
import { supabase } from '@/lib/supabaseClient';
import HubPageClient from './test13/HubPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: '女性用風俗・女風・出張ホスト｜ストロベリーボーイズ【福岡・横浜】' },
  description: '女性用風俗・女風・出張ホスト「ストロベリーボーイズ」公式サイト。福岡（博多・天神・中洲）・横浜（関内・みなとみらい）など厳選された人気イケメンセラピストをご指定ホテルやご自宅へ出張。安心の明朗会計！',
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

import { getPublishedPagesByStore } from '@/lib/actions/news-pages';

export const dynamic = 'force-dynamic';

export default async function RootHomePage() {
  const [casts, stores, videos, diaries, mediaArticles, fukuokaNews, yokohamaNews] = await Promise.allSettled([
    getAllCasts(),
    getStores(),
    getLatestVideos(),
    getLatestDiaries(),
    getOwnedMediaArticles(),
    getPublishedPagesByStore('fukuoka'),
    getPublishedPagesByStore('yokohama'),
  ]);

  const fukuokaNewsList = fukuokaNews.status === 'fulfilled' && fukuokaNews.value ? fukuokaNews.value : [];
  const yokohamaNewsList = yokohamaNews.status === 'fulfilled' && yokohamaNews.value ? yokohamaNews.value : [];
  
  // 日付順にソートして最大6件取得
  const allNewsPages = [...fukuokaNewsList, ...yokohamaNewsList]
    .sort((a, b) => {
      const aTime = typeof a.updatedAt === 'number' ? a.updatedAt : new Date((a as any).createdAt || 0).getTime();
      const bTime = typeof b.updatedAt === 'number' ? b.updatedAt : new Date((b as any).createdAt || 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 6);

  return (
    <HubPageClient
      casts={casts.status === 'fulfilled' ? casts.value : []}
      stores={stores.status === 'fulfilled' ? stores.value : []}
      videos={videos.status === 'fulfilled' ? videos.value : []}
      diaries={diaries.status === 'fulfilled' ? diaries.value : []}
      newsPages={allNewsPages}
      mediaArticles={
        mediaArticles.status === 'fulfilled'
          ? (mediaArticles.value as any)
          : { amolabArticles: [], sweetStayArticles: [], ikeoArticles: [] }
      }
    />
  );
}
