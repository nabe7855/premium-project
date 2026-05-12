import InterviewArticleUI from '@/components/interview/InterviewArticleUI';
import { getInterviewArticleBySlug } from '@/lib/actions/interview';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// ---------------------------------------------------------------------------
// インタビュー記事詳細ページ
// URL: /magazine/interview/[slug]
// ---------------------------------------------------------------------------

interface PageProps {
  params: { slug: string };
}

// 動的メタデータ（SEO対応）
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await getInterviewArticleBySlug(params.slug);

  if (!result.success || !result.article) {
    return { title: '記事が見つかりません' };
  }

  const { article } = result;

  return {
    title: `${article.seo_title || article.title} | ストロベリーボーイズ インタビュー`,
    description: article.seo_description || article.excerpt || '',
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt || '',
      images:
        article.interview_meta?.ogp_image_url || article.thumbnail_url
          ? [
              (article.interview_meta?.ogp_image_url ||
                article.thumbnail_url) as string,
            ]
          : [],
      type: 'article',
      publishedTime:
        article.published_at?.toISOString() ?? article.created_at.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function InterviewArticlePage({ params }: PageProps) {
  const result = await getInterviewArticleBySlug(params.slug);

  // 記事なし or 非公開 → 404
  if (!result.success || !result.article || result.article.status !== 'published') {
    notFound();
  }

  const { article } = result;
  const meta = article.interview_meta;
  const castLinks = meta?.cast_links ?? [];

  // 構造化データ（JSON-LD）
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.seo_description || article.excerpt || '',
    image: meta?.ogp_image_url || article.thumbnail_url
      ? [meta?.ogp_image_url || article.thumbnail_url]
      : [],
    datePublished:
      article.published_at?.toISOString() ?? article.created_at.toISOString(),
    dateModified: article.updated_at.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author_name || 'ストロベリーボーイズ 編集部',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ストロベリーボーイズ',
    },
  };

  // FAQがあれば FAQPage 構造化データも追加
  const faqData = meta?.faq_data as { items: { question: string; answer: string }[] } | undefined;
  const faqJsonLd =
    faqData?.items && faqData.items.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqData.items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  // BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'トップ', item: 'https://www.sutoroberrys.jp/' },
      { '@type': 'ListItem', position: 2, name: 'インタビュー', item: 'https://www.sutoroberrys.jp/magazine/interview' },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `https://www.sutoroberrys.jp/magazine/interview/${params.slug}`,
      },
    ],
  };

  return (
    <>
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* パンくずリスト */}
      <nav
        className="mx-auto max-w-[720px] px-5 pt-4 text-xs"
        style={{ color: '#9ca3af' }}
      >
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <a href="/" className="hover:text-pink-400">
              トップ
            </a>
          </li>
          <li>/</li>
          <li>
            <a href="/magazine/interview" className="hover:text-pink-400">
              インタビュー
            </a>
          </li>
          <li>/</li>
          <li
            className="truncate"
            style={{ maxWidth: 200, color: '#555' }}
          >
            {article.title}
          </li>
        </ol>
      </nav>

      {/* 記事UI */}
      <InterviewArticleUI
        article={article}
        interviewMeta={
          meta
            ? {
                article_type: meta.article_type,
                series_slug: meta.series_slug,
                vol_number: meta.vol_number,
                area: meta.area,
                dialogue_data: meta.dialogue_data,
                profile_data: meta.profile_data,
                faq_data: meta.faq_data,
                photos: meta.photos,
              }
            : null
        }
        castLinks={castLinks.map((cl) => ({
          cast_name: cl.cast_name,
          cast_name_romaji: cl.cast_name_romaji,
          role: cl.role,
          display_order: cl.display_order,
        }))}
      />
    </>
  );
}
