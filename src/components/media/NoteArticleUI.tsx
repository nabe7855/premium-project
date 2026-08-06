'use client';

import {
  BookmarkIcon,
  ChevronLeftIcon,
  HeartIcon,
  MessageCircleIcon,
  Share2Icon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface NoteArticleUIProps {
  article: any;
  relatedArticles: any[];
  category: 'ikejo' | 'ikeo' | 'sweetstay' | 'ikejo-jiten' | 'amolab' | 'amolab-jiten';
  baseUrl: string;
}

export default function NoteArticleUI({
  article,
  relatedArticles,
  category,
  baseUrl,
}: NoteArticleUIProps) {
  const themes = {
    ikejo: {
      primary: 'pink',
      bg: 'bg-pink-50',
      text: 'text-pink-500',
      accent: 'pink-200',
      authorLabel: '編集部',
      authorColor: 'text-pink-400',
      prose: 'prose-pink',
    },
    ikeo: {
      primary: 'blue',
      bg: 'bg-slate-900',
      text: 'text-blue-500',
      accent: 'blue-200',
      authorLabel: 'Ikeo',
      authorColor: 'text-blue-500',
      prose: 'prose-slate',
    },
    sweetstay: {
      primary: 'rose',
      bg: 'bg-rose-50',
      text: 'text-rose-500',
      accent: 'rose-200',
      authorLabel: 'Stay',
      authorColor: 'text-rose-500',
      prose: 'prose-rose',
    },
    'ikejo-jiten': {
      primary: 'slate',
      bg: 'bg-slate-50',
      text: 'text-slate-600',
      accent: 'slate-200',
      authorLabel: '辞典',
      authorColor: 'text-slate-500',
      prose: 'prose-slate',
    },
    amolab: {
      primary: 'pink',
      bg: 'bg-pink-50',
      text: 'text-pink-500',
      accent: 'pink-200',
      authorLabel: 'アモラボ',
      authorColor: 'text-pink-400',
      prose: 'prose-pink',
    },
    'amolab-jiten': {
      primary: 'slate',
      bg: 'bg-slate-50',
      text: 'text-slate-600',
      accent: 'slate-200',
      authorLabel: '女風辞典',
      authorColor: 'text-slate-500',
      prose: 'prose-slate',
    },
  };

  const theme = themes[category];
  const publishDate = new Date(article.published_at || article.created_at);
  const formattedDate = publishDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white">
      <article className="mx-auto max-w-[740px] px-5 py-12 md:py-20">
        {/* 記事ヘッダー */}
        <header className="mb-10 md:mb-16">
          <h1 className="mb-8 text-[28px] font-bold leading-[1.4] tracking-tight text-[#222] md:text-[34px]">
            {article.title}
          </h1>

          <div className="flex items-center justify-between border-b border-gray-100 pb-8">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ${theme.bg} ring-2 ring-gray-50`}
              >
                <span className={`text-[10px] font-extrabold ${theme.authorColor} uppercase`}>
                  {theme.authorLabel}
                </span>
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#222]">
                  {article.author_name || '編集部'}
                </div>
                <div className="text-[12px] text-gray-400">{formattedDate}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400">
              <button className="transition-colors hover:text-gray-600">
                <Share2Icon size={18} />
              </button>
              <button className="transition-colors hover:text-gray-600">
                <BookmarkIcon size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* サムネイル */}
        {article.thumbnail_url && (
          <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image
              src={article.thumbnail_url}
              alt={
                article.slug === 'jyosei-fuzoku-guide'
                  ? '女性用風俗とは？仕組み・料金の相場・当日の流れを初めての方向けに解説'
                  : article.title
              }
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* 結論・まとめボックス (辞典用) */}
        {category === 'ikejo-jiten' && article.excerpt && (
          <div className="mb-12 rounded-2xl border-l-4 border-slate-400 bg-slate-50 p-8 shadow-sm">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Conclusion / 結論
            </div>
            <p className="text-lg font-bold leading-relaxed text-slate-700">{article.excerpt}</p>
          </div>
        )}

        {/* 本文 */}
        <style jsx global>{`
          .prose {
            color: #292929;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 2.0;
            letter-spacing: 0.02em;
          }
          .prose p {
            margin-top: 1.8em;
            margin-bottom: 1.8em;
            font-size: 1.0625rem;
          }
          .prose a {
            color: #e11d48;
            font-weight: 600;
            text-decoration: underline;
            text-decoration-color: rgba(225, 29, 72, 0.3);
            text-underline-offset: 4px;
            transition: all 0.2s ease;
          }
          .prose a:hover {
            color: #be123c;
            text-decoration-color: #be123c;
          }
          /* Hide redundant hero header inside content if present */
          .prose .hero {
            display: none !important;
          }
          .prose h2 {
            position: relative;
            font-size: 1.5rem;
            font-weight: 800;
            color: #111827;
            margin-top: 3.5rem;
            margin-bottom: 1.5rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid #fda4af;
            letter-spacing: -0.01em;
          }
          .prose h2 .h2-en {
            display: block;
            font-size: 0.75rem;
            font-weight: 700;
            color: #f43f5e;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 0.25rem;
          }
          .prose h3 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1f2937;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            padding-left: 0.75rem;
            border-left: 4px solid #f43f5e;
          }
          .prose .pull {
            position: relative;
            margin: 2.5rem 0;
            padding: 1.75rem 2rem;
            background: linear-gradient(135deg, #fff5f7 0%, #fff0f3 100%);
            border-radius: 1rem;
            border-left: 4px solid #f43f5e;
            font-size: 1.125rem;
            font-weight: 700;
            color: #881337;
            line-height: 1.75;
            box-shadow: 0 4px 15px -3px rgba(244, 63, 94, 0.07);
          }
          .prose .pull::before {
            content: "“";
            position: absolute;
            top: 0.25rem;
            right: 1.25rem;
            font-size: 4rem;
            color: rgba(244, 63, 94, 0.15);
            font-family: serif;
            line-height: 1;
          }
          .prose .memo {
            margin: 2.5rem 0;
            padding: 1.5rem 1.75rem;
            background: #fff8f8;
            border: 1px solid #ffe4e6;
            border-radius: 1rem;
            color: #4b5563;
            box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          }
          .prose .memo h2, .prose .memo h3 {
            margin-top: 0;
            padding: 0;
            border: none;
            font-size: 1.125rem;
            color: #e11d48;
          }
          .prose figure.comic {
            margin: 2.5rem 0;
            text-align: center;
          }
          .prose figure.comic img {
            border-radius: 1rem;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
            margin: 0 auto 0.75rem auto;
          }
          .prose figure.comic figcaption {
            font-size: 0.8125rem;
            color: #6b7280;
            margin-top: 0.5rem;
          }
          .prose .comic-strip {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin: 2.5rem 0;
          }
          @media (min-width: 640px) {
            .prose .comic-strip {
              grid-template-columns: 1fr 1fr;
            }
          }
          .prose .profile {
            margin: 3rem 0;
            padding: 2rem;
            background: #ffffff;
            border: 1px solid #fecdd3;
            border-radius: 1.25rem;
            box-shadow: 0 8px 30px rgba(244, 63, 94, 0.06);
          }
          .prose .profile h3 {
            margin-top: 0;
            padding-left: 0;
            border-left: none;
            font-size: 1.25rem;
            color: #9f1239;
            border-bottom: 1px solid #ffe4e6;
            padding-bottom: 0.75rem;
            margin-bottom: 1.25rem;
            text-align: center;
          }
          .prose .profile dl {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.75rem;
            margin: 0;
          }
          @media (min-width: 640px) {
            .prose .profile dl {
              grid-template-columns: 140px 1fr;
              row-gap: 1rem;
            }
          }
          .prose .profile dt {
            font-weight: 700;
            color: #be123c;
            font-size: 0.875rem;
          }
          .prose .profile dd {
            margin-left: 0;
            color: #374151;
            font-size: 0.9375rem;
          }
          .prose .related {
            margin: 3rem 0;
            padding: 1.75rem;
            background: #fbfbfb;
            border: 1px solid #f3f4f6;
            border-radius: 1.25rem;
          }
          .prose .related h2 {
            margin-top: 0;
            border: none;
            font-size: 1.125rem;
            color: #111827;
            padding-bottom: 0;
            margin-bottom: 1rem;
          }
          .prose .related ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .prose .related li {
            margin: 0;
            padding: 1.25rem;
            background: #ffffff;
            border: 1px solid #f1f5f9;
            border-radius: 1rem;
            transition: all 0.25s ease;
            box-shadow: 0 2px 6px rgba(0,0,0,0.02);
          }
          .prose .related li:hover {
            border-color: #fda4af;
            box-shadow: 0 6px 20px rgba(244, 63, 94, 0.1);
            transform: translateY(-2px);
          }
          .prose .related a {
            font-weight: 700;
            color: #111827;
            text-decoration: none;
            font-size: 1rem;
            display: block;
          }
          .prose .related a:hover {
            color: #e11d48;
          }
          .prose .related .why {
            display: block;
            font-size: 0.8125rem;
            color: #64748b;
            margin-top: 0.35rem;
            font-weight: 400;
          }
          .prose .cta {
            margin: 3.5rem 0;
            padding: 2.5rem 2rem;
            background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
            border-radius: 1.5rem;
            text-align: center;
            box-shadow: 0 10px 30px -5px rgba(244, 63, 94, 0.12);
          }
          .prose .cta h3 {
            margin: 0 0 0.75rem 0;
            padding: 0;
            border: none;
            font-size: 1.25rem;
            color: #881337;
          }
          .prose .cta p {
            font-size: 0.9375rem;
            color: #9f1239;
            margin-bottom: 1.5rem;
          }
          .prose .cta .btn {
            display: inline-block;
            padding: 1rem 2.25rem;
            background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
            color: #ffffff !important;
            font-weight: 700;
            font-size: 1rem;
            border-radius: 9999px;
            text-decoration: none !important;
            box-shadow: 0 4px 15px rgba(225, 29, 72, 0.35);
            transition: all 0.25s ease;
          }
          .prose .cta .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(225, 29, 72, 0.45);
          }
          .prose .cta .micro {
            display: block;
            font-size: 0.6875rem;
            color: #fda4af;
            margin-top: 0.75rem;
          }
          .prose .sep {
            text-align: center;
            margin: 44px 0;
            color: #D4B5A8;
            font-size: 20px;
            letter-spacing: 0.5em;
          }
          .prose .personal-note {
            background: #FDF8F5;
            border: 1px solid #EDD9CE;
            border-radius: 12px;
            padding: 22px 24px;
            margin: 32px 0;
            font-size: 15px;
            color: #5A3E36;
            line-height: 2;
          }
          .prose .personal-note .note-header {
            font-size: 12px;
            color: #C4856A;
            margin-bottom: 10px;
            font-weight: 500;
            letter-spacing: 0.06em;
          }
          .prose .step-list { list-style: none; margin: 8px 0 24px; padding: 0; }
          .prose .step-list li {
            padding: 16px 0;
            border-bottom: 1px dashed #E8E4DF;
            display: flex;
            gap: 14px;
            align-items: flex-start;
          }
          .prose .step-list li:last-child { border-bottom: none; }
          .prose .step-num {
            font-family: 'Noto Serif JP', serif;
            font-size: 20px;
            color: #E0A090;
            line-height: 1.4;
            flex-shrink: 0;
            width: 24px;
          }
          .prose .step-body { flex: 1; }
          .prose .step-title {
            font-weight: 500 !important;
            font-size: 15px !important;
            color: #2E2020 !important;
            margin-bottom: 4px !important;
            margin-top: 0 !important;
          }
          .prose .step-desc { font-size: 14px; color: #6E5A55; line-height: 1.85; }
          .prose blockquote {
            background: #FFF6F2 !important;
            border-left: 3px solid #E8B9A8 !important;
            color: #6B4E44 !important;
          }
          .prose blockquote cite {
            display: block;
            margin-top: 10px;
            font-size: 12px;
            color: #B08070;
            font-style: normal;
          }
        `}</style>
        <div
          className={`prose prose-lg ${theme.prose} max-w-none leading-[1.85] tracking-[0.02em] text-[#333] prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#222] prose-h2:mb-8 prose-h2:mt-16 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-4 prose-h2:text-[24px] prose-h3:mb-6 prose-h3:mt-12 prose-h3:text-[20px] prose-p:mb-8 prose-p:mt-0 prose-blockquote:my-10 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:not-italic prose-img:my-10 prose-img:rounded-xl prose-a:text-${theme.primary}-500 prose-a:underline prose-a:underline-offset-4 prose-li:my-2`}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* タグ */}
        <div className="mt-16 flex flex-wrap gap-2">
          {article.tags?.map((t: any) => (
            <Link
              key={t.tag.id}
              href={`${baseUrl}?tag=${t.tag.name}`}
              className="rounded-full bg-gray-100 px-4 py-1.5 text-[12px] font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              #{t.tag.name}
            </Link>
          ))}
        </div>

        {/* アクション */}
        <div className="mt-16 border-y border-gray-100 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                className={`flex items-center gap-2 text-[14px] font-medium text-gray-500 hover:text-${theme.primary}-500 transition-colors`}
              >
                <HeartIcon size={20} />
                <span>スキ</span>
              </button>
              <button className="flex items-center gap-2 text-[14px] font-medium text-gray-500 transition-colors hover:text-gray-800">
                <MessageCircleIcon size={20} />
                <span>コメント</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 transition-colors hover:text-gray-600">
                <Share2Icon size={20} />
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* プロフィール */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-[740px] px-5 text-center">
          <div
            className={`mx-auto mb-6 h-20 w-20 overflow-hidden rounded-full ${theme.bg} shadow-sm ring-4 ring-white`}
          >
            <span
              className={`flex h-full w-full items-center justify-center font-bold ${theme.authorColor} text-xl uppercase`}
            >
              {theme.authorLabel}
            </span>
          </div>
          <h3 className="mb-4 text-lg font-bold text-gray-800">
            {article.author_name || '編集部'}
          </h3>
          <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-gray-500">
            ご覧いただきありがとうございます。皆様に役立つ情報を定期的にお届けしています。
          </p>
          <button
            className={`rounded-full border border-${theme.primary}-200 px-8 py-2.5 text-sm font-bold text-${theme.primary}-500 transition-all hover:bg-${theme.primary}-500 hover:text-white`}
          >
            フォローする
          </button>
        </div>
      </section>

      {/* おすすめ */}
      <section className="bg-white py-20 pb-40">
        <div className="mx-auto max-w-[1000px] px-5 text-center">
          <h3 className="mb-12 text-[20px] font-bold text-gray-800">こちらの記事もおすすめ</h3>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {relatedArticles.map((ra: any) => (
              <Link key={ra.id} href={`${baseUrl}/${ra.slug}`} className="group block text-left">
                <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-gray-50">
                  {ra.thumbnail_url && (
                    <Image
                      src={ra.thumbnail_url}
                      alt={ra.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="line-clamp-2 text-[15px] font-bold leading-[1.5] text-gray-800 transition-colors group-hover:text-pink-500">
                  {ra.title}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-16">
            <Link
              href={baseUrl}
              className="inline-flex items-center gap-2 rounded-full bg-gray-800 px-10 py-3.5 text-sm font-bold text-white transition-all hover:bg-gray-700"
            >
              <ChevronLeftIcon size={16} /> 記事一覧に戻る
            </Link>
          </div>
        </div>
      </section>

      {/* 固定ナビ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 px-6 py-4 shadow-lg backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between">
          <Link
            href={baseUrl}
            className="flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-pink-500"
          >
            <ChevronLeftIcon size={16} /> 記事一覧
          </Link>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-gray-400 transition-colors hover:text-pink-500">
              <HeartIcon size={20} />
              <span className="hidden text-[12px] font-bold sm:inline">スキ</span>
            </button>
            <div className="h-4 w-[1px] bg-gray-200"></div>
            <button className="flex items-center gap-2 text-gray-400 transition-colors hover:text-gray-800">
              <Share2Icon size={20} />
            </button>
          </div>

          {relatedArticles[0] && (
            <Link
              href={`${baseUrl}/${relatedArticles[0].slug}`}
              className={`flex items-center gap-3 rounded-lg ${theme.bg} p-2 pl-4 transition-all hover:opacity-80`}
            >
              <div className="hidden text-right sm:block">
                <div className={`text-[9px] font-bold ${theme.accent} uppercase tracking-tighter`}>
                  Next
                </div>
                <div className={`text-[11px] font-bold ${theme.text} line-clamp-1 max-w-[150px]`}>
                  {relatedArticles[0].title}
                </div>
              </div>
              <div className="h-8 w-8 overflow-hidden rounded-md bg-white">
                {relatedArticles[0].thumbnail_url && (
                  <Image
                    src={relatedArticles[0].thumbnail_url}
                    alt=""
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                )}
              </div>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
