import NoteArticleUI from '@/components/media/NoteArticleUI';
import { getRelatedArticles } from '@/lib/actions/media';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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

  const canonicalUrl = `https://www.sutoroberrys.jp/amolab/${params.slug}`;

  const rawTitle = (article.seo_title || article.title)
    .replace(/(｜体験談)?(｜アモラボ)+$/g, '')
    .replace(/｜アモラボ \(AmoLab\) by ストロベリーボーイズ$/g, '')
    .trim();

  const finalTitle = `${rawTitle}｜体験談｜アモラボ`;

  return {
    title: {
      absolute: finalTitle,
    },
    description: article.seo_description || article.excerpt || '',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: finalTitle,
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

export default async function MagazineArticlePage({ params }: { params: { slug: string } }) {
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

  // 関連記事の取得
  const relatedResult = await getRelatedArticles(article.id, 'user');
  const relatedArticles = relatedResult.success ? relatedResult.articles : [];

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
      '@id': `https://www.sutoroberrys.jp/amolab/${params.slug}`,
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
        name: article.title,
        item: `https://www.sutoroberrys.jp/amolab/${params.slug}`,
      },
    ],
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '準備するものはありますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '特に用意するものはありません。ホテルやご自宅でのシャワー・タオル等の環境があれば十分です。リラックスできる服装でお待ちください。',
        },
      },
      {
        '@type': 'Question',
        name: '本当に写真通りのセラピストが来ますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'はい。掲載写真はすべて本人であり、指名いただいたキャストが必ず伺います。',
        },
      },
      {
        '@type': 'Question',
        name: '性的な行為を強制されませんか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '無理なスキンシップや同意のない行為は一切ありません。お客様のお気持ち・ペースを一番に考慮して進めます。',
        },
      },
      {
        '@type': 'Question',
        name: '予約後のキャンセルはできますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '所定のキャンセル規定に沿って対応しております。急な体調不良やご都合の変更の際は、LINEまたはお電話で早めにご相談ください。',
        },
      },
      {
        '@type': 'Question',
        name: 'どこで待ち合わせるの？家族にバレませんか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ホテルのロビーや指定のお部屋で合流できます。ご家族や知人に知られることのないよう、店舗名やサービス内容がわかる形での連絡・通知は一切行いません。プライバシーを最優先に保護しておりますのでご安心ください。',
        },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
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
