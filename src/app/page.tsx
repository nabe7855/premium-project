// Server Component - ルートトップページ (test13ハブデザイン正式適用)
import { getMediaArticles } from '@/lib/actions/media';
import { getPublishedPagesByStore } from '@/lib/actions/news-pages';
import { getAllCasts } from '@/lib/getAllCasts';
import { getTotalReviewCount } from '@/lib/getTotalReviewCount';
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
      'id, name, slug, image_url, hero_cast_image_url, catch_copy, description, address, is_active, use_external_url, external_url',
    )
    .eq('is_active', true)
    .order('created_at', { ascending: true })
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

import { prisma } from '@/lib/prisma';

async function getFeaturedCasts() {
  try {
    const data: any = await prisma.$queryRawUnsafe(`
      SELECT id, name, store_name, store_slug, catch_copy, image_url, link_url, is_external, display_order
      FROM featured_casts
      WHERE is_active = true
      ORDER BY display_order ASC, created_at DESC
    `);
    return data || [];
  } catch (e) {
    console.error('getFeaturedCasts error:', e);
    return [];
  }
}

async function getStorePrices() {
  const fallback = {
    fukuoka: [
      { minutes: 60, price: 12000 },
      { minutes: 90, price: 18000 },
      { minutes: 120, price: 24000 },
    ],
    yokohama: [
      { minutes: 60, price: 12000 },
      { minutes: 90, price: 18000 },
      { minutes: 120, price: 24000 },
    ],
  };

  try {
    const stores = await prisma.store.findMany({
      where: { slug: { in: ['fukuoka', 'yokohama'] } },
      select: {
        slug: true,
        price_config: {
          select: {
            courses: {
              where: { name: { contains: '基本' } },
              select: {
                plans: {
                  select: { minutes: true, price: true },
                  orderBy: { display_order: 'asc' }
                }
              }
            }
          }
        }
      }
    });

    const prices = { ...fallback };

    stores.forEach(s => {
      const plans = s.price_config?.courses?.[0]?.plans;
      if (plans && plans.length > 0) {
        prices[s.slug as keyof typeof fallback] = plans.map(p => ({ minutes: p.minutes, price: p.price }));
      }
    });

    return prices;
  } catch (e) {
    return fallback;
  }
}

export const dynamic = 'force-dynamic';

export default async function RootHomePage() {
  const [casts, stores, videos, diaries, mediaArticles, fukuokaNews, yokohamaNews, totalReviews, featuredCasts, storePrices] = await Promise.allSettled([
    getAllCasts(),
    getStores(),
    getLatestVideos(),
    getLatestDiaries(),
    getOwnedMediaArticles(),
    getPublishedPagesByStore('fukuoka'),
    getPublishedPagesByStore('yokohama'),
    getTotalReviewCount(),
    getFeaturedCasts(),
    getStorePrices(),
  ]);

  // 実数が取れなかった場合は 0 → 表示側で非表示にフォールバック（偽の固定値は入れない）
  const reviewCount = totalReviews.status === 'fulfilled' ? totalReviews.value : 0;

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
      reviewCount={reviewCount}
      featuredCasts={featuredCasts.status === 'fulfilled' ? featuredCasts.value : []}
      storePrices={storePrices.status === 'fulfilled' ? storePrices.value : {
        fukuoka: [{ minutes: 60, price: 12000 }, { minutes: 90, price: 18000 }, { minutes: 120, price: 24000 }],
        yokohama: [{ minutes: 60, price: 12000 }, { minutes: 90, price: 18000 }, { minutes: 120, price: 24000 }],
      }}
      mediaArticles={
        mediaArticles.status === 'fulfilled'
          ? (mediaArticles.value as any)
          : { amolabArticles: [], sweetStayArticles: [], ikeoArticles: [] }
      }
    />
  );
}
