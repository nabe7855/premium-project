'use client';

//import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { useCastSearch } from '@/hooks/useCastSearch';
import CastCard from './CastCard';
import SearchFilters from './SearchFilters';
import SortOptions from './SortOptions';
//import DiagnosisSection from './DiagnosisSection';

interface CastListProps {
  storeSlug?: string;
}

const CastList: React.FC<CastListProps> = ({}) => {
  const {
    searchTerm,
    selectedTags,
    ageRange,
    sortBy,
    selectedMBTI,
    selectedFaceTypes,
    showFilters,
    favorites,
    filteredAndSortedCasts,
    isLoading,
    isDiagnosisResult,
    setSearchTerm,
    setSelectedTags,
    setAgeRange,
    setSortBy,
    setSelectedMBTI,
    setSelectedFaceTypes,
    setShowFilters,
    handleCastSelect,
    toggleFavorite,
    resetFilters,
  } = useCastSearch();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('検索キーワード変更:', value);
    setSearchTerm(value);
  };

  const handleFilterToggle = () => {
    console.log('フィルター表示切り替え:', !showFilters);
    setShowFilters(!showFilters);
  };

  const getActiveFilters = () => {
    const filters = [];

    if (searchTerm) filters.push({ type: 'search', value: `"${searchTerm}"` });
    if (selectedMBTI) filters.push({ type: 'mbti', value: selectedMBTI });
    if (selectedFaceTypes.length > 0)
      filters.push({ type: 'face', value: `顔タイプ${selectedFaceTypes.length}個` });
    if (selectedTags.length > 0)
      filters.push({ type: 'tags', value: `タグ${selectedTags.length}個` });
    if (ageRange[0] !== 20 || ageRange[1] !== 50)
      filters.push({ type: 'age', value: `${ageRange[0]}-${ageRange[1]}歳` });

    return filters;
  };

  const activeFilters = getActiveFilters();

  if (isLoading) {
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

        <div className="mb-8">
          {/* 診断セクション（診断結果ページでは非表示） */}
          {/* {!isDiagnosisResult && <DiagnosisSection />} */}

          <div className="mb-6 flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-neutral-400" />
              <input
                type="text"
                placeholder="キャスト名やキャッチフレーズで検索..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded-full border border-neutral-200 py-3 pl-10 pr-4 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="キャスト検索"
              />
            </div>

            <button
              onClick={handleFilterToggle}
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
              const newTypes = selectedFaceTypes.includes(faceType)
                ? selectedFaceTypes.filter((t) => t !== faceType)
                : [...selectedFaceTypes, faceType];
              setSelectedFaceTypes(newTypes);
            }}
            onAgeRangeChange={setAgeRange}
            onTagToggle={(tag) => {
              const newTags = selectedTags.includes(tag)
                ? selectedTags.filter((t) => t !== tag)
                : [...selectedTags, tag];
              setSelectedTags(newTags);
            }}
            onReset={resetFilters}
          />
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-600">
              {isDiagnosisResult
                ? `相性診断結果: ${filteredAndSortedCasts.length}名のキャストをご紹介`
                : `${filteredAndSortedCasts.length}名のキャストが見つかりました`}
            </p>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeFilters.map(({ value }, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <AnimatePresence mode="wait">
            {filteredAndSortedCasts.map((cast, index) => (
              <CastCard
                key={cast.id}
                cast={cast}
                index={index}
                isFavorite={favorites.includes(cast.id)}
                onToggleFavorite={() => toggleFavorite(cast.id)}
                onCastSelect={() => handleCastSelect(cast)}
                sortBy={sortBy}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredAndSortedCasts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <div className="mb-4">
              <span className="text-6xl">🍓</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-neutral-700">
              {isDiagnosisResult
                ? '診断結果に合うキャストが見つかりませんでした'
                : 'お探しの条件に合うキャストが見つかりませんでした'}
            </h3>
            <p className="mb-4 text-neutral-600">条件を変更してお試しください</p>
            <button
              onClick={resetFilters}
              className="rounded-full bg-primary px-6 py-2 text-white transition-colors duration-200 hover:bg-primary/90"
            >
              検索条件をリセット
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CastList;
