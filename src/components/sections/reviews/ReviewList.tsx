'use client';

import React, { useState, useEffect, useRef } from 'react';
import EmotionFilter from '@/components/sections/reviews/EmotionFilter';
import ReviewCard from '@/components/sections/reviews/ReviewCard';
import { Review } from '@/types/review';
import { getReviewsByStore } from '@/lib/getReviewsByStore';
import { supabase } from '@/lib/supabaseClient';
import { useInfiniteQuery } from '@tanstack/react-query';

interface Cast {
  id: string;
  name: string;
}

interface ReviewListProps {
  storeSlug: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ storeSlug }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [selectedCastId, setSelectedCastId] = useState<string>('all');
  const [casts, setCasts] = useState<Cast[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // ✅ 店舗ごとの在籍キャスト一覧を取得
  useEffect(() => {
    const fetchCasts = async () => {
      const { data, error } = await supabase
        .from('casts')
        .select('id, name, cast_store_memberships(stores(slug))')
        .eq('cast_store_memberships.stores.slug', storeSlug)
        .eq('is_active', true);

      if (error) {
        console.error('❌ キャスト取得エラー:', error.message);
        return;
      }

      const mapped = (data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
      }));

      setCasts(mapped);
    };

    fetchCasts();
  }, [storeSlug]);

  // ✅ 無限スクロールでレビュー取得
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['reviews', storeSlug, selectedEmotion, selectedCastId],
    queryFn: ({ pageParam = 0 }) =>
      getReviewsByStore(storeSlug, {
        limit: 20,
        offset: pageParam,
        castId: selectedCastId !== 'all' ? selectedCastId : undefined,
      }),
    initialPageParam: 0,
    // ✅ 総件数を見て次があるか判定
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      const loaded = allPages.reduce((sum, p) => sum + p.reviews.length, 0);
      return loaded < lastPage.totalCount ? loaded : undefined;
    },
  });

  // ✅ 全レビュー配列に変換
  const reviews: Review[] = data?.pages.flatMap((p) => p.reviews) ?? [];
  const totalCount: number = data?.pages[0]?.totalCount ?? 0;

  // ✅ 無限スクロール用のref
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const target = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log('👀 IntersectionObserver 発火');
          if (hasNextPage) {
            console.log('📥 fetchNextPage 実行');
            fetchNextPage();
          } else {
            console.log('⛔ 次のページなし');
          }
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage, reviews.length]);

  // ✅ 初回ロード時にリストが短すぎる場合は強制追加ロード
  useEffect(() => {
    if (reviews.length < 5 && hasNextPage && !isFetchingNextPage) {
      console.log('⚡ レビューが少ないため追加ロード');
      fetchNextPage();
    }
  }, [reviews.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ✅ アニメーション付きで閉じる処理
  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsAnimatingOut(false);
      setIsSearchOpen(false);
    }, 300);
  };

  // ✅ フィルタ操作時に自動で閉じる
  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion === selectedEmotion ? '' : emotion);
    handleClose();
  };

  const handleCastChange = (castId: string) => {
    setSelectedCastId(castId);
    handleClose();
  };

  const handleSortChange = (sort: string) => {
    console.log('ソート:', sort);
    handleClose();
  };

  const handleTagChange = (tag: string) => {
    console.log('タグ:', tag);
    handleClose();
  };

  if (status === 'pending') {
    return <p className="text-center text-gray-500 py-12">読み込み中...</p>;
  }

  console.log('📊 reviews:', reviews.length, 'totalCount:', totalCount, 'hasNextPage:', hasNextPage);

  return (
    <section className="mb-8 relative">
      {/* ✅ フッターナビ上に浮遊する検索ボタン */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="fixed bottom-20 right-4 z-50 p-3 rounded-full bg-pink-500 text-white shadow-lg"
      >
        🔍
      </button>

      {/* ✅ スライドイン/アウトする検索パネル（常に画面の右半分） */}
{isSearchOpen && (
  <div
    className={`fixed top-0 right-0 h-[calc(100%-64px)] w-1/2 bg-white shadow-lg z-[9999] p-4 overflow-y-auto ${
      isAnimatingOut ? 'animate-slideOut' : 'animate-slideIn'
    }`}
    style={{ bottom: '64px' }} // フッターナビ分避ける
  >
    <button onClick={handleClose} className="mb-4 text-gray-600">
      ✕
    </button>

    <EmotionFilter
      onEmotionSelect={handleEmotionSelect}
      selectedEmotion={selectedEmotion}
      onSortChange={handleSortChange}
      onTagChange={handleTagChange}
      onCastChange={handleCastChange}
      tags={[]}
      casts={casts}
    />
  </div>
)}


      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          口コミ一覧
          <span className="ml-2 text-lg font-normal text-gray-600">
            ({reviews.length} / {totalCount}件)
          </span>
        </h2>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, idx) => (
            <ReviewCard key={`${review.id}-${idx}`} review={review} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-600">条件に合う口コミは見つかりませんでした。</p>
          <button
            onClick={() => {
              setSelectedEmotion('');
              setSelectedCastId('all');
            }}
            className="rounded-lg bg-pink-500 px-6 py-2 text-white hover:bg-pink-600"
          >
            すべての口コミを表示
          </button>
        </div>
      )}

      <div ref={loadMoreRef} className="h-10" />
      {isFetchingNextPage && (
        <p className="text-center text-gray-500 py-4">さらに読み込み中...</p>
      )}
    </section>
  );
};

export default ReviewList;
