'use client';

import { MOCK_FEATURES, MOCK_HOTELS } from '@/data/lovehotels';
import { ArrowLeft, Calendar, MapPin, Tag } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

export default function FeatureArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const articleId = params.articleId as string;

  const article = MOCK_FEATURES.find((f) => f.id === articleId);

  if (!article) {
    notFound();
  }

  const relatedHotels = MOCK_HOTELS.filter((h) => article.relatedHotelIds.includes(h.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Back Link */}
        <Link
          href={`/store/${slug}/hotel/features`}
          className="mb-8 inline-flex items-center gap-2 text-stone-300 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
          特集一覧に戻る
        </Link>

        {/* Article Header */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-stone-800/50 backdrop-blur-sm">
          {/* Hero Image */}
          <div className="relative h-64 md:h-96">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent" />
          </div>

          {/* Article Info */}
          <div className="p-8">
            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-rose-500/20 px-3 py-1.5 text-sm font-medium text-rose-300"
                >
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">{article.title}</h1>

            {/* Summary */}
            <p className="mb-4 text-lg text-stone-300">{article.summary}</p>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-stone-400">
              <Calendar size={16} />
              <span>{article.date}</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="mb-12 rounded-2xl bg-stone-800/50 p-8 backdrop-blur-sm">
          <div className="prose prose-invert max-w-none">
            <div
              className="whitespace-pre-line leading-relaxed text-stone-200"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>

        {/* Related Hotels */}
        {relatedHotels.length > 0 && (
          <div className="rounded-2xl bg-stone-800/50 p-8 backdrop-blur-sm">
            <h2 className="mb-6 text-2xl font-bold text-white">この記事で紹介しているホテル</h2>
            <div className="space-y-4">
              {relatedHotels.map((hotel) => (
                <Link
                  key={hotel.id}
                  href={`/store/${slug}/hotel/${hotel.area}/${hotel.id}`}
                  className="group flex gap-4 overflow-hidden rounded-xl bg-stone-700/50 p-4 transition-all hover:bg-stone-700"
                >
                  {/* Hotel Image */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>

                  {/* Hotel Info */}
                  <div className="flex-1">
                    <h3 className="mb-2 font-bold text-white group-hover:text-rose-300">
                      {hotel.name}
                    </h3>
                    <div className="mb-2 flex items-center gap-2 text-sm text-stone-400">
                      <MapPin size={14} />
                      <span>
                        {hotel.prefecture} {hotel.city} {hotel.area}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-stone-300">
                        休憩: ¥{hotel.minPriceRest.toLocaleString()}〜
                      </span>
                      <span className="text-stone-300">
                        宿泊: ¥{hotel.minPriceStay.toLocaleString()}〜
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
