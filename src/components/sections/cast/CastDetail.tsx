'use client';
import { mockReviews } from '@/data/castdata';
import { Cast } from '@/types/casts';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Camera,
  Clock,
  Download,
  Edit3,
  Eye,
  Headphones,
  Heart,
  Instagram,
  MessageCircle,
  Play,
  Share2,
  Star,
  Twitter,
  User,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import BookingModal from './BookingModal';
import RadarChart from './RadarChart';
import ReviewModal from './ReviewModal';

interface CastDetailProps {
  cast: Cast;
  onBack: () => void;
}

const CastDetail: React.FC<CastDetailProps> = ({ cast, onBack }) => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'story' | 'reviews' | 'schedule' | 'gallery'
  >('profile');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isTabsSticky, setIsTabsSticky] = useState(false);

  const castReviews = mockReviews.filter((review) => review.castId === cast.id);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'story', label: 'Story', icon: MessageCircle },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: Heart },
  ];

  const ratingDistribution = [
    { stars: 5, count: 18, percentage: 78 },
    { stars: 4, count: 4, percentage: 17 },
    { stars: 3, count: 1, percentage: 4 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  const reviewTags = ['癒された', '記念日に利用', 'また会いたい', 'プロ意識', '時間を忘れる'];

  // 直近2週間の日付を生成
  const generateNext14Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const next14Days = generateNext14Days();

  // 日付フォーマット関数
  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return '今日';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '明日';
    } else {
      return date.toLocaleDateString('ja-JP', {
        month: 'numeric',
        day: 'numeric',
        weekday: 'short',
      });
    }
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // スクロール監視でタブの固定化を制御
  useEffect(() => {
    const handleScroll = () => {
      const tabsElement = document.getElementById('tabs-section');

      if (tabsElement) {
        const tabsTop = tabsElement.getBoundingClientRect().top;
        setIsTabsSticky(tabsTop <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDiaryClick = () => {
    // 写メ日記ページへの遷移処理
    alert('写メ日記ページに移動します');
  };

  const handleSNSClick = (platform: string) => {
    // SNSページへの遷移処理
    alert(`${platform}ページに移動します`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile-Optimized Header */}
      <header className="sticky top-0 z-50 bg-white shadow-soft" role="banner">
        <div className="px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between sm:h-16">
            <div className="flex min-w-0 flex-1 items-center">
              <button
                onClick={onBack}
                className="mr-2 flex-shrink-0 p-2 text-neutral-600 transition-colors duration-200 hover:text-primary sm:mr-4"
                aria-label="キャスト一覧に戻る"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <div className="flex min-w-0 items-center">
                <img
                  src={cast.avatar}
                  alt={`${cast.name}のアイコン`}
                  className="mr-2 h-8 w-8 flex-shrink-0 rounded-full sm:mr-3 sm:h-10 sm:w-10"
                />
                <h1 className="truncate text-lg font-bold text-neutral-800 sm:text-xl">
                  {cast.name}
                </h1>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 text-neutral-600 transition-colors duration-200 hover:text-primary"
                aria-label={`${cast.name}をお気に入りに追加`}
                aria-pressed={isFavorite}
              >
                <Heart
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${isFavorite ? 'fill-primary text-primary' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* Mobile-First Layout */}
        <div className="space-y-6">
          {/* Image Gallery - Mobile Optimized */}
          <div className="w-full">
            <div className="mb-4 aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-200 sm:aspect-[4/5]">
              <img
                src={cast.images[selectedImage]}
                alt={`${cast.name}の写真 ${selectedImage + 1}`}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery - Horizontal Scroll on Mobile */}
            <div className="scrollbar-hide mb-4 flex gap-2 overflow-x-auto pb-2">
              {cast.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20 ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${cast.name}の写真 ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* 写メ日記とSNSボタン */}
            <div className="mb-4 flex gap-3">
              <button
                onClick={handleDiaryClick}
                className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 font-medium text-white shadow-md transition-all duration-200 hover:from-pink-600 hover:to-rose-600 hover:shadow-lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                <span className="text-sm sm:text-base">写メ日記</span>
              </button>

              <button
                onClick={() => handleSNSClick('Instagram')}
                className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-3 text-white shadow-md transition-all duration-200 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg"
                aria-label="Instagramを見る"
              >
                <Instagram className="h-5 w-5" />
              </button>

              <button
                onClick={() => handleSNSClick('Twitter')}
                className="rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 p-3 text-white shadow-md transition-all duration-200 hover:from-blue-500 hover:to-blue-700 hover:shadow-lg"
                aria-label="Twitterを見る"
              >
                <Twitter className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Cast Info Card */}
          <div className="rounded-2xl bg-white p-4 shadow-soft sm:p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="mb-2 text-xl font-bold text-neutral-800 sm:text-2xl">{cast.name}</h2>
                {cast.isOnline && (
                  <div className="mb-3 flex w-fit items-center rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                    <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                    本日出勤中
                  </div>
                )}
              </div>
            </div>

            <p className="mb-4 text-base text-neutral-700 sm:text-lg">{cast.catchphrase}</p>

            <div className="mb-4 flex flex-wrap gap-2">
              {cast.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-sm text-primary"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
              <div className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                <span>{cast.age}歳</span>
              </div>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-current text-amber-400" />
                <span>
                  {cast.rating} ({cast.reviewCount}件)
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>1時間前</span>
              </div>
            </div>
          </div>

          {/* Rating Summary Card */}
          <div className="rounded-2xl bg-white p-4 shadow-soft sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2 text-2xl font-bold text-neutral-800 sm:text-3xl">
                  {cast.rating}
                </span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg sm:text-xl">
                      🍓
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-sm text-neutral-600">({cast.reviewCount} Reviews)</span>
            </div>

            <div className="space-y-2">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center">
                  <span className="w-6 text-sm text-neutral-600 sm:w-8">{stars}★</span>
                  <div className="mx-2 h-2 flex-1 rounded-full bg-neutral-200 sm:mx-3">
                    <div
                      className="h-2 rounded-full bg-amber-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-6 text-sm text-neutral-600 sm:w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs Section - This will be the sticky reference point */}
          <div id="tabs-section">
            {/* Sticky Tabs Container */}
            <div
              className={`${isTabsSticky ? 'fixed left-0 right-0 top-0 z-40 px-4 sm:px-6 lg:px-8' : ''}`}
            >
              <div className={`${isTabsSticky ? 'mx-auto max-w-7xl' : ''}`}>
                {/* Mobile-Optimized Tab Navigation */}
                <nav
                  className="mb-4 overflow-x-auto rounded-2xl bg-white p-1 shadow-soft"
                  role="tablist"
                >
                  <div className="flex min-w-max space-x-1">
                    {tabs.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id as typeof activeTab)}
                        className={`flex items-center whitespace-nowrap rounded-lg px-3 py-2 font-medium transition-all duration-200 sm:px-4 sm:py-3 ${
                          activeTab === id
                            ? 'bg-primary text-white shadow-md'
                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-primary'
                        }`}
                        role="tab"
                        aria-selected={activeTab === id}
                        aria-controls={`${id}-panel`}
                      >
                        <Icon className="mr-1 h-4 w-4 sm:mr-2" />
                        <span className="text-sm sm:text-base">{label}</span>
                      </button>
                    ))}
                  </div>
                </nav>

                {/* Sticky Booking Button */}
                <div className="mb-4">
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full rounded-xl bg-primary py-4 font-medium text-white shadow-luxury transition-all duration-200 hover:bg-primary/90 hover:shadow-xl"
                  >
                    {cast.name}を予約する
                  </button>
                </div>
              </div>
            </div>

            {/* Spacer when tabs are sticky */}
            {isTabsSticky && <div className="h-32"></div>}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-white p-4 shadow-soft sm:p-6"
              role="tabpanel"
              id={`${activeTab}-panel`}
            >
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  {/* レーダーチャート */}
                  <div className="text-center">
                    <h3 className="mb-6 text-lg font-semibold text-neutral-800">
                      セラピスト能力チャート
                    </h3>
                    <div className="flex justify-center">
                      <RadarChart data={cast.radarData} size={280} />
                    </div>
                    <p className="mt-4 text-sm text-neutral-600">
                      ※ 過去のお客様からの評価を基に算出しています
                    </p>
                  </div>

                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="mb-3 text-lg font-semibold text-neutral-800">自己紹介</h3>
                    <p className="leading-relaxed text-neutral-700">{cast.profile.introduction}</p>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-neutral-800">経験・実績</h3>
                    <p className="leading-relaxed text-neutral-700">{cast.profile.experience}</p>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-neutral-800">得意分野</h3>
                    <div className="flex flex-wrap gap-2">
                      {cast.profile.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-neutral-800">趣味</h3>
                    <div className="flex flex-wrap gap-2">
                      {cast.profile.hobbies.map((hobby) => (
                        <span
                          key={hobby}
                          className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'story' && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-neutral-800">私のストーリー</h3>
                  <p className="text-base leading-relaxed text-neutral-700 sm:text-lg">
                    {cast.story}
                  </p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Review Header with Post Button */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-neutral-800">口コミ・レビュー</h3>
                    <button
                      onClick={() => setIsReviewModalOpen(true)}
                      className="flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary/90"
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      口コミを投稿
                    </button>
                  </div>

                  {/* Review Tags Filter - Mobile Optimized */}
                  <div>
                    <h4 className="mb-3 text-base font-medium text-neutral-800">
                      キーワードフィルター
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {reviewTags.map((tag) => (
                        <button
                          key={tag}
                          className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700 transition-colors duration-200 hover:bg-primary hover:text-white"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {castReviews.map((review) => (
                      <article
                        key={review.id}
                        className="border-b border-neutral-100 pb-4 last:border-b-0"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center">
                              <span className="font-medium text-neutral-800">{review.author}</span>
                              <span className="ml-2 text-sm text-neutral-500">
                                {new Date(review.date).toLocaleDateString('ja-JP')}
                              </span>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-sm text-amber-400">
                                  {i < review.rating ? '🍓' : '☆'}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <p className="mb-3 text-sm text-neutral-700 sm:text-base">
                          {review.comment}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {review.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-secondary px-2 py-1 text-xs text-primary"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-neutral-800">出勤スケジュール</h3>
                    <span className="text-sm text-neutral-600">直近2週間</span>
                  </div>

                  <div className="space-y-3">
                    {next14Days.map((date) => {
                      const dateKey = formatDateKey(date);
                      const availableTimes = cast.availability[dateKey] || [];
                      const isToday = date.toDateString() === new Date().toDateString();

                      return (
                        <div
                          key={dateKey}
                          className={`rounded-xl border p-4 transition-all duration-200 ${
                            isToday
                              ? 'border-primary/20 bg-primary/5'
                              : availableTimes.length > 0
                                ? 'border-green-200 bg-green-50'
                                : 'border-neutral-200 bg-neutral-50'
                          }`}
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <span
                                className={`font-medium ${isToday ? 'text-primary' : 'text-neutral-800'}`}
                              >
                                {formatDate(date)}
                              </span>
                              <span className="ml-2 text-sm text-neutral-500">
                                {date.toLocaleDateString('ja-JP', {
                                  month: 'numeric',
                                  day: 'numeric',
                                })}
                              </span>
                              {isToday && (
                                <span className="ml-2 rounded-full bg-primary px-2 py-1 text-xs text-white">
                                  TODAY
                                </span>
                              )}
                            </div>

                            <div className="flex items-center">
                              {availableTimes.length > 0 ? (
                                <div className="flex items-center text-green-600">
                                  <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                                  <span className="text-sm font-medium">出勤予定</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-neutral-500">
                                  <div className="mr-2 h-2 w-2 rounded-full bg-neutral-400"></div>
                                  <span className="text-sm">お休み</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {availableTimes.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {availableTimes.map((time) => (
                                <button
                                  key={time}
                                  onClick={() => setIsBookingModalOpen(true)}
                                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-md"
                                >
                                  {time}〜
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm italic text-neutral-500">
                              この日は出勤予定がありません
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-xl bg-neutral-100 p-4">
                    <h4 className="mb-2 font-medium text-neutral-800">スケジュールについて</h4>
                    <div className="space-y-1 text-sm text-neutral-600">
                      <p>• 表示されている時間は出勤開始時刻です</p>
                      <p>• 予約状況により変更になる場合があります</p>
                      <p>• 詳細な空き状況は予約フォームでご確認ください</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && <GalleryTab cast={cast} />}
            </motion.div>
          </AnimatePresence>

          {/* Bottom CTA Section - Only visible when tabs are not sticky */}
          {!isTabsSticky && (
            <div className="rounded-2xl bg-gradient-to-r from-primary to-accent p-4 text-white sm:p-6">
              <div className="text-center sm:flex sm:items-center sm:justify-between sm:text-left">
                <div className="mb-4 sm:mb-0">
                  <h3 className="mb-2 text-lg font-bold sm:text-xl">特別なひとときを、今すぐ</h3>
                  <p className="text-sm opacity-90 sm:text-base">
                    心とろける極上の時間をお過ごしください
                  </p>
                </div>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full rounded-full bg-white px-6 py-3 font-medium text-primary transition-colors duration-200 hover:bg-neutral-50 sm:w-auto sm:px-8"
                >
                  予約する
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Review Button - Only visible when reviews tab is active */}
      {activeTab === 'reviews' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={() => setIsReviewModalOpen(true)}
          className="fixed bottom-6 right-6 z-30 rounded-full bg-primary p-4 text-white shadow-luxury transition-all duration-200 hover:bg-primary/90 hover:shadow-xl"
          aria-label="口コミを投稿"
        >
          <Edit3 className="h-6 w-6" />
        </motion.button>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        castName={cast.name}
        castId={cast.id}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        castName={cast.name}
      />
    </div>
  );
};

// ギャラリータブコンポーネント
const GalleryTab: React.FC<{ cast: Cast }> = ({ cast }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'photos' | 'videos' | 'voice'>(
    'all',
  );
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [isMuted, setIsMuted] = useState<{ [key: string]: boolean }>({});

  // モックデータ - 実際の実装では API から取得
  const galleryItems = [
    // 写真
    ...cast.images.map((image, index) => ({
      id: `photo-${index}`,
      type: 'photo',
      url: image,
      thumbnail: image,
      title: `写真 ${index + 1}`,
      description: '素敵な一枚です',
      uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 100) + 10,
    })),
    // 動画（サンプル）
    {
      id: 'video-1',
      type: 'video',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail:
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: '自己紹介動画',
      description: 'はじめまして！よろしくお願いします',
      duration: '2:30',
      uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      views: 456,
      likes: 23,
    },
    {
      id: 'video-2',
      type: 'video',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      thumbnail:
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: '日常の一コマ',
      description: 'リラックスした時間をお過ごしください',
      duration: '1:45',
      uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      views: 234,
      likes: 18,
    },
    // 音声（サンプル）
    {
      id: 'voice-1',
      type: 'voice',
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: null,
      title: '癒しのボイスメッセージ',
      description: 'お疲れ様でした。ゆっくり休んでくださいね',
      duration: '0:45',
      uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      views: 189,
      likes: 31,
    },
    {
      id: 'voice-2',
      type: 'voice',
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: null,
      title: 'おやすみメッセージ',
      description: '今日も一日お疲れ様でした',
      duration: '1:20',
      uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      views: 312,
      likes: 45,
    },
  ];

  const categories = [
    { id: 'all', label: 'すべて', count: galleryItems.length },
    {
      id: 'photos',
      label: '写真',
      count: galleryItems.filter((item) => item.type === 'photo').length,
    },
    {
      id: 'videos',
      label: '動画',
      count: galleryItems.filter((item) => item.type === 'video').length,
    },
    {
      id: 'voice',
      label: '音声',
      count: galleryItems.filter((item) => item.type === 'voice').length,
    },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.type === selectedCategory);

  const handleMediaClick = (item: any) => {
    setSelectedMedia(item);
  };

  const handlePlayToggle = (itemId: string) => {
    setIsPlaying((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleMuteToggle = (itemId: string) => {
    setIsMuted((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-neutral-800">{cast.name}のギャラリー</h3>
          <p className="text-sm text-neutral-600">写真、動画、音声メッセージをお楽しみください</p>
        </div>

        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-neutral-400" />
          <span className="text-sm text-neutral-600">シェア</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as any)}
            className={`flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <span>{category.label}</span>
            <span className="ml-2 text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        <AnimatePresence>
          {filteredItems.map((item, index) => (
            <MediaCard
              key={item.id}
              item={item}
              index={index}
              isPlaying={isPlaying[item.id]}
              isMuted={isMuted[item.id]}
              onMediaClick={() => handleMediaClick(item)}
              onPlayToggle={() => handlePlayToggle(item.id)}
              onMuteToggle={() => handleMuteToggle(item.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4">
            <span className="text-4xl">📸</span>
          </div>
          <h4 className="mb-2 text-lg font-medium text-neutral-700">まだコンテンツがありません</h4>
          <p className="text-neutral-600">新しいコンテンツをお楽しみに</p>
        </div>
      )}

      {/* Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <MediaModal media={selectedMedia} onClose={() => setSelectedMedia(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// メディアカードコンポーネント
const MediaCard: React.FC<{
  item: any;
  index: number;
  isPlaying: boolean;
  isMuted: boolean;
  onMediaClick: () => void;
  onPlayToggle: () => void;
  onMuteToggle: () => void;
}> = ({ item, index, onMediaClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={onMediaClick}
    >
      <div className="relative mb-2 aspect-square overflow-hidden rounded-xl bg-neutral-200">
        {item.type === 'photo' && (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {item.type === 'video' && (
          <>
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="rounded-full bg-white/90 p-2 backdrop-blur-sm">
                <Play className="h-4 w-4 text-neutral-800" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
              {item.duration}
            </div>
          </>
        )}

        {item.type === 'voice' && (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="mb-2 rounded-full bg-white/90 p-3 backdrop-blur-sm">
              <Headphones className="h-6 w-6 text-primary" />
            </div>
            <div className="text-xs font-medium text-neutral-700">{item.duration}</div>
          </div>
        )}

        {/* Overlay with stats */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20">
          <div className="absolute bottom-2 left-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex items-center space-x-2 text-xs text-white">
              <div className="flex items-center">
                <Eye className="mr-1 h-3 w-3" />
                <span>{item.views}</span>
              </div>
              <div className="flex items-center">
                <Heart className="mr-1 h-3 w-3" />
                <span>{item.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title and description */}
      <div className="px-1">
        <h4 className="mb-1 truncate text-sm font-medium text-neutral-800">{item.title}</h4>
        <p className="mb-1 line-clamp-2 text-xs leading-relaxed text-neutral-600">
          {item.description}
        </p>
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>
            {item.uploadDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
          </span>
          <div className="flex items-center space-x-2">
            <span>{item.views} views</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// メディアモーダルコンポーネント
const MediaModal: React.FC<{
  media: any;
  onClose: () => void;
}> = ({ media, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-luxury"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 p-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-800">{media.title}</h3>
              <p className="text-sm text-neutral-600">{media.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 transition-colors duration-200 hover:text-neutral-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Media Content */}
          <div className="p-4">
            {media.type === 'photo' && (
              <div className="aspect-video overflow-hidden rounded-xl bg-neutral-100">
                <img src={media.url} alt={media.title} className="h-full w-full object-contain" />
              </div>
            )}

            {media.type === 'video' && (
              <div className="aspect-video overflow-hidden rounded-xl bg-neutral-900">
                <video src={media.url} controls className="h-full w-full" poster={media.thumbnail}>
                  お使いのブラウザは動画再生に対応していません。
                </video>
              </div>
            )}

            {media.type === 'voice' && (
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-8">
                <div className="text-center">
                  <div className="mb-4 inline-block rounded-full bg-white p-6 shadow-soft">
                    <Headphones className="h-12 w-12 text-primary" />
                  </div>
                  <h4 className="mb-2 text-lg font-medium text-neutral-800">{media.title}</h4>
                  <p className="mb-6 text-neutral-600">{media.description}</p>

                  <audio src={media.url} controls className="mx-auto w-full max-w-md">
                    お使いのブラウザは音声再生に対応していません。
                  </audio>
                </div>
              </div>
            )}

            {/* Media Info */}
            <div className="mt-4 flex items-center justify-between text-sm text-neutral-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Eye className="mr-1 h-4 w-4" />
                  <span>{media.views} views</span>
                </div>
                <div className="flex items-center">
                  <Heart className="mr-1 h-4 w-4" />
                  <span>{media.likes} likes</span>
                </div>
                {media.duration && (
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{media.duration}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-neutral-400 transition-colors duration-200 hover:text-neutral-600">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-neutral-400 transition-colors duration-200 hover:text-neutral-600">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CastDetail;
