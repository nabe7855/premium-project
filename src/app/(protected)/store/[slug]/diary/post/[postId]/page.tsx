import DiaryDetailContent from '@/components/sections/diary/DiaryDetailContent';
import Header from '@/components/templates/store/fukuoka/sections/Header';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
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

  const title = `${post.title} | ${post.castName}のみんなの写メ日記`;
  const description = post.excerpt || `${post.castName}さんが更新した最新の日記記事です。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: post.image ? [{ url: post.image }] : [],
      type: 'article',
    },
    alternates: {
      canonical: `https://www.sutoroberrys.jp/store/${params.slug}/diary/post/${params.postId}`,
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
        image: [post.image],
        datePublished: post.date,
        author: [
          {
            '@type': 'Person',
            name: post.castName,
            url: `https://www.sutoroberrys.jp/store/${slug}/cast/${post.castSlug || post.castId}`,
          },
        ],
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
    </div>
  );
}
