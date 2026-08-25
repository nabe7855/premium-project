import NoteArticleUI from '@/components/media/NoteArticleUI';
import { getRelatedArticles } from '@/lib/actions/media';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PREVIEW_TOKEN = 'kanae_sec_8f93a1c4b2e7d01695f241a38e70';

async function checkIsPreview(searchParams: any): Promise<boolean> {
  if (!searchParams) return false;
  try {
    const sp = await Promise.resolve(searchParams);
    if (!sp) return false;
    const rawVal = sp.preview || sp['preview'];
    const val = typeof rawVal === 'string' ? rawVal : Array.isArray(rawVal) ? rawVal[0] : undefined;
    return val === PREVIEW_TOKEN || val === 'true';
  } catch {
    return false;
  }
}

// 動的メタデータ生成（SEO対応）
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
  searchParams?: any;
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const isPreview = await checkIsPreview(searchParams);

  const article = await prisma.mediaArticle.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!article || (article.status !== 'published' && !isPreview)) {
    return {
      title: '記事が見つかりません',
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `https://www.sutoroberrys.jp/amolab/${resolvedParams.slug}`;

  const cleanTitle = (article.seo_title || article.title)
    .replace(/(｜体験談|｜アモラボ)+$/g, '')
    .replace(/｜アモラボ \(AmoLab\) by ストロベリーボーイズ$/g, '')
    .trim();

  const pageTitle = article.seo_title ? article.seo_title : `${cleanTitle}｜体験談｜アモラボ`;

  return {
    title: pageTitle,
    description: article.seo_description || article.excerpt || '',
    robots: {
      index: article.status === 'published' && !isPreview,
      follow: article.status === 'published' && !isPreview,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${pageTitle} | アモラボ (AmoLab) by ストロベリーボーイズ`,
      description: article.seo_description || article.excerpt || '',
      images: article.thumbnail_url
        ? [
            article.thumbnail_url.startsWith('http')
              ? article.thumbnail_url
              : `https://www.sutoroberrys.jp${article.thumbnail_url}`,
          ]
        : [],
      type: 'article',
      url: canonicalUrl,
    },
  };
}

export default async function MagazineArticlePage({
  params,
  searchParams,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
  searchParams?: any;
}) {
  const resolvedParams = await Promise.resolve(params);
  const isPreview = await checkIsPreview(searchParams);

  // DBから記事を取得、タグも結合して取得
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  // 記事がない、または下書きの場合は404ページへ（プレビュー時を除く）
  if (!article || (article.status !== 'published' && !isPreview)) {
    notFound();
  }

  // R1-1: category ガード（ikeo カテゴリの記事が /amolab/[slug] にアクセスされた場合は /ikeo/[slug] へ 301 転送）
  if (article.category === 'ikeo') {
    redirect(`/ikeo/${resolvedParams.slug}`);
  }

  // 関連記事の取得
  const relatedResult = await getRelatedArticles(article.id, 'user');
  const relatedArticles = relatedResult.success ? relatedResult.articles : [];

  const cleanTitle = (article.seo_title || article.title)
    .replace(/(｜体験談|｜アモラボ)+$/g, '')
    .replace(/｜アモラボ \(AmoLab\) by ストロベリーボーイズ$/g, '')
    .trim();

  // 構造化データ（JSON-LD）
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.thumbnail_url
      ? [
          article.thumbnail_url.startsWith('http')
            ? article.thumbnail_url
            : `https://www.sutoroberrys.jp${article.thumbnail_url}`,
        ]
      : [],
    datePublished: article.published_at?.toISOString() || article.created_at.toISOString(),
    dateModified: article.updated_at.toISOString(),
    author: {
      '@type': 'Organization',
      name: article.author_name || 'アモラボ 編集部',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ストロベリーボーイズ',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.sutoroberrys.jp/images/store-logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.sutoroberrys.jp/amolab/${resolvedParams.slug}`,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'アモラボ (AmoLab)',
        item: 'https://www.sutoroberrys.jp/amolab',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: article.tags?.[0]?.tag?.name || '体験談',
        item: `https://www.sutoroberrys.jp/amolab?tag=${encodeURIComponent(
          article.tags?.[0]?.tag?.name || '体験談',
        )}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: cleanTitle,
        item: `https://www.sutoroberrys.jp/amolab/${resolvedParams.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <NoteArticleUI
        article={article}
        relatedArticles={relatedArticles}
        category="amolab"
        baseUrl="/amolab"
      />
    </>
  );
}
