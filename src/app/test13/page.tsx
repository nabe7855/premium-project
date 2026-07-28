// Server Component - データを直接フェッチ
import type { Metadata } from 'next';
import { getMediaArticles } from '@/lib/actions/media';
import { getAllCasts } from '@/lib/getAllCasts';
import { supabase } from '@/lib/supabaseClient';
import HubPageClient from './HubPageClient';

// ━━━ SEO メタデータ ━━━
export const metadata: Metadata = {
  title: '女風・女性用風俗なら全国対応のストロベリーボーイズ｜東京・大阪・横浜・名古屋・福岡',
  description:
    '女風・女性用風俗を初めて利用する方も安心。東京・大阪・横浜・名古屋・福岡の全国5都市に対応した女性専用出張サービス「ストロベリーボーイズ」。料金・セラピスト情報・ご予約方法をわかりやすくご案内しています。',
  keywords: ['女風', '女性用風俗', '女性専用', '出張マッサージ', '女性専用出張サービス', 'ストロベリーボーイズ', '東京', '大阪', '横浜', '名古屋', '福岡'],
  openGraph: {
    title: '女風・女性用風俗なら全国対応のストロベリーボーイズ',
    description: '女風・女性用風俗を初めて利用する方も安心。東京・大阪・横浜・名古屋・福岡の全国5都市に対応した女性専用出張サービス。',
    type: 'website',
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
  // オウンドメディア非表示化に伴い、フェッチ処理を停止して空データを返却
  return { amolabArticles: [], sweetStayArticles: [], ikeoArticles: [] };
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
