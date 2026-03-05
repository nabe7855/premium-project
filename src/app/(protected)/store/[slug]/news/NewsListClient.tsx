'use client';

import { PageData } from '@/components/admin/news/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface NewsListClientProps {
  news: PageData[];
  storeSlug: string;
}

const CATEGORIES = [
  { id: 'all', label: '全て' },
  { id: 'info', label: 'お知らせ' },
  { id: 'promo', label: 'プロモーション' },
  { id: 'event', label: 'イベント' },
  { id: 'media', label: 'メディア' },
  { id: 'twitcasting', label: 'ツイキャス' },
];

const ITEMS_PER_PAGE = 10;

export default function NewsListClient({ news, storeSlug }: NewsListClientProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // カテゴリ分けのロジック（実際にはPageDataに属性がないためタイトルや他から推測するか、全てお知らせとする）
  const getCategoryLabel = (item: PageData) => {
    if (item.title.includes('イベント')) return 'event';
    if (item.title.includes('メディア') || item.title.includes('出演')) return 'media';
    if (item.title.includes('ツイキャス')) return 'twitcasting';
    if (item.title.includes('キャンペーン')) return 'promo';
    return 'info';
  };

  const filteredNews = news.filter((item) => {
    if (activeCategory === 'all') return true;
    return getCategoryLabel(item) === activeCategory;
  });

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const currentNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const featuredNews = currentNews.length > 0 ? currentNews[0] : null;

  return (
    <div className="min-h-screen bg-[#fffafa] pb-20 pt-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Title Area (Sweet Dot style ribbon) */}
        <div className="mb-16 flex flex-col items-center">
          <div className="relative flex w-full max-w-2xl items-center justify-center px-12 py-4">
            <div className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-slate-200"></div>
            <div className="relative z-10 bg-[#fffafa] px-6 text-center">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                News & Topics
              </span>
              <div className="relative inline-block border-y-2 border-slate-700 bg-white px-12 py-3">
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 transform text-xs text-slate-300">
                  ◆
                </span>
                <h1 className="text-2xl font-bold tracking-[0.2em] text-slate-800 md:text-3xl">
                  ニュース
                </h1>
                <span className="absolute -right-3 top-1/2 -translate-y-1/2 transform text-xs text-slate-300">
                  ◆
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Banner (Most recent post) */}
        {featuredNews && currentPage === 1 && activeCategory === 'all' && (
          <div className="mb-12">
            <Link href={`/store/${storeSlug}/news/${featuredNews.slug}`} className="group block">
              <div className="relative aspect-[16/8] overflow-hidden rounded-2xl border-4 border-white shadow-xl md:aspect-[21/9]">
                <NextImage
                  src={
                    featuredNews.thumbnailUrl ||
                    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={featuredNews.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 text-center text-white md:p-10">
                  <h2 className="text-xl font-bold leading-tight drop-shadow-lg md:text-3xl">
                    {featuredNews.title}
                  </h2>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-12 flex flex-wrap justify-center gap-2 border-y border-slate-100 py-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setCurrentPage(1);
              }}
              className={`min-w-[100px] rounded border py-2 text-[11px] font-bold tracking-wider transition-all md:min-w-[120px] md:text-xs ${
                activeCategory === cat.id
                  ? 'border-primary bg-primary text-white shadow-md'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-primary hover:text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* News Grid (Two columns) */}
        <div className="mb-20 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
          {currentNews.map((item) => (
            <div key={item.id} className="group flex flex-col">
              <Link
                href={`/store/${storeSlug}/news/${item.slug}`}
                className="relative mb-5 block aspect-video overflow-hidden rounded-xl border-4 border-white bg-slate-100 shadow-md transition-all group-hover:-translate-y-1 group-hover:shadow-lg"
              >
                <NextImage
                  src={
                    item.thumbnailUrl ||
                    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute left-4 top-4 rounded-sm bg-primary/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
                  {CATEGORIES.find((c) => c.id === getCategoryLabel(item))?.label || 'お知らせ'}
                </div>
              </Link>
              <div className="flex flex-grow flex-col">
                <Link href={`/store/${storeSlug}/news/${item.slug}`} className="mb-3 block">
                  <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-800 transition-colors group-hover:text-primary md:text-lg">
                    {item.title}
                  </h3>
                </Link>
                <p className="mb-5 line-clamp-3 text-xs leading-relaxed text-slate-500">
                  {item.shortDescription ||
                    '詳細については記事をチェックして、最新の情報を手に入れましょう。'}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <time className="text-[10px] font-bold tracking-[0.2em] text-slate-400">
                    {new Date(item.updatedAt)
                      .toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })
                      .replace(/\//g, '.')}
                  </time>
                  <Link
                    href={`/store/${storeSlug}/news/${item.slug}`}
                    className="inline-flex items-center rounded bg-[#b89c4d] px-8 py-2.5 text-[10px] font-bold tracking-wider text-white shadow-sm transition-all hover:bg-[#a58b45] hover:shadow-md"
                  >
                    全文表示
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination (Circles) */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 text-slate-300 transition-colors hover:text-primary disabled:opacity-20"
            >
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-3">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold tracking-widest transition-all ${
                    currentPage === i + 1
                      ? 'bg-primary text-white shadow-lg'
                      : 'border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-primary hover:text-primary'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 text-slate-300 transition-colors hover:text-primary disabled:opacity-20"
            >
              <ChevronRight size={28} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
