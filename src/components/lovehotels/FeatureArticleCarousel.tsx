'use client';

import { MOCK_FEATURES } from '@/data/lovehotels';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';

interface FeatureArticleCarouselProps {
  slug: string;
}

export default function FeatureArticleCarousel({ slug }: FeatureArticleCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const latestFeatures = MOCK_FEATURES.slice(0, 3);

  return (
    <section className="bg-gradient-to-br from-rose-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header with View All Button */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900">
              <span className="mr-2 text-rose-500">Feature</span>
              <span className="text-sm font-bold text-gray-500">特集記事</span>
            </h2>
            <p className="mt-2 text-gray-600">最新のホテル特集をチェック！</p>
          </div>
          <Link
            href={`/store/${slug}/hotel/features`}
            className="hidden rounded-full border border-rose-200 bg-white px-6 py-2 text-sm font-bold text-rose-500 transition-colors hover:bg-rose-50 md:block"
          >
            掲載記事一覧
          </Link>
        </div>

        {/* Carousel */}
        <div className="group relative">
          <div className="overflow-hidden rounded-2xl shadow-xl" ref={emblaRef}>
            <div className="flex">
              {latestFeatures.map((article) => (
                <div
                  key={article.id}
                  className="min-w-0 flex-[0_0_100%] pl-4 first:pl-0 md:flex-[0_0_50%] lg:flex-[0_0_33.33%]"
                >
                  <Link
                    href={`/store/${slug}/hotel/features/${article.id}`}
                    className="group/card block h-full"
                  >
                    <div className="relative h-64 overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <NextImage
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="mb-2 flex flex-wrap gap-2">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 rounded-full bg-rose-500/80 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm"
                            >
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="line-clamp-2 text-lg font-bold text-white drop-shadow-md">
                          {article.title}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-xs text-gray-300">{article.summary}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 text-gray-800 shadow-lg transition-all hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50 md:-left-6"
            onClick={scrollPrev}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 text-gray-800 shadow-lg transition-all hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50 md:-right-6"
            onClick={scrollNext}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href={`/store/${slug}/hotel/features`}
            className="inline-block rounded-full bg-rose-500 px-8 py-3 text-sm font-bold text-white shadow-lg transition-transform active:scale-95"
          >
            すべての特集を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
