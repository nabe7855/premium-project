'use client';

import { MOCK_FEATURES } from '@/data/lovehotels';
import { Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function HotelFeaturesPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Filter features by prefecture if needed
  const features = MOCK_FEATURES;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">ホテル特集記事</h1>
          <p className="text-lg text-stone-300">エリアごとの魅力的なホテルを厳選してご紹介</p>
        </div>

        {/* Feature Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((article) => (
            <Link
              key={article.id}
              href={`/store/${slug}/hotel/features/${article.id}`}
              className="group overflow-hidden rounded-2xl bg-stone-800/50 backdrop-blur-sm transition-all hover:scale-105 hover:bg-stone-800/70"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Tags */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-medium text-rose-300"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2 className="mb-2 line-clamp-2 text-xl font-bold text-white">{article.title}</h2>

                {/* Summary */}
                <p className="mb-4 line-clamp-2 text-sm text-stone-300">{article.summary}</p>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <Calendar size={14} />
                  <span>{article.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href={`/store/${slug}/hotel`}
            className="inline-flex items-center gap-2 rounded-full bg-stone-700/50 px-6 py-3 font-medium text-white transition-colors hover:bg-stone-700"
          >
            ← ホテル一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
