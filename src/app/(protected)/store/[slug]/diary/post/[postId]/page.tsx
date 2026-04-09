import DiaryDetailContent from '@/components/sections/diary/DiaryDetailContent';
import Header from '@/components/templates/store/fukuoka/sections/Header';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import FukuokaMobileStickyButton from '@/components/templates/store/fukuoka/sections/MobileStickyButton';
import YokohamaMobileStickyButton from '@/components/templates/store/yokohama/sections/MobileStickyButton';
import { getDiaryPostById } from '@/lib/getDiaryPostById';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { Metadata } from 'next';

interface Props {
  params: { slug: string; postId: string };
}

// ✅ メタデータ生成 (SEO対策)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getDiaryPostById(params.postId, params.slug);

  if (!post) {
    return {
      title: '記事が見つかりません | Strawberry Boys',
    };
  }

  const title = `${post.title} | ${post.castName} | Strawberry Boys`;
  const description = post.excerpt || `${post.castName}さんが更新した最新の写メ日記です。${(post.content || '').slice(0, 50)}...`;
  const siteUrl = 'https://www.sutoroberrys.jp';
  const pageUrl = `${siteUrl}/store/${params.slug}/diary/post/${params.postId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Strawberry Boys',
      images: post.image ? [{ url: post.image, width: 1200, height: 630, alt: post.title }] : [],
      type: 'article',
      publishedTime: post.date,
      authors: [post.castName],
      tags: post.tags,
    } as any,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.image ? [post.image] : [],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function DiaryDetailPage({ params }: Props) {
  const { slug, postId } = params;
  const post = await getDiaryPostById(postId, slug);
  const result = await getStoreTopConfig(slug);
  const topConfig = result.success ? (result.config as StoreTopPageConfig) : null;

  // ✅ 構造化データ (BlogPosting)
  const structuredData = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || (post.content || '').slice(0, 150),
        image: [post.image],
        datePublished: new Date(post.date).toISOString(),
        dateModified: post.updatedDate ? new Date(post.updatedDate).toISOString() : new Date(post.date).toISOString(),
        author: [
          {
            '@type': 'Person',
            name: post.castName,
            url: `https://www.sutoroberrys.jp/store/${slug}/cast/${post.castSlug || post.castId}`,
          },
        ],
        publisher: {
          '@type': 'Organization',
          name: 'Strawberry Boys',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.sutoroberrys.jp/logo.png', // 正しいパスに要確認
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://www.sutoroberrys.jp/store/${slug}/diary/post/${postId}`,
        },
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-pink-50 to-white">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Header */}
      {topConfig?.header.isVisible && <Header config={topConfig.header} />}

      <div className="flex-grow pt-24 sm:pt-28 md:pt-32">
        <DiaryDetailContent slug={slug} postId={postId} />
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
