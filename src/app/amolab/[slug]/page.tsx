import NoteArticleUI from '@/components/media/NoteArticleUI';
import { getRelatedArticles } from '@/lib/actions/media';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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

  const canonicalUrl = `https://www.sutoroberrys.jp/amolab/${params.slug}`;

  const cleanTitle = (article.seo_title || article.title)
    .replace(/(｜体験談|｜アモラボ)+$/g, '')
    .replace(/｜アモラボ \(AmoLab\) by ストロベリーボーイズ$/g, '')
    .trim();

  const pageTitle = `${cleanTitle}｜体験談`;

  return {
    title: pageTitle,
    description: article.seo_description || article.excerpt || '',
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
        name: cleanTitle,
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
        name: '既婚で子どももいますが、女性用風俗を利用していいのでしょうか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'はい。既婚・子育て中の利用者も多くいます。家庭がある方ほど自分を後回しにしがちで、心のメンテナンスとして利用される方が多くいらっしゃいます。',
        },
      },
      {
        '@type': 'Question',
        name: '初めてで、何をされるのか分からず怖いです。',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '「分からないこと」が不安の正体です。まずは当日の流れを知るところから始めるのがおすすめです。多くのセラピストは、初めての方にこそ丁寧に説明しながら進めてくれます。',
        },
      },
      {
        '@type': 'Question',
        name: 'どうやって予約すれば、ハードルが低いですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '気になるセラピストとSNSなどで少し会話を重ねてから予約に進む方が、心理的なハードルは下がります。会話の延長で進める方が初めての方には自然です。もちろん通常の予約フォームも利用できます。',
        },
      },
      {
        '@type': 'Question',
        name: '容姿やスタイルに自信がありません。',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '自信のなさは利用を止める理由にはなりません。自己肯定感が低かった利用者も「ちゃんと大事にしてもらえた」と感じ、少しずつ前を向けるようになっています。',
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
