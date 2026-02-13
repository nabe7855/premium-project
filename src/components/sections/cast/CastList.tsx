'use client';
import { flavorTags, mockCasts, mockReviews } from '@/data/castdata';
import { Cast } from '@/types/casts';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Filter, Heart, MessageCircle, Search, Star, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import BookingModal from './BookingModal';

const CastList: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([20, 50]);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCastForBooking, setSelectedCastForBooking] = useState<Cast | null>(null);

  const filteredCasts = useMemo(() => {
    return mockCasts.filter((cast) => {
      const matchesSearch =
        cast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cast.catchphrase.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 || selectedTags.some((tag) => cast.tags.includes(tag));
      const matchesAge = cast.age >= ageRange[0] && cast.age <= ageRange[1];

      return matchesSearch && matchesTags && matchesAge;
    });
  }, [searchTerm, selectedTags, ageRange]);

  const toggleFavorite = (castId: string) => {
    setFavorites((prev) =>
      prev.includes(castId) ? prev.filter((id) => id !== castId) : [...prev, castId],
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleCastSelect = (cast: Cast) => {
    router.push(`/cast/${cast.id}`);
  };

  const handleBookingClick = (cast: Cast, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCastForBooking(cast);
    setIsBookingModalOpen(true);
  };

  return (
    <section className="bg-neutral-50 py-16" id="casts">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-neutral-800 md:text-4xl">
            Cast - 心とろける極上のひとときを、あなたに。
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600">
            経験豊富なキャストが、あなただけの特別な時間をお届けします
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-neutral-400" />
              <input
                type="text"
                placeholder="キャスト名やキャッチフレーズで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-neutral-200 py-3 pl-10 pr-4 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="キャスト検索"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-3 transition-all duration-200 hover:bg-neutral-50"
              aria-expanded={showFilters}
              aria-controls="filter-panel"
            >
              <Filter className="mr-2 h-5 w-5" />
              <span>▼ こだわり検索で探す</span>
            </button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence mode="wait">
            {showFilters && (
              <motion.div
                id="filter-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft"
              >
                <div className="space-y-6">
                  {/* Age Range */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-neutral-700">
                      年齢範囲: {ageRange[0]}歳 - {ageRange[1]}歳
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="20"
                        max="50"
                        value={ageRange[0]}
                        onChange={(e) => setAgeRange([parseInt(e.target.value), ageRange[1]])}
                        className="flex-1"
                      />
                      <input
                        type="range"
                        min="20"
                        max="50"
                        value={ageRange[1]}
                        onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value)])}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Flavor Tags */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-neutral-700">
                      フレーバータグ
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {flavorTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                            selectedTags.includes(tag)
                              ? 'bg-primary text-white shadow-md'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                          role="button"
                          aria-pressed={selectedTags.includes(tag)}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-neutral-600">
            {filteredCasts.length}名のキャストが見つかりました
          </p>
        </div>

        {/* Cast Grid - 2 Columns Layout */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <AnimatePresence mode="wait">
            {filteredCasts.map((cast, index) => (
              <CastCard
                key={cast.id}
                cast={cast}
                index={index}
                isFavorite={favorites.includes(cast.id)}
                onToggleFavorite={() => toggleFavorite(cast.id)}
                onCastSelect={() => handleCastSelect(cast)}
                onBookingClick={(e) => handleBookingClick(cast, e)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredCasts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <div className="mb-4">
              <span className="text-6xl">🍓</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-neutral-700">
              お探しの条件に合うキャストが見つかりませんでした
            </h3>
            <p className="mb-4 text-neutral-600">条件を変更してお試しください</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTags([]);
                setAgeRange([20, 50]);
              }}
              className="rounded-full bg-primary px-6 py-2 text-white transition-colors duration-200 hover:bg-primary/90"
            >
              検索条件をリセット
            </button>
          </motion.div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedCastForBooking(null);
        }}
        castName={selectedCastForBooking?.name}
      />
    </section>
  );
};

// 浮遊する口コミコンポーネント
const FloatingReview: React.FC<{ castId: string }> = ({ castId }) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // そのキャストの口コミを取得
  const castReviews = mockReviews.filter((review) => review.castId === castId);

  // 口コミがない場合は何も表示しない
  if (castReviews.length === 0) return null;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentReviewIndex((prev) => (prev + 1) % castReviews.length);
        setIsVisible(true);
      }, 300);
    }, 4000); // 4秒ごとに切り替え

    // 初回表示
    setTimeout(() => setIsVisible(true), 500);

    return () => clearInterval(interval);
  }, [castReviews.length]);

  const currentReview = castReviews[currentReviewIndex];

  return (
    <div className="relative h-16 overflow-hidden">
      <AnimatePresence mode="wait">
        {isVisible && currentReview && (
          <motion.div
            key={currentReviewIndex}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
            }}
            className="absolute inset-0"
          >
            <div className="relative rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 p-3 shadow-soft">
              {/* 吹き出しの三角形 */}
              <div className="absolute -top-2 left-4 h-4 w-4 rotate-45 transform border-l border-t border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10"></div>

              <div className="flex items-start space-x-2">
                <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-3 text-xs leading-relaxed text-neutral-700">
                    {currentReview.comment}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// キャストカードコンポーネント
const CastCard: React.FC<{
  cast: Cast;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onCastSelect: () => void;
  onBookingClick: (e: React.MouseEvent) => void;
}> = ({ cast, index, isFavorite, onToggleFavorite, onCastSelect, onBookingClick }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-soft transition-all duration-300 hover:shadow-luxury"
      onClick={onCastSelect}
      role="article"
      aria-labelledby={`cast-name-${cast.id}`}
    >
      <div className="relative">
        <img
          src={cast.avatar}
          alt={`${cast.name}のプロフィール写真`}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-64"
          loading="lazy"
        />

        {/* Status Badge */}
        {cast.isOnline && (
          <div className="absolute left-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white sm:left-3 sm:top-3 sm:px-3">
            本日出勤
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-colors duration-200 hover:bg-white sm:right-3 sm:top-3 sm:p-2"
          aria-label={`${cast.name}をお気に入りに追加`}
          aria-pressed={isFavorite}
        >
          <Heart
            className={`h-4 w-4 sm:h-5 sm:w-5 ${
              isFavorite ? 'fill-primary text-primary' : 'text-neutral-600'
            }`}
          />
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <h3
          id={`cast-name-${cast.id}`}
          className="mb-2 truncate text-base font-semibold text-neutral-800 sm:text-lg"
        >
          {cast.name}
        </h3>

        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
          {cast.catchphrase}
        </p>

        <div className="mb-3 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center">
            <User className="mr-1 h-3 w-3 text-neutral-400 sm:h-4 sm:w-4" />
            <span className="text-neutral-600">{cast.age}歳</span>
          </div>

          <div className="flex items-center">
            <Star className="mr-1 h-3 w-3 fill-current text-amber-400 sm:h-4 sm:w-4" />
            <span className="text-neutral-600">{cast.rating}</span>
            <span className="ml-1 text-neutral-400">({cast.reviewCount})</span>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-1">
          {cast.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="truncate rounded-full bg-secondary px-2 py-0.5 text-xs text-primary"
            >
              #{tag}
            </span>
          ))}
          {cast.tags.length > 2 && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
              +{cast.tags.length - 2}
            </span>
          )}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center text-xs text-neutral-500">
            <Clock className="mr-1 h-3 w-3" />
            <span>最終更新: 1時間前</span>
          </div>

          <button
            onClick={onBookingClick}
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-primary/90 sm:px-4 sm:py-2 sm:text-sm"
          >
            予約
          </button>
        </div>

        {/* 浮遊する口コミ */}
        <FloatingReview castId={cast.id} />
      </div>
    </motion.article>
  );
};

export default CastList;
