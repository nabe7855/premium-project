import { prisma } from '@/lib/prisma';
import { ArrowLeftIcon, CalendarIcon, UserIcon } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

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

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt || '',
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt || '',
      images: article.thumbnail_url ? [article.thumbnail_url] : [],
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

  // 構造化データ（JSON-LD） - Article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.thumbnail_url ? [article.thumbnail_url] : [],
    datePublished: article.published_at?.toISOString() || article.created_at.toISOString(),
    dateModified: article.updated_at.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author_name || '運営事務局',
    },
    publisher: {
      '@type': 'Organization',
      name: 'THERAPIST CAREER',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl pb-20">
        {/* 戻るリンク */}
        <Link
          href="/career"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeftIcon size={16} /> 記事一覧へ戻る
        </Link>

        {/* 記事ヘッダー情報 */}
        <header className="mb-10 text-center">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            {article.tags.map((t: any) => (
              <span
                key={t.tag.id}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"
              >
                {t.tag.name}
              </span>
            ))}
          </div>
          <h1 className="mb-6 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <CalendarIcon size={16} />{' '}
              {new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP')}
            </span>
            <span className="flex items-center gap-1.5">
              <UserIcon size={16} /> {article.author_name}
            </span>
          </div>
        </header>

        {/* ヒーロー画像 */}
        {article.thumbnail_url && (
          <div className="relative mb-12 aspect-[2/1] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-md">
            <Image
              src={article.thumbnail_url}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* 記事本文 (Markdown) */}
        <article className="prose prose-blue prose-lg md:prose-xl mx-auto mb-16 max-w-none rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:p-12">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>

        {/* 募集LPへの強烈なCTA（コールトゥアクション） */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 p-8 text-center text-white shadow-xl sm:p-12">
          <div className="absolute right-0 top-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-white opacity-5 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 justify-end rounded-full bg-blue-500 opacity-20 blur-2xl"></div>

          <h2 className="mb-4 text-2xl font-bold md:text-3xl">最初の一歩を、踏み出しませんか？</h2>
          <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-blue-100 md:text-base">
            ストロベリーボーイズでは、業界未経験の男性をゼロからプロのセラピストへ育成する環境が整っています。
            <br />
            「本番行為の禁止」など法令を遵守した安心の環境で、新しい働き方を始めましょう。
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/store/fukuoka/recruit"
              className="rounded-lg bg-white px-8 py-4 text-center font-bold text-blue-900 shadow transition-transform hover:scale-105"
            >
              福岡店の採用情報・面接について
            </Link>
            <a
              href="https://line.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#06C755] px-8 py-4 text-center font-bold text-white shadow transition-transform hover:scale-105"
            >
              LINEで少しだけ相談する
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
