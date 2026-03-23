'use client';
import { flavorTags, mockCasts, mockReviews } from '@/data/castdata';
import { Cast } from '@/types/casts';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Filter, Heart, MessageCircle, Search, Star, User, ChevronLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import BookingModal from './BookingModal';

const CastList: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const storeSlug = params.slug as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedMbtis, setSelectedMbtis] = useState<string[]>([]);
  const [selectedStrawberryTypes, setSelectedStrawberryTypes] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([20, 50]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<'recommended' | 'reviews' | 'new' | 'age-asc' | 'age-desc'>('recommended');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCastForBooking, setSelectedCastForBooking] = useState<Cast | null>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const filteredCasts = useMemo(() => {
    const result = mockCasts.filter((cast) => {
      const matchesSearch =
        cast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cast.catchphrase.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 || selectedTags.some((tag) => cast.tags.includes(tag));
      const matchesAge = cast.age >= ageRange[0] && cast.age <= ageRange[1];

      // MBTI / Strawberry フィルターがあれば追加（mockデータにある場合に有効）
      const matchesMbti = selectedMbtis.length === 0 || (cast as any).mbti && selectedMbtis.includes((cast as any).mbti);
      const matchesStrawberry = selectedStrawberryTypes.length === 0 || (cast as any).strawberryType && selectedStrawberryTypes.includes((cast as any).strawberryType);

      return matchesSearch && matchesTags && matchesAge && matchesMbti && matchesStrawberry;
    });

    // ソート適用
    return [...result].sort((a, b) => {
      switch (sortKey) {
        case 'reviews':
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case 'new':
          return b.id.localeCompare(a.id);
        case 'age-asc':
          return a.age - b.age;
        case 'age-desc':
          return b.age - a.age;
        default:
          return 0; // おすすめ（モックデータの順序）
      }
    });
  }, [searchTerm, selectedTags, selectedMbtis, selectedStrawberryTypes, ageRange, sortKey]);

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
    router.push(`/store/${storeSlug}/cast/${cast.id}`);
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

        {/* Search and Filter Section (Redesigned) */}
        <div className="mb-12 space-y-6">
          {/* 1. Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-neutral-400 transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="キャスト名やキャッチフレーズで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-neutral-200 bg-white py-4 pl-12 pr-6 text-sm font-bold shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              aria-label="キャスト検索"
            />
          </div>

          {/* 2. Sort Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-xs font-bold text-neutral-400">並び替え：</span>
            {[
              { id: 'recommended', label: 'おすすめ順', icon: Star },
              { id: 'reviews', label: '口コミ数順', icon: MessageCircle },
              { id: 'new', label: '新人順', icon: Clock },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setSortKey(item.id as any)}
                className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-black transition-all ${
                  sortKey === item.id
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <item.icon className={`h-3 w-3 ${sortKey === item.id && item.id === 'recommended' ? 'fill-current' : ''}`} />
                {item.label}
              </button>
            ))}
          </div>

          {/* 3. Filter Toggle Button */}
          <div className="pt-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex w-full items-center justify-center gap-3 rounded-xl border-2 py-4 text-sm font-black transition-all duration-300 ${
                showFilters
                  ? 'border-rose-500 bg-rose-500 text-white shadow-lg'
                  : 'border-rose-100 bg-white text-slate-700 shadow-sm hover:border-rose-300 hover:shadow-md'
              }`}
              aria-expanded={showFilters}
            >
              <div className="flex items-center gap-2">
                 <Filter className="h-4 w-4" />
                 {showFilters ? 'こだわり検索をしまう' : 'こだわり検索で探す'}
              </div>
            </button>
          </div>

          {/* 4. Filter Panel (Accordion Categories) */}
          <AnimatePresence mode="wait">
            {showFilters && (
              <motion.div
                id="filter-panel"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl"
              >
                <div className="divide-y divide-neutral-100">
                  {/* Category: Age Range */}
                  <div className="p-4">
                    <button 
                      onClick={() => toggleCategory('age')}
                      className="flex w-full items-center justify-between"
                    >
                      <span className="text-sm font-black text-neutral-700">年齢範囲</span>
                      <span className="text-xs text-primary font-bold">{ageRange[0]}歳 - {ageRange[1]}歳</span>
                    </button>
                    {expandedCategories.includes('age') && (
                      <div className="mt-4 px-2 animate-in fade-in slide-in-from-top-1">
                        <div className="flex items-center space-x-4">
                          <input
                            type="range"
                            min="20"
                            max="50"
                            value={ageRange[0]}
                            onChange={(e) => setAgeRange([parseInt(e.target.value), ageRange[1]])}
                            className="flex-1 accent-primary"
                          />
                          <input
                            type="range"
                            min="20"
                            max="50"
                            value={ageRange[1]}
                            onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value)])}
                            className="flex-1 accent-primary"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category: MBTI */}
                  <div className="p-4">
                    <button 
                      onClick={() => toggleCategory('mbti')}
                      className="flex w-full items-center justify-between"
                    >
                      <span className="text-sm font-black text-neutral-700">MBTI診断結果</span>
                      <ChevronLeft className={`h-4 w-4 transition-transform ${expandedCategories.includes('mbti') ? '-rotate-90' : ''}`} />
                    </button>
                    {expandedCategories.includes('mbti') && (
                      <div className="mt-4 grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-top-1">
                        {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(type => (
                          <button
                            key={type}
                            onClick={() => setSelectedMbtis(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                            className={`rounded-lg border py-2 text-[10px] font-bold transition-all ${
                              selectedMbtis.includes(type)
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'bg-neutral-50 text-neutral-500 border-neutral-100 hover:bg-neutral-100'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category: Strawberry Type */}
                  <div className="p-4">
                    <button 
                      onClick={() => toggleCategory('strawberry')}
                      className="flex w-full items-center justify-between"
                    >
                      <span className="text-sm font-black text-neutral-700">イチゴ系タイプ</span>
                      <ChevronLeft className={`h-4 w-4 transition-transform ${expandedCategories.includes('strawberry') ? '-rotate-90' : ''}`} />
                    </button>
                    {expandedCategories.includes('strawberry') && (
                      <div className="mt-4 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1">
                        {['フレッシュ', 'スイート', 'ワイルド', 'ビター'].map(type => (
                          <button
                            key={type}
                            onClick={() => setSelectedStrawberryTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                            className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                              selectedStrawberryTypes.includes(type)
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'bg-neutral-50 text-neutral-500 border-neutral-100 hover:bg-neutral-100'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category: Flavor Tags */}
                  <div className="p-4">
                    <button 
                      onClick={() => toggleCategory('tags')}
                      className="flex w-full items-center justify-between"
                    >
                      <span className="text-sm font-black text-neutral-700">フレーバータグ</span>
                      <ChevronLeft className={`h-4 w-4 transition-transform ${expandedCategories.includes('tags') ? '-rotate-90' : ''}`} />
                    </button>
                    {expandedCategories.includes('tags') && (
                      <div className="mt-4 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1">
                        {flavorTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`rounded-full border px-4 py-2 text-[11px] font-bold transition-all ${
                              selectedTags.includes(tag)
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'bg-neutral-50 text-neutral-500 border-neutral-100 hover:bg-neutral-100'
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-400">こだわり検索：全項目から絞り込みます</span>
                  <button 
                    onClick={() => {
                        setSelectedTags([]);
                        setSelectedMbtis([]);
                        setSelectedStrawberryTypes([]);
                        setAgeRange([20, 50]);
                    }}
                    className="flex items-center gap-1 text-primary font-black hover:underline"
                  >
                    <Star className="h-3 w-3" /> 各項目をリセット
                  </button>
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
                setSelectedMbtis([]);
                setSelectedStrawberryTypes([]);
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
