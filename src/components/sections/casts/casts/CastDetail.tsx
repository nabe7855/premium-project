'use client';

import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Heart,
  MessageCircle,
  Play,
  Share2,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useCastDetail } from '@/hooks/useCastDetail';
import { Cast } from '@/types/cast';

import BookingModal from '../modals/BookingModal';
import CastGallery from './detail/CastGallery';
import CastProfile from './detail/CastProfile';
import CastStickyActionBar, { TabType } from './detail/CastStickyActionBar';
import CastTabBasicInformation from './detail/CastTabBasicInformation';
import CastTabMovie from './detail/CastTabMovie';
import CastTabSchedule from './detail/CastTabSchedule';
import CastTabStory from './detail/CastTabStory';

// 👇 口コミ投稿フォームを直 import
import CastTabReviewPage from './detail/CastTabReviews';

interface CastDetailProps {
  cast: Cast;
  storeSlug: string; // ✅ 追加
  storeId?: string; // ✅ 追加
}

const CastDetail: React.FC<CastDetailProps> = ({ cast, storeSlug, storeId }) => {
  const router = useRouter();

  const {
    activeTab,
    setActiveTab,
    selectedImage: currentImageIndex,
    setSelectedImage: setCurrentImageIndex,
    isSticky,
    actionBarRef,
    isBookingModalOpen,
    handleBookingModalOpen,
    handleBookingModalClose,
  } = useCastDetail();

  // ✅ タブ
  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'basic', label: '基本情報', icon: User },
    { id: 'story', label: 'ストーリー', icon: BookOpen },
    { id: 'schedule', label: 'スケジュール', icon: Calendar },
    { id: 'reviews', label: '口コミ投稿', icon: MessageCircle },
    { id: 'videos', label: '動画', icon: Play },
  ];

  const handleBack = (): void => {
    router.back();
  };

  // ✅ ギャラリー用画像配列
  const allImages: string[] =
    cast.galleryItems && cast.galleryItems.some(g => g.imageUrl)
      ? cast.galleryItems.filter(g => g.imageUrl).map((g) => g.imageUrl)
      : [cast.mainImageUrl || cast.imageUrl || '/cast-default.jpg'];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ヘッダー */}
      <div className="sticky top-[54px] z-40 border-b border-neutral-200 bg-white md:top-[65px]">
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
              <button className="p-2 text-neutral-600 hover:text-red-500">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-neutral-600 hover:text-neutral-800">
                <Share2 className="h-5 w-5" />
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
          onDiaryClick={() => router.push(`/store/${storeSlug}/diary/cast/${encodeURIComponent(cast.name)}`)}
          onSNSClick={() => {
            if (cast.snsUrl) {
              window.open(cast.snsUrl, '_blank', 'noopener,noreferrer');
            } else {
              alert('SNSリンクが登録されていません');
            }
          }}
        />
      </div>

      {/* タブコンテンツ */}
      <div className="px-4 py-6">
        {activeTab === 'basic' && <CastTabBasicInformation cast={cast} />}
        {activeTab === 'story' && <CastTabStory cast={cast} />}
        {activeTab === 'schedule' && (
          <CastTabSchedule cast={cast} onBookingOpen={handleBookingModalOpen} />
        )}
        {activeTab === 'reviews' && (
          <CastTabReviewPage castId={cast.id} castName={cast.name} storeSlug={storeSlug} />
        )}
        {activeTab === 'videos' && <CastTabMovie cast={cast} />}
      </div>

      {/* モーダル（予約だけ残す） */}
      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          castName={cast.name}
          castId={cast.id}
          storeId={storeId}
          onClose={handleBookingModalClose}
        />
      )}
    </div>
  );
};

export default CastDetail;
