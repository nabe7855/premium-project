import { getRelatedArticles } from '@/lib/actions/media';
import { prisma } from '@/lib/prisma';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  UserIcon,
} from 'lucide-react';
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
    title: `${article.title} | GENTLEMAN'S CODE`,
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

  // 関連記事を取得
  const relatedResult = await getRelatedArticles(article.id, 'recruit', 3);
  const relatedArticles = relatedResult.success ? relatedResult.articles || [] : [];

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
      name: article.author_name || "GENTLEMAN'S CODE 編集部",
    },
    publisher: {
      '@type': 'Organization',
      name: "GENTLEMAN'S CODE",
      logo: {
        '@type': 'ImageObject',
        url: 'https://strawberry-boys.vercel.app/logo.png', // 適宜変更
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-6 pb-20 pt-10">
        {/* 戻るリンク */}
        <Link
          href="/career"
          className="mb-12 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-blue-600"
        >
          <ArrowLeftIcon size={14} /> Back to Index
        </Link>

        {/* 記事ヘッダー情報 */}
        <header className="mb-12 text-center md:mb-20">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {article.tags.map((t: any) => (
              <span
                key={t.tag.id}
                className="rounded-full border border-slate-100 bg-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400"
              >
                {t.tag.name}
              </span>
            ))}
          </div>
          <h1 className="mb-10 font-serif text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-300">
            <span className="flex items-center gap-2">
              <CalendarIcon size={14} />{' '}
              {new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP')}
            </span>
            <span className="flex items-center gap-2">
              <UserIcon size={14} /> {article.author_name}
            </span>
          </div>
        </header>

        {/* ヒーロー画像 */}
        {article.thumbnail_url && (
          <div className="relative mb-16 aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-xl shadow-slate-200/50">
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
        <article className="prose prose-slate prose-lg md:prose-xl prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-relaxed prose-a:text-blue-600 mx-auto mb-20 max-w-none">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>

        {/* ディスクレイマー */}
        <div className="mb-20 rounded-3xl border border-slate-100 bg-slate-50/50 p-8 text-[11px] leading-loose text-slate-400">
          <div className="mb-4 flex items-center gap-2 font-bold text-slate-500">
            <ShieldCheckIcon size={16} /> PROFESSIONAL GUIDELINES
          </div>
          <p>
            GENTLEMAN\'S
            CODEが提供するコンテンツは、男性の魅力向上とキャリア形成を目的とした情報提供です。
            セラピストとしての働き方を検討される際は、各店舗の募集要項および関連法規を十分にご確認ください。
            当メディアは法令遵守（コンプライアンス）を最優先しており、反社会的勢力との関わりや公序良俗に反する行為を一切推奨いたしません。
          </p>
        </div>

        {/* 募集LPへの強烈なCTA（コールトゥアクション） */}
        <div className="relative mb-32 overflow-hidden rounded-[3rem] bg-slate-950 p-10 text-center text-white shadow-2xl md:p-20">
          <div className="absolute right-0 top-0 -mr-10 -mt-10 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-slate-800/20 blur-3xl"></div>

          <div className="relative z-10">
            <div className="mb-8 flex justify-center text-blue-500">
              <UserCheckIcon size={48} strokeWidth={1} />
            </div>
            <h2 className="mb-6 font-serif text-3xl font-bold md:text-5xl">
              「選ばれる男」としての、一歩を。
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-[13px] leading-loose text-slate-400 md:text-base">
              知識を得ることはスタートに過ぎません。圧倒的な経験と実践こそが、あなたを真の魅力的な男性へと作り変えます。
              <br />
              洗練された環境で、自分自身の価値を証明してみませんか？
            </p>
            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <Link
                href="/store/fukuoka/recruit"
                className="group flex items-center justify-center gap-2 rounded-full bg-blue-600 px-10 py-5 text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500"
              >
                採用情報を見る{' '}
                <ArrowRightIcon
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <a
                href="https://line.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 px-10 py-5 text-sm font-bold backdrop-blur-md transition-all hover:bg-white/20"
              >
                専属コンシェルジュに相談
              </a>
            </div>
          </div>
        </div>

        {/* 関連記事 */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-slate-100 pt-20">
            <div className="mb-12 flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-slate-800">
                こちらの記事もおすすめ
              </h3>
              <Link
                href="/career"
                className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {relatedArticles.map((ra: any) => (
                <Link key={ra.id} href={`/career/${ra.slug}`} className="group block">
                  <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-3xl bg-slate-100 shadow-sm transition-shadow group-hover:shadow-md">
                    {ra.thumbnail_url && (
                      <Image
                        src={ra.thumbnail_url}
                        alt={ra.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <h4 className="line-clamp-2 text-sm font-bold leading-relaxed text-slate-700 transition-colors group-hover:text-blue-600">
                    {ra.title}
                  </h4>
                  <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-blue-500 opacity-0 transition-all group-hover:opacity-100">
                    READ MORE <ArrowRightIcon size={12} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
