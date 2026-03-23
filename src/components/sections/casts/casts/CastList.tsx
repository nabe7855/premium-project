'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const initialSort = (searchParams.get('sort') as any) || 'default';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([20, 50]);
  const [sortBy, setSortBy] = useState<
    | 'default'
    | 'reviewCount'
    | 'newcomerOnly'
    | 'todayAvailable'
    | 'tweetOrder'
    | 'diaryOrder'
  >(['default', 'reviewCount', 'newcomerOnly', 'todayAvailable', 'tweetOrder', 'diaryOrder'].includes(initialSort) ? initialSort : 'default');

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

    // 🎯 キーワード検索
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerSearch) ||
          (c.catchCopy && c.catchCopy.toLowerCase().includes(lowerSearch)) ||
          (c.tags && c.tags.some((tag) => tag.toLowerCase().includes(lowerSearch)))
      );
    }

    // 🎯 MBTIフィルター
    if (selectedMBTI) {
      result = result.filter((c) => c.mbtiType === selectedMBTI);
    }

    // 🎯 顔タイプフィルター
    if (selectedFaceTypes.length > 0) {
      result = result.filter((c) =>
        c.faceType?.some((type) => selectedFaceTypes.includes(type))
      );
    }

    // 🎯 年齢フィルター
    result = result.filter(
      (c) => {
        if (c.age === null || c.age === undefined) return true;
        const age = c.age;
        return age >= ageRange[0] && age <= ageRange[1];
      }
    );

    // 🎯 タグフィルター
    if (selectedTags.length > 0) {
      result = result.filter((c) =>
        selectedTags.every((tag) => c.tags?.includes(tag))
      );
    }

    // 🎯 ソート
    switch (sortBy) {
      case 'default': // おすすめ順 (priority大きい順)
        result = [...result].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
        break;

      case 'tweetOrder': // つぶやき最新順
        result = [...result].sort((a, b) => {
          const timeA = a.latestTweetAt ? new Date(a.latestTweetAt).getTime() : 0;
          const timeB = b.latestTweetAt ? new Date(b.latestTweetAt).getTime() : 0;
          return timeB - timeA;
        });
        break;

      case 'diaryOrder': // 日記最新順
        result = [...result].sort((a, b) => {
          const timeA = a.latestDiaryAt ? new Date(a.latestDiaryAt).getTime() : 0;
          const timeB = b.latestDiaryAt ? new Date(b.latestDiaryAt).getTime() : 0;
          return timeB - timeA;
        });
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
  }, [originalCasts, searchTerm, selectedMBTI, selectedFaceTypes, ageRange, selectedTags, sortBy]);

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

        {/* 検索・フィルタ */}
        <div className="mb-8 space-y-4">
          {/* 1段目: 検索バー */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-neutral-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="キャスト名やキャッチフレーズで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-neutral-200 py-3 pl-10 pr-4 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 font-bold"
            />
          </div>

          {/* 2段目: 並び替えタブ */}
          <SortOptions sortBy={sortBy} onSortChange={setSortBy} />

          {/* 3段目: こだわり検索ボタン */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex w-full items-center justify-center rounded-xl border-2 py-4 shadow-sm transition-all duration-300 font-black text-sm gap-2 ${
              showFilters
                ? 'bg-rose-500 border-rose-500 text-white shadow-lg'
                : 'bg-white border-rose-100 text-neutral-700 hover:border-rose-300'
            }`}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <Filter className={`h-4 w-4 ${showFilters ? 'text-white' : 'text-rose-400'}`} />
            <span>{showFilters ? 'こだわり検索をしまう' : '▼ こだわり検索で探す'}</span>
          </button>

          {/* 4段目: フィルターパネル（アコーディオン内蔵） */}
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
