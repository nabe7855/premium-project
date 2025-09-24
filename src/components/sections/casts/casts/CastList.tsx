'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import CastCard from './CastCard';
import SearchFilters from './SearchFilters';
import SortOptions from './SortOptions';
import { getCastsByStore } from '@/lib/getCastsByStore';
import { Cast } from '@/types/cast';

interface CastListProps {
  storeSlug: string; // ✅ 店舗slug必須
}

const CastList: React.FC<CastListProps> = ({ storeSlug }) => {
  const [loading, setLoading] = useState(true);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

  // 🎯 状態管理（useCastSearchを置き換え）
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([20, 50]);
  const [sortBy, setSortBy] = useState<'default' | 'reviewCount' | 'newcomerOnly' | 'todayAvailable'>('default');
  const [selectedMBTI, setSelectedMBTI] = useState<string | null>(null);
  const [selectedFaceTypes, setSelectedFaceTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [originalCasts, setOriginalCasts] = useState<Cast[]>([]);
  const [isDiagnosisResult, setIsDiagnosisResult] = useState(false);

  // DBからキャスト取得
  useEffect(() => {
    const fetchCasts = async () => {
      setLoading(true);
      const result: Cast[] = await getCastsByStore(storeSlug);

      // 🆕 新人フラグを付与
      const withFlags = result.map((c) => ({
        ...c,
        isNewcomer: c.statuses?.some(
          (s) => s.status_master?.name === '新人' && s.isActive
        ),
      }));

      setOriginalCasts(withFlags);
      setLoading(false);
    };
    fetchCasts();
  }, [storeSlug]);

  useEffect(() => {
  void setIsDiagnosisResult; // 将来使う予定のダミー参照
}, []);

  // ✅ ソート & 絞り込みロジック
  const filteredAndSortedCasts = useMemo(() => {
    let result = originalCasts.filter((c) => c.isActive); // 在籍中のみ

    switch (sortBy) {
      case 'default': // おすすめ順 (priority大きい順)
        result = [...result].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
        break;

      case 'reviewCount': // 口コミ数順
        result = [...result].sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
        break;

      case 'newcomerOnly': // 新人のみ
        result = result.filter((c) => c.isNewcomer === true);
        break;

      case 'todayAvailable': // 本日出勤
        const today = new Date().toISOString().split('T')[0];
        result = result.filter(
          (c) => c.availability?.[today] && c.availability[today].length > 0
        );
        break;
    }

    return result;
  }, [originalCasts, sortBy]);

  // 🔄 ローディング時
  if (loading) {
    return (
      <section className="bg-neutral-50 py-16" id="casts">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="text-neutral-600">キャスト情報を読み込み中...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-neutral-50 py-16" id="casts">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* タイトル */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-neutral-800 md:text-4xl">
            {isDiagnosisResult
              ? '相性診断結果 - あなたにぴったりのキャスト'
              : 'Cast - 心とろける極上のひとときを、あなたに。'}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600">
            {isDiagnosisResult
              ? '診断結果に基づいて、相性の良いキャストを優先的に表示しています'
              : '経験豊富なキャストが、あなただけの特別な時間をお届けします'}
          </p>
        </div>

        {/* 検索・フィルタ */}
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

          <SortOptions sortBy={sortBy} onSortChange={setSortBy} />

          <SearchFilters
            showFilters={showFilters}
            selectedMBTI={selectedMBTI}
            selectedFaceTypes={selectedFaceTypes}
            ageRange={ageRange}
            selectedTags={selectedTags}
            onMBTIChange={setSelectedMBTI}
            onFaceTypeToggle={(faceType) => {
              setSelectedFaceTypes((prev) =>
                prev.includes(faceType)
                  ? prev.filter((t) => t !== faceType)
                  : [...prev, faceType]
              );
            }}
            onAgeRangeChange={setAgeRange}
            onTagToggle={(tag) => {
              setSelectedTags((prev) =>
                prev.includes(tag)
                  ? prev.filter((t) => t !== tag)
                  : [...prev, tag]
              );
            }}
            onReset={() => {
              setSearchTerm('');
              setSelectedTags([]);
              setAgeRange([20, 50]);
              setSelectedMBTI(null);
              setSelectedFaceTypes([]);
            }}
          />
        </div>

        {/* 検索結果 */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-600">
              {isDiagnosisResult
                ? `相性診断結果: ${filteredAndSortedCasts.length}名のキャストをご紹介`
                : `${filteredAndSortedCasts.length}名のキャストが見つかりました`}
            </p>
          </div>
        </div>

        {/* カードリスト */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
<AnimatePresence mode="sync">
  {filteredAndSortedCasts.map((cast, index) => (
    <motion.div
      key={cast.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <CastCard
        cast={cast}
        index={index}
        isFavorite={favorites.includes(cast.id)}
        onToggleFavorite={() =>
          setFavorites((prev) =>
            prev.includes(cast.id)
              ? prev.filter((id) => id !== cast.id)
              : [...prev, cast.id]
          )
        }
        onCastSelect={() => console.log('Cast selected:', cast)}
        sortBy={sortBy}
        audioSampleUrl={cast.voiceUrl ?? undefined}
        currentlyPlayingId={currentlyPlayingId}
        setCurrentlyPlayingId={setCurrentlyPlayingId}
        storeSlug={storeSlug}
      />
    </motion.div>
  ))}
</AnimatePresence>

        </div>
      </div>
    </section>
  );
};

export default CastList;
