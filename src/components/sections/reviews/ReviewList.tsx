'use client';

import React, { useState, useEffect, useRef } from 'react';
import EmotionFilter from '@/components/sections/reviews/EmotionFilter';
import ReviewCard from '@/components/sections/reviews/ReviewCard';
import { Review } from '@/types/review';
import { getReviewsByStore } from '@/lib/getReviewsByStore';
import { useInfiniteQuery } from '@tanstack/react-query';

interface ReviewListProps {
  storeSlug: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ storeSlug }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');

  // ✅ 無限スクロールでレビュー取得
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['reviews', storeSlug, selectedEmotion],
    queryFn: ({ pageParam = 0 }) => {
      console.log('📡 fetch reviews pageParam:', pageParam);
      return getReviewsByStore(storeSlug, { limit: 20, offset: pageParam });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      console.log('📄 getNextPageParam lastPage.reviews:', lastPage?.reviews?.length);

      if (!lastPage || lastPage.reviews.length < 20) {
        console.log('⛔ データが20件未満、次ページなし');
        return undefined;
      }

      const nextOffset = allPages.length * 20;
      console.log('➡️ 次の offset:', nextOffset);
      return nextOffset;
    },
  });

  // ✅ 全レビュー配列に変換
  const reviews: Review[] = data?.pages.flatMap((p) => p.reviews) ?? [];
  const totalCount: number = data?.pages[0]?.totalCount ?? 0;

  console.log('📝 reviews 総数:', reviews.length, ' / totalCount:', totalCount);

  // ✅ 無限スクロール用のref
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) {
      console.log('⚠️ loadMoreRef が null');
      return;
    }

    console.log('👀 IntersectionObserver 設定開始');

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log('🔥 loadMoreRef が画面に入った');
          if (hasNextPage) {
            console.log('➡️ fetchNextPage 実行');
            fetchNextPage();
          } else {
            console.log('⛔ hasNextPage が false のため何もしない');
          }
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 200px 0px', // 少し手前で発火
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      console.log('🧹 IntersectionObserver クリーンアップ');
      observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage]);

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion === selectedEmotion ? '' : emotion);
  };

  if (status === 'pending') {
    return <p className="text-center text-gray-500 py-12">読み込み中...</p>;
  }

  return (
    <section className="mb-8">
      <EmotionFilter
        onEmotionSelect={handleEmotionSelect}
        selectedEmotion={selectedEmotion}
        onSortChange={(sort) => console.log('ソート:', sort)}
        onTagChange={(tag) => console.log('タグ:', tag)}
        tags={[]} // TODO: APIから取得するならここに渡す
      />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          口コミ一覧
          <span className="ml-2 text-lg font-normal text-gray-600">
            ({reviews.length} / {totalCount}件)
          </span>
        </h2>
      </div>

      {/* レビュー一覧 */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, idx) => (
            <ReviewCard key={`${review.id}-${idx}`} review={review} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-600">
            選択した条件に該当する口コミが見つかりませんでした。
          </p>
          <button
            onClick={() => setSelectedEmotion('')}
            className="rounded-lg bg-pink-500 px-6 py-2 text-white transition-colors hover:bg-pink-600"
          >
            すべての口コミを表示
          </button>
        </div>
      )}

      {/* 無限スクロールのトリガー */}
      <div ref={loadMoreRef} className="h-10 bg-yellow-100" />
      {isFetchingNextPage && (
        <p className="text-center text-gray-500 py-4">さらに読み込み中...</p>
      )}
    </section>
  );
};

export default ReviewList;
