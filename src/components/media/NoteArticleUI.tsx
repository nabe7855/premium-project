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
      authorLabel: '辞典',
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
              alt={article.title}
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
