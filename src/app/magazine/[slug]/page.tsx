import { prisma } from '@/lib/prisma';
import { ChevronLeftIcon, HeartIcon } from 'lucide-react';
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
      name: article.author_name || 'Lumiere 編集室',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lumiere Magazine',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png', // 本番のロゴ画像に置き換え
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl pb-24">
        {/* 戻るリンク */}
        <Link
          href="/magazine"
          className="mb-12 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-pink-500"
        >
          <ChevronLeftIcon size={14} /> Back to List
        </Link>

        {/* 記事ヘッダー情報 */}
        <header className="mb-12 text-center">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {article.tags.map((t: any) => (
              <span
                key={t.tag.id}
                className="rounded-full bg-pink-50/80 px-4 py-1.5 text-[10px] font-bold tracking-wider text-pink-600"
              >
                {t.tag.name}
              </span>
            ))}
          </div>
          <h1 className="mb-8 text-balance font-serif text-3xl leading-relaxed text-gray-800 md:text-4xl">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-[11px] font-medium tracking-widest text-gray-400">
            <span>
              {new Date(article.published_at || article.created_at)
                .toLocaleDateString('ja-JP')
                .replace(/\//g, '.')}
            </span>
            <span className="flex items-center gap-1 text-pink-300">
              <HeartIcon size={12} fill="currentColor" />
            </span>
            <span>By {article.author_name}</span>
          </div>
        </header>

        {/* ヒーロー画像 (存在する場合) */}
        {article.thumbnail_url && (
          <div className="relative mb-16 aspect-[16/9] w-full overflow-hidden rounded-[2rem] bg-pink-50 shadow-sm shadow-pink-100/50">
            <Image
              src={article.thumbnail_url}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* 記事本文 (Markdown) -> prose設定を女性向けにカスタム */}
        <article className="prose prose-lg prose-headings:font-serif prose-headings:font-normal prose-headings:text-gray-800 prose-a:text-pink-500 prose-a:no-underline hover:prose-a:text-pink-600 prose-img:rounded-3xl prose-hr:border-pink-50 prose-blockquote:border-l-pink-300 prose-blockquote:bg-pink-50/30 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-2xl prose-blockquote:text-gray-500 prose-blockquote:font-normal prose-li:marker:text-pink-300 mx-auto mb-20 max-w-none font-medium leading-[2.2] text-gray-600">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>

        {/* お店への優しい導線（CTA） */}
        <div className="relative overflow-hidden rounded-[2rem] border border-pink-100 bg-[#fffafb] p-10 text-center shadow-sm sm:p-14">
          <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-pink-200/20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-32 w-32 justify-end rounded-full bg-orange-100/30 blur-2xl"></div>

          <div className="mb-6 flex justify-center text-pink-300">
            <HeartIcon size={32} strokeWidth={1} />
          </div>
          <h2 className="mb-4 font-serif text-2xl tracking-wide text-gray-800">
            心ほどける、特別な時間を。
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-sm leading-loose text-gray-500">
            Lumiere Magazineをご覧いただきありがとうございます。
            <br />
            日常から離れ、あなただけを優しく癒やす特別な体験を見つけてみませんか？
            <br />
            些細なご不安やご質問も、コンシェルジュが丁寧にお答えいたします。
          </p>
          <div className="mx-auto flex w-fit flex-col justify-center gap-4 rounded-full shadow-[0_4px_15px_rgba(255,192,203,0.1)] sm:flex-row">
            <Link
              href="/store/fukuoka"
              className="rounded-full border border-pink-100 bg-white px-8 py-3.5 text-[13px] font-bold tracking-wider text-pink-600 transition-colors hover:bg-pink-50"
            >
              サロンについて知る
            </Link>
            <a
              href="https://line.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gray-800 px-8 py-3.5 text-[13px] font-bold tracking-wider text-white shadow-md transition-colors hover:bg-gray-700"
            >
              コンシェルジュに相談
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
