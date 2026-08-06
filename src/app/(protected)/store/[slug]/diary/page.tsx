import DiaryListContent from '@/components/sections/diary/DiaryListContent';
import Header from '@/components/templates/store/fukuoka/sections/Header';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import FukuokaMobileStickyButton from '@/components/templates/store/fukuoka/sections/MobileStickyButton';
import YokohamaMobileStickyButton from '@/components/templates/store/yokohama/sections/MobileStickyButton';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { STORE_META } from '@/lib/store/storeMeta';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const s = STORE_META[slug];
  if (!s) return {};

  const title = `セラピスト日記｜${s.city}の女性用風俗｜ストロベリーボーイズ${s.city}店`;
  const description = `${s.city}（${s.area}）の女性用風俗「ストロベリーボーイズ${s.city}店」に在籍するイケメンセラピストたちの日常日記。彼らのプライベートな一面や出勤前の様子など、ここでしか見られない素顔をお届けします。`;

  return {
    title,
    description,
    alternates: { canonical: `https://www.sutoroberrys.jp/store/${slug}/diary` },
    openGraph: {
      title,
      description,
      url: `https://www.sutoroberrys.jp/store/${slug}/diary`,
      images: [{ url: `/ogp/store-${slug}.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/ogp/store-${slug}.png`]
    }
  };
}

import { supabase } from '@/lib/supabaseClient';
import { getSupabasePublicUrl } from '@/lib/image-url';
import { DiaryPost } from '@/types/diary';

async function getInitialDiaryPosts(storeSlug: string): Promise<DiaryPost[]> {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        id, title, content, created_at, published_at, updated_at, status,
        casts ( id, name, image_url, main_image_url, is_active, cast_store_memberships ( stores ( slug ) ) ),
        blog_images ( image_url ),
        blog_tags ( blog_tag_master ( name ) ),
        is_comment_enabled, blog_comments ( count ), view_count
      `)
      .in('status', ['published', 'scheduled'])
      .lte('published_at', now)
      .order('published_at', { ascending: false });

    if (error || !data) return [];

    return data
      .filter((post: any) => {
        const castObj = Array.isArray(post.casts) ? post.casts[0] : post.casts;
        if (!castObj || castObj.is_active === false) return false;

        const memberships = castObj?.cast_store_memberships ?? [];
        const slugs = Array.isArray(memberships)
          ? memberships.map((m: any) => m.stores?.slug).filter(Boolean)
          : [];
        return slugs.includes(storeSlug);
      })
      .map((post: any) => {
        const castObj = Array.isArray(post.casts) ? post.casts[0] : post.casts;
        return {
          id: post.id,
          title: post.title,
          content: post.content ?? '',
          excerpt: post.content ? post.content.slice(0, 100).replace(/\n/g, ' ') + '...' : '',
          date: post.published_at || post.created_at,
          updatedDate: post.updated_at,
          tags: post.blog_tags?.map((t: any) => t.blog_tag_master?.name).filter(Boolean) ?? [],
          reactions: { total: 0 },
          commentCount: post.blog_comments?.[0]?.count || 0,
          isCommentEnabled: post.is_comment_enabled ?? true,
          viewCount: post.view_count ?? 0,
          storeSlug,
          castName: castObj?.name ?? '不明なキャスト',
          castId: castObj?.id || '',
          castSlug: castObj?.slug || '',
          castAvatar: getSupabasePublicUrl(castObj?.main_image_url || castObj?.image_url),
          image_url: getSupabasePublicUrl(post.blog_images?.[0]?.image_url),
        };
      });
  } catch (err) {
    console.error('getInitialDiaryPosts error:', err);
    return [];
  }
}

export default async function DiaryListPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [result, initialPosts] = await Promise.all([
    getStoreTopConfig(slug, { skipCasts: true }),
    getInitialDiaryPosts(slug),
  ]);
  const topConfig = result.success ? (result.config as StoreTopPageConfig) : null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-pink-50 to-white">
      {/* Header (Server fetched config ensures it renders immediately) */}
      {topConfig?.header && <Header config={topConfig.header} />}

      <div className="flex-grow pt-24 sm:pt-28 md:pt-32">
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
            </div>
          }
        >
          <DiaryListContent storeSlug={slug} initialPosts={initialPosts} />
        </Suspense>
      </div>

      {/* Footer */}
      {slug === 'yokohama' && topConfig?.footer && <YokohamaFooter config={topConfig.footer} />}
      {slug === 'fukuoka' && topConfig?.footer && <FukuokaFooter config={topConfig.footer} />}

      {slug === 'fukuoka' && (
        <FukuokaMobileStickyButton
          config={topConfig?.footer?.bottomNav}
          isVisible={topConfig?.footer?.isBottomNavVisible}
        />
      )}
      {slug === 'yokohama' && (
        <YokohamaMobileStickyButton
          config={topConfig?.footer?.bottomNav}
          isVisible={topConfig?.footer?.isBottomNavVisible}
        />
      )}
    </div>
  );
}
