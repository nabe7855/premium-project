import NoteArticleUI from '@/components/media/NoteArticleUI';
import { getRelatedArticles } from '@/lib/actions/media';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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

  return {
    title: `${article.title}｜Sweet Stay`,
    description: article.seo_description || article.excerpt || '',
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt || '',
      images: article.thumbnail_url ? [article.thumbnail_url] : [],
      type: 'article',
    },
  };
}

export default async function SweetStayArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: params.slug },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!article || article.status !== 'published') {
    notFound();
  }

  const relatedResult = await getRelatedArticles(article.id, 'user');
  const relatedArticles = (relatedResult.success ? relatedResult.articles : []).filter(
    (a: any) => a.category === 'sweetstay',
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.thumbnail_url ? [article.thumbnail_url] : [],
    datePublished: article.published_at?.toISOString() || article.created_at.toISOString(),
    dateModified: article.updated_at.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author_name || 'Sweet Stay 編集部',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NoteArticleUI
        article={article}
        relatedArticles={relatedArticles}
        category="sweetstay"
        baseUrl="/sweetstay/articles"
      />
    </>
  );
}
