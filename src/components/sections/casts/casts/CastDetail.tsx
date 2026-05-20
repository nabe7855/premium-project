'use client';

import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronRight,
  Heart,
  MessageCircle,
  Play,
  Share2,
  User,
} from 'lucide-react';
import Link from 'next/link';
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
  storeSlug: string;
  storeId?: string;
  interviewUrl?: string | null;
  interviewArticles?: { title: string; url: string; thumbnailUrl: string | null; volNumber: number | null }[];
}

const CastDetail: React.FC<CastDetailProps> = ({ cast, storeSlug, storeId, interviewUrl, interviewArticles = [] }) => {
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

      {/* ✨ インタビューバナーエリア: 1本→明るいバナー、、2本以上→横スクロールカードストリップ */}
      {interviewArticles.length > 0 && (
        <div className="mx-auto max-w-4xl px-4 py-2 mt-4">
          {interviewArticles.length === 1 ? (
            /* --- 単一記事: 明るいピンクグラデーションバナー --- */
            <Link
              href={interviewArticles[0].url}
              className="group relative flex flex-col overflow-hidden rounded-2xl p-5 text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl md:flex-row md:items-center md:justify-between"
              style={{ background: 'linear-gradient(135deg, #E8567A 0%, #f4a0b5 50%, #fbc8d6 100%)' }}
            >
              {/* 装飾光エフェクト */}
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/20 blur-3xl transition-opacity duration-500 group-hover:bg-white/30" />
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-inner backdrop-blur-sm">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-black tracking-[0.2em] text-white/80 uppercase">
                    Exclusive Interview
                  </span>
                  <h4 className="mt-0.5 font-serif text-base font-bold tracking-wider text-white md:text-lg">
                    {cast.name}の素顏に迫る独占インタビュー公開中
                  </h4>
                  <p className="mt-1 text-[11px] text-white/80">
                    普段の接客やプロフィールだけでは見えない、彼の人柄や想いをお届けします。
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-bold text-[#E8567A] shadow-md transition-colors duration-300 group-hover:bg-[#c94065] group-hover:text-white md:mt-0 flex-shrink-0">
                <span>インタビュー記事を読む</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          ) : (
            /* --- 複数記事: 横スクロールカードストリップ --- */
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full flex-shrink-0" style={{ background: 'linear-gradient(135deg, #E8567A, #f4a0b5)' }}>
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <span className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: '#E8567A' }}>Exclusive Interview</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
                {interviewArticles.map((art, idx) => (
                  <Link
                    key={idx}
                    href={art.url}
                    className="group flex-shrink-0 w-[200px] md:w-[240px] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    {/* サムネイル */}
                    <div className="relative aspect-[4/3] overflow-hidden" style={{ background: '#fce8ed' }}>
                      {art.thumbnailUrl ? (
                        <img
                          src={art.thumbnailUrl}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-10 w-10" style={{ color: '#E8567A', opacity: 0.4 }} />
                        </div>
                      )}
                      {art.volNumber != null && (
                        <span className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow" style={{ background: '#E8567A' }}>
                          Vol.{art.volNumber}
                        </span>
                      )}
                    </div>
                    {/* テキスト */}
                    <div className="p-3 bg-white">
                      <p className="text-xs font-bold leading-snug line-clamp-2" style={{ color: '#1a1a1a' }}>{art.title}</p>
                      <span className="mt-2 flex items-center text-[10px] font-bold" style={{ color: '#E8567A' }}>
                        記事を読む <ChevronRight className="h-3 w-3 ml-0.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
