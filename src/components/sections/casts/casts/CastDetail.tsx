'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Share2,
  User,
  BookOpen,
  Calendar,
  MessageCircle,
  Play,
} from 'lucide-react';

import { Cast, Review, CastProfile as CastProfileType } from '@/types/cast';
import { getReviewsByCastId } from '@/data/services/castService';
import { getCastProfile } from '@/lib/getCastProfile'; // ← 追加
import { useCastDetail } from '@/hooks/useCastDetail';

import BookingModal from '../modals/BookingModal';
import ReviewModal from '../modals/ReviewModal';
import CastGallery from './detail/CastGallery';
import CastProfile from './detail/CastProfile';
import CastStickyActionBar, { TabType } from './detail/CastStickyActionBar';
import CastTabBasicInformation from './detail/CastTabBasicInformation';
import CastTabStory from './detail/CastTabStory';
import CastTabSchedule from './detail/CastTabSchedule';
import CastTabReviews from './detail/CastTabReviews';
import CastTabMovie from './detail/CastTabMovie';

interface CastDetailProps {
  cast: Cast;
}

const CastDetail: React.FC<CastDetailProps> = ({ cast }) => {
  const router = useRouter();
  const [castProfile, setCastProfile] = useState<CastProfileType | null>(null);
  const [castReviews, setCastReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const {
    activeTab,
    setActiveTab,
    selectedImage: currentImageIndex,
    setSelectedImage: setCurrentImageIndex,
    isSticky,
    actionBarRef,
    isBookingModalOpen,
    isReviewModalOpen,
    handleBookingModalOpen,
    handleBookingModalClose,
    handleReviewModalOpen,
    handleReviewModalClose,
  } = useCastDetail();

  // ✅ プロフィール取得
  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getCastProfile(cast.id);
      setCastProfile(profile);
    };
    fetchProfile();
  }, [cast.id]);

  // ✅ レビュー取得
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

  // ✅ タブ
  const tabs: { id: TabType; label: string; icon: any; count?: number }[] = [
    { id: 'basic', label: '基本情報', icon: User },
    { id: 'story', label: 'ストーリー', icon: BookOpen },
    { id: 'schedule', label: 'スケジュール', icon: Calendar },
    { id: 'reviews', label: '口コミ', icon: MessageCircle, count: castReviews.length },
    { id: 'videos', label: '動画', icon: Play },
  ];

  const handleBack = (): void => {
    router.back();
  };

  // ✅ ギャラリー用画像配列（暫定）
  const allImages: string[] = [
    cast.mainImageUrl ?? cast.imageUrl ?? '/no-image.png',
  ];

  const handleDragEnd = (_: unknown, info: any): void => {
    const swipeThreshold = 50;
    const swipeVelocityThreshold = 500;

    if (
      Math.abs(info.offset.x) > swipeThreshold ||
      Math.abs(info.velocity.x) > swipeVelocityThreshold
    ) {
      if (info.offset.x > 0) {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      } else {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm">戻る</span>
            </button>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-neutral-600 hover:text-red-500">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-neutral-600 hover:text-neutral-800">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ギャラリー */}
      <CastGallery
        castName={cast.name}
        allImages={allImages}
        currentImageIndex={currentImageIndex}
        onImageChange={setCurrentImageIndex}
        onDragEnd={handleDragEnd}
      />

      {/* プロフィール */}
      <CastProfile cast={cast} />

      {/* アクションバー */}
      <div ref={actionBarRef}>
        <CastStickyActionBar
          isSticky={isSticky}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onBookingOpen={handleBookingModalOpen}
          onDiaryClick={() => alert('写メ日記ページに遷移します')}
          onSNSClick={() => alert('SNSページに遷移します')}
        />
      </div>

      {/* タブコンテンツ */}
      <div className={`px-4 py-6 ${isSticky ? 'mt-[112px] sm:mt-32' : ''}`}>
        {activeTab === 'basic' && castProfile && (
          <CastTabBasicInformation cast={castProfile} />
        )}
        {activeTab === 'story' && <CastTabStory cast={cast} />}
        {activeTab === 'schedule' && (
          <CastTabSchedule cast={cast} onBookingOpen={handleBookingModalOpen} />
        )}
        {activeTab === 'reviews' && (
          <CastTabReviews
            castReviews={castReviews}
            isLoadingReviews={isLoadingReviews}
            onReviewOpen={handleReviewModalOpen}
          />
        )}
        {activeTab === 'videos' && <CastTabMovie cast={cast} />}
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
