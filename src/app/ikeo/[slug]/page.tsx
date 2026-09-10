import NoteArticleUI from '@/components/media/NoteArticleUI';
import { getRelatedArticles } from '@/lib/actions/media';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 動的メタデータ生成（SEO対応）
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: params.slug },
  });

  if (!article || article.status !== 'published') {
    return { title: '記事が見つかりません' };
  }

  const canonicalUrl = `https://www.sutoroberrys.jp/ikeo/${params.slug}`;

  const rawTitle = article.seo_title || article.title;
  // layout.tsx の template: '%s | イケオラボ by ストロベリーボーイズ' による重複付与を防止
  const cleanTitle = rawTitle
    .replace(/[｜|]\s*イケオラボ(\s+by\s+ストロベリーボーイズ)?$/g, '')
    .trim();

  return {
    title: cleanTitle,
    description: article.seo_description || article.excerpt || '',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: cleanTitle,
      description: article.seo_description || article.excerpt || '',
      images: article.thumbnail_url ? [article.thumbnail_url] : [],
      type: 'article',
      url: canonicalUrl,
    },
  };
}

export default async function CareerArticlePage({ params }: { params: { slug: string } }) {
  // DBから記事を取得、タグも結合して取得
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: params.slug },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  // 記事がない、または下書きの場合は404ページへ
  if (!article || article.status !== 'published') {
    notFound();
  }

  // R1-1: category ガード（amolab / amolab-jiten カテゴリの記事が /ikeo/[slug] にアクセスされた場合は /amolab/[slug] へ 301 転送）
  if (article.category === 'amolab' || article.category === 'amolab-jiten') {
    redirect(`/amolab/${params.slug}`);
  }

  // 関連記事を取得
  const relatedResult = await getRelatedArticles(article.id, 'recruit', 3);
  const relatedArticles = relatedResult.success ? relatedResult.articles || [] : [];

  // FAQPage JSON-LD 構造化データの動的生成
  const faqList: { question: string; answer: string }[] = [];
  if (article.content) {
    const qMatches = Array.from(
      article.content.matchAll(
        /<(?:h3|p\s+class="q")[^>]*>Q\.\s*([\s\S]*?)<\/(?:h3|p)>\s*<p(?: class="a")?[^>]*>(?:A\.\s*)?([\s\S]*?)<\/p>/gi,
      ),
    );
    for (const m of qMatches) {
      const qText = ((m as RegExpMatchArray)[1] || '').replace(/<[^>]+>/g, '').trim();
      const aText = ((m as RegExpMatchArray)[2] || '').replace(/<[^>]+>/g, '').trim();
      if (qText && aText) {
        faqList.push({ question: qText, answer: aText });
      }
    }
  }

  const faqJsonLd =
    faqList.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqList.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  // 構造化データ（JSON-LD）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.thumbnail_url ? [article.thumbnail_url] : [],
    datePublished: article.published_at?.toISOString() || article.created_at.toISOString(),
    dateModified: article.updated_at.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author_name || 'イケオラボ 編集部',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'イケオラボ',
        item: 'https://www.sutoroberrys.jp/ikeo',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: article.title,
        item: `https://www.sutoroberrys.jp/ikeo/${params.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <NoteArticleUI
        article={article}
        relatedArticles={relatedArticles}
        category="ikeo"
        baseUrl="/ikeo"
      />
    </>
  );
}
