'use client';

import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronRight,
  Heart,
  Instagram,
  MessageCircle,
  Play,
  Share2,
  Twitter,
  User,
  X,
  Music,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { formatSnsUrl } from '@/lib/utils/sns-url';

import { useCastDetail } from '@/hooks/useCastDetail';
import { Cast } from '@/types/cast';

import { Review } from '@/types/review';
import ReviewCard from '@/components/sections/reviews/ReviewCard';
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
  initialReviews?: Review[];
  reviewCount?: number;
}

const CastDetail: React.FC<CastDetailProps> = ({
  cast,
  storeSlug,
  storeId,
  interviewUrl,
  interviewArticles = [],
  initialReviews = [],
  reviewCount = 0,
}) => {
  const router = useRouter();
  const [showAllReviews, setShowAllReviews] = React.useState(false);

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

  const [isSnsModalOpen, setIsSnsModalOpen] = React.useState(false);

  const displayReviews = showAllReviews ? initialReviews : initialReviews.slice(0, 5);

  // ✅ SNS情報取得ヘルパー（formatSnsUrlで404エラー防止）
  const getSnsList = React.useCallback(() => {
    const list: { name: string; url: string; icon: any; colorClass: string; rel?: string }[] = [];
    if (cast.sns?.line) {
      const formatted = formatSnsUrl(cast.sns.line, 'line');
      if (formatted) list.push({ name: 'LINE', url: formatted, icon: MessageCircle, colorClass: 'bg-[#06C755] text-white hover:opacity-95' });
    }
    if (cast.sns?.instagram) {
      const formatted = formatSnsUrl(cast.sns.instagram, 'instagram');
      if (formatted) list.push({ name: 'Instagram', url: formatted, icon: Instagram, colorClass: 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:opacity-95' });
    }
    if (cast.sns?.twitter) {
      const formatted = formatSnsUrl(cast.sns.twitter, 'twitter');
      if (formatted) list.push({ name: '𝕏 (Twitter)', url: formatted, icon: Twitter, colorClass: 'bg-black text-white hover:bg-neutral-800' });
    }
    if (cast.sns?.tiktok) {
      const formatted = formatSnsUrl(cast.sns.tiktok, 'tiktok');
      if (formatted) list.push({ name: 'TikTok', url: formatted, icon: Music, colorClass: 'bg-black text-white hover:bg-neutral-800' });
    }
    if (cast.questionBoxUrl && cast.questionBoxUrl.startsWith('https://')) {
      list.push({ name: '質問箱 (匿名Q&A)', url: cast.questionBoxUrl, icon: HelpCircle, colorClass: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-95', rel: 'noopener nofollow' });
    }
    if (list.length === 0 && cast.snsUrl) {
      const formatted = formatSnsUrl(cast.snsUrl, 'other');
      if (formatted) list.push({ name: '公式SNS', url: formatted, icon: Globe, colorClass: 'bg-neutral-800 text-white hover:bg-neutral-900' });
    }
    return list;
  }, [cast]);

  const handleSNSClick = React.useCallback(() => {
    const snsList = getSnsList();
    if (snsList.length === 0) {
      toast.info(`${cast.name}のSNSは現在未登録です`, {
        description: '出勤スケジュールや写メ日記をぜひチェックしてください💐',
        duration: 3500,
      });
      return;
    }
    // SNSが登録されている場合はSNS一覧モーダル（ボトムシート）を表示
    setIsSnsModalOpen(true);
  }, [cast, getSnsList]);

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
              <button 
                className="p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                onClick={async () => {
                  const url = window.location.href;
                  let copied = false;
                  try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      await navigator.clipboard.writeText(url);
                      copied = true;
                    } else {
                      const textArea = document.createElement('textarea');
                      textArea.value = url;
                      textArea.style.position = 'fixed';
                      textArea.style.opacity = '0';
                      document.body.appendChild(textArea);
                      textArea.focus();
                      textArea.select();
                      copied = document.execCommand('copy');
                      document.body.removeChild(textArea);
                    }
                  } catch (e) {
                    console.error('Copy failed:', e);
                  }

                  if (copied) {
                    toast.success('共有リンクをコピーしました');
                  }

                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: `${cast.name}のプロフィール | ストロベリーボーイズ`,
                        text: `出張ホスト ストロベリーボーイズ ${cast.name}のプロフィール`,
                        url: url,
                      });
                    } catch (error) {
                      // ユーザーキャンセル等は無視
                    }
                  }
                }}
                aria-label="プロフィールをシェアする"
              >
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
      <CastProfile cast={cast} storeSlug={storeSlug} />

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

      {/* 💬 口コミセクション (SSR) */}
      <section id="reviews" className="mx-4 my-8 scroll-mt-20 rounded-3xl border border-rose-100 bg-gradient-to-b from-rose-50/50 to-white p-6 shadow-sm md:scroll-mt-24 md:p-8">
        <h2 className="mb-6 flex items-center gap-2 font-serif text-xl font-bold text-gray-800 md:text-2xl">
          <MessageCircle className="h-6 w-6 text-pink-500 flex-shrink-0" />
          <span>{cast.name}さんへの口コミ({reviewCount}件)</span>
        </h2>

        {displayReviews.length > 0 ? (
          <div className="space-y-4">
            {displayReviews.map((rev) => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
            {initialReviews.length > 5 && !showAllReviews && (
              <button
                onClick={() => setShowAllReviews(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-pink-300 bg-white py-3.5 text-sm font-bold text-pink-600 shadow-sm transition-all hover:bg-pink-50 active:scale-[0.99]"
              >
                <span>口コミをもっと見る ({initialReviews.length - 5}件)</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-pink-200 bg-white p-6 text-center">
            <p className="mb-3 text-sm font-bold text-gray-700">まだ口コミはありません</p>
            <p className="mb-4 text-xs text-gray-500">ご予約・ご利用後に温かいメッセージをお寄せいただけると幸いです💐</p>
            <button
              onClick={() => setActiveTab('reviews')}
              className="inline-flex items-center gap-1.5 rounded-full bg-pink-500 px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-pink-600"
            >
              <MessageCircle className="h-4 w-4" />
              <span>最初の口コミを投稿する</span>
            </button>
          </div>
        )}

        <div className="mt-6 border-t border-rose-100 pt-4 text-right">
          <Link
            href={`/store/${storeSlug}/reviews`}
            className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 transition-colors hover:text-pink-700 md:text-sm"
          >
            <span>店舗全体の口コミを見る</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* アクションバー */}
      <div ref={actionBarRef}>
        <CastStickyActionBar
          isSticky={isSticky}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onBookingOpen={handleBookingModalOpen}
          onDiaryClick={() => router.push(`/store/${storeSlug}/diary/cast/${encodeURIComponent(cast.name)}`)}
          onSNSClick={handleSNSClick}
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

      {/* モーダル（予約） */}
      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          castName={cast.name}
          castId={cast.id}
          storeId={storeId}
          onClose={handleBookingModalClose}
        />
      )}

      {/* SNS Bottom Sheet Modal (2つ以上登録時) */}
      <AnimatePresence>
        {isSnsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={() => setIsSnsModalOpen(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* スマホ用ドラッグバー表記 */}
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-neutral-300 sm:hidden" />

              <div className="mb-5 flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    {cast.name}の公式SNS
                  </h3>
                  <p className="text-xs text-neutral-500">タップすると各SNSアプリ・ページへ移動します</p>
                </div>
                <button
                  onClick={() => setIsSnsModalOpen(false)}
                  className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                  aria-label="閉じる"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {getSnsList().map((sns, index) => {
                  const IconComponent = sns.icon;
                  return (
                    <a
                      key={index}
                      href={sns.url}
                      target="_blank"
                      rel={sns.rel || 'noopener noreferrer'}
                      className={`flex w-full items-center justify-between rounded-2xl px-5 py-4 font-bold shadow-sm transition-all active:scale-[0.98] ${sns.colorClass}`}
                      onClick={() => setIsSnsModalOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-6 w-6 flex-shrink-0" />
                        <span className="text-base">{sns.name}</span>
                      </div>
                      <span className="text-xs opacity-80">開く →</span>
                    </a>
                  );
                })}
              </div>

              {/* 親指で押しやすい最下部の閉じるボタン */}
              <button
                onClick={() => setIsSnsModalOpen(false)}
                className="mt-6 flex w-full items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100 py-3.5 text-sm font-bold text-neutral-700 transition-colors hover:bg-neutral-200 active:bg-neutral-300"
              >
                閉じる
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CastDetail;
