'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Cast, Review } from '@/types/caststypes';
import { getReviewsByCastId } from '@/data/services/castService';
import { useCastDetail } from '@/hooks/useCastDetail';
import BookingModal from '../modals/BookingModal';
import ReviewModal from '../modals/ReviewModal';
import { CastDetailTabs } from './detail/CastDetailTabs';

interface CastDetailProps {
  cast: Cast;
}

const CastDetail: React.FC<CastDetailProps> = ({ cast }) => {
  const router = useRouter();
  const [castReviews, setCastReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [activeTab, setActiveTab] = useState<'basic' | 'story' | 'schedule' | 'reviews' | 'videos'>(
    'basic',
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  const {
    isBookingModalOpen,
    isReviewModalOpen,
    handleBookingModalOpen,
    handleBookingModalClose,
    handleReviewModalOpen,
    handleReviewModalClose,
  } = useCastDetail();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const reviews = await getReviewsByCastId(cast.id);
        setCastReviews(reviews);
      } catch (error) {
        console.error('レビューデータの取得に失敗:', error);
        setCastReviews([]);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [cast.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current) {
        const galleryRect = galleryRef.current.getBoundingClientRect();
        const headerHeight = 80;
        setIsSticky(galleryRect.bottom <= headerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    router.back();
  };

  // 画像配列（アバター + 追加画像）
  const allImages = [cast.avatar, ...cast.images];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // ドラッグ終了時の処理
  const handleDragEnd = (_event: any, info: any) => {
    const swipeThreshold = 50;
    const swipeVelocityThreshold = 500;

    if (
      Math.abs(info.offset.x) > swipeThreshold ||
      Math.abs(info.velocity.x) > swipeVelocityThreshold
    ) {
      if (info.offset.x > 0) {
        prevImage();
      } else {
        nextImage();
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* モバイル用ヘッダー */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center text-neutral-600 transition-colors duration-200 hover:text-neutral-800"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              <span className="text-sm">戻る</span>
            </button>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-neutral-600 transition-colors duration-200 hover:text-red-500">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-neutral-600 transition-colors duration-200 hover:text-neutral-800">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* フォトギャラリー */}
      <div className="bg-white" ref={galleryRef}>
        <div className="relative">
          {/* メイン画像 */}
          <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 sm:aspect-[4/3] md:aspect-[16/10]">
            <motion.div
              className="h-full w-full cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <img
                src={allImages[currentImageIndex]}
                alt={`${cast.name}の写真 ${currentImageIndex + 1}`}
                className="h-full w-full select-none object-cover"
                draggable={false}
              />
            </motion.div>

            {/* 画像ナビゲーション */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-black/50 p-2 text-white transition-all duration-200 hover:bg-black/70"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-black/50 p-2 text-white transition-all duration-200 hover:bg-black/70"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* 画像インジケーター */}
                <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform space-x-2">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 w-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* サムネイル横スクロール */}
          {allImages.length > 1 && (
            <div className="p-4">
              <div className="scrollbar-hide flex space-x-2 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 sm:h-20 sm:w-20 ${
                      index === currentImageIndex
                        ? 'border-primary scale-105 shadow-md'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${cast.name}の写真 ${index + 1}`}
                      className="h-full w-full select-none object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>

              {/* スワイプヒント */}
              <div className="mt-2 text-center">
                <p className="text-xs text-neutral-500">
                  💡 画像を左右にスワイプして切り替えできます
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* プロフィール情報 */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="px-4 py-6">
          <div className="mb-4">
            <h1 className="mb-2 font-serif text-2xl font-bold text-neutral-800 sm:text-3xl">
              {cast.name}
            </h1>
            <p className="mb-4 text-base text-neutral-600 sm:text-lg">{cast.catchphrase}</p>

            <div className="mb-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-current text-amber-400" />
                <span className="text-sm font-semibold text-neutral-800">{cast.rating}</span>
                <span className="ml-1 text-sm text-neutral-600">({cast.reviewCount}件)</span>
              </div>
              <div className="text-sm text-neutral-600">{cast.age}歳</div>
              <div className="text-sm text-neutral-600">{cast.location}</div>
              <div
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  cast.isOnline ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {cast.isOnline ? '本日出勤' : 'お休み'}
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {cast.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary text-primary rounded-full px-2 py-1 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* 統計情報 */}
            <div className="mb-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-neutral-900">{cast.bookingCount}</div>
                <div className="text-sm text-neutral-600">予約数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900">{cast.responseRate}%</div>
                <div className="text-sm text-neutral-600">返信率</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900">{cast.responseTime}</div>
                <div className="text-sm text-neutral-600">返信時間</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleBookingModalOpen}
            className="bg-primary hover:bg-primary/90 w-full rounded-full py-3 text-sm font-medium text-white transition-colors duration-200 sm:text-base"
          >
            予約する
          </button>
        </div>
      </div>

      {/* タブコンテンツ */}
      <div className="px-4 py-6">
        <CastDetailTabs
          cast={cast}
          activeTab={activeTab}
          isSticky={isSticky}
          castReviews={castReviews}
          isLoadingReviews={isLoadingReviews}
          onTabChange={setActiveTab}
          onBookingOpen={handleBookingModalOpen}
          onReviewOpen={handleReviewModalOpen}
        />
      </div>

      {/* モーダル */}
      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          castName={cast.name}
          onClose={handleBookingModalClose}
        />
      )}

      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          castName={cast.name}
          onClose={handleReviewModalClose}
        />
      )}
    </div>
  );
};

export default CastDetail;
