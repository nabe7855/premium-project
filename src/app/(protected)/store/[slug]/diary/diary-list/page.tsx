'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Search, Filter, Grid, List, Flame, Sparkles } from 'lucide-react';
import DiaryCard from '@/components/sections/diary/DiaryCard';
import CastSearchDropdown from '@/components/sections/diary/CastSearchDropdown';
import FilterPanel from '@/components/sections/diary/FilterPanel';
import { mockDiaryPosts } from '@/data/diarydata';

const DiaryListPage = () => {
  const params = useParams();
  const storeSlug = params?.slug as string;

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState(mockDiaryPosts);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  useEffect(() => {
    // Set canonical URL
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) existingCanonical.remove();

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = `${window.location.origin}/diary/diary-list`;
    document.head.appendChild(canonical);

    document.title = '写メ日記一覧｜Strawberry Boys';
    const existingDescription = document.querySelector('meta[name="description"]');
    if (existingDescription) {
      existingDescription.setAttribute(
        'content',
        'ストロベリーボーイズキャストの日常を綴った写メ日記。あなたの推しキャストの素顔を発見しよう。',
      );
    }

    return () => {
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.remove();
    };
  }, []);

  useEffect(() => {
    let filtered = mockDiaryPosts;

    if (selectedHashtags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedHashtags.some(
          (hashtag) =>
            post.tags.includes(hashtag) ||
            post.title.includes(hashtag) ||
            post.excerpt.includes(hashtag),
        ),
      );
    }

    switch (sortBy) {
      case 'newest':
        filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'popular':
        filtered = filtered.sort((a, b) => b.reactions.total - a.reactions.total);
        break;
      case 'comments':
        filtered = filtered.sort((a, b) => b.commentCount - a.commentCount);
        break;
    }

    setFilteredPosts(filtered);
  }, [sortBy, selectedHashtags]);

  const handleHashtagFilter = (hashtags: string[]) => {
    setSelectedHashtags(hashtags);
  };

  const trendingPosts = mockDiaryPosts.slice(0, 3);
  const recommendedPosts = mockDiaryPosts.slice(3, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-100 to-pink-50 py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
              Photo Diary
            </h1>
            <p className="mx-auto max-w-2xl px-4 font-serif text-sm text-gray-600 sm:text-base md:text-lg">
              キャストが綴る、とびきり甘い"日常"の記録。誰にも言えない想いを、あなたにだけ。
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:py-8">
        {/* Search and Filter Section */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:gap-4">
            <CastSearchDropdown className="flex-1" />
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm transition-colors hover:bg-pink-50 sm:px-4 sm:py-2.5 sm:text-base"
              >
                <Filter size={16} className="sm:h-4 sm:w-4" />
                フィルター
                {selectedHashtags.length > 0 && (
                  <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-pink-500 px-1.5 py-0.5 text-xs text-white">
                    {selectedHashtags.length}
                  </span>
                )}
              </button>
              <div className="flex items-center overflow-hidden rounded-lg border border-pink-200 bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 sm:p-2.5 ${viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'text-gray-600'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-2.5 ${viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'text-gray-600'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <FilterPanel
              sortBy={sortBy}
              onSortChange={setSortBy}
              onHashtagFilter={handleHashtagFilter}
            />
          )}
        </div>

        {/* Special Sections */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:gap-6 md:mb-12 md:gap-8 lg:grid-cols-2">
          {/* For You Section */}
          <div className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <Sparkles className="text-pink-500" size={18} />
              <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                For You - あなたへのおすすめ
              </h2>
            </div>
            <p className="mb-3 text-xs text-gray-600 sm:mb-4 sm:text-sm">
              🍓 あなたの好みに合わせて、特別な日記をお届けします
            </p>
            <div className="space-y-3">
              {recommendedPosts.map((post) => (
                <DiaryCard key={post.id} post={{ ...post, storeSlug }} compact />
              ))}
            </div>
          </div>

          {/* Trending Section */}
          <div className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <Flame className="text-red-500" size={18} />
              <h2 className="text-lg font-bold text-gray-800 sm:text-xl">話題の日記</h2>
            </div>
            <p className="mb-3 text-xs text-gray-600 sm:mb-4 sm:text-sm">
              🔥 今みんなが読んでいる人気の日記
            </p>
            <div className="space-y-3">
              {trendingPosts.map((post, index) => (
                <DiaryCard
                  key={post.id}
                  post={{ ...post, storeSlug }}
                  compact
                  trending={index + 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-0">
            <div>
              <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                {selectedHashtags.length > 0 ? 'フィルター結果' : 'すべての日記'}
              </h2>
              {selectedHashtags.length > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  {filteredPosts.length}件の日記が見つかりました
                </p>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 sm:px-4 sm:text-base"
            >
              <option value="newest">新着順</option>
              <option value="popular">人気順</option>
              <option value="comments">コメント数順</option>
            </select>
          </div>

          {filteredPosts.length > 0 ? (
            <div
              className={`grid gap-4 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
            >
              {filteredPosts.map((post) => (
                <DiaryCard
                  key={post.id}
                  post={{ ...post, storeSlug }}
                  listView={viewMode === 'list'}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center sm:py-12">
              <div className="rounded-xl border border-pink-100 bg-white p-6 shadow-sm sm:rounded-2xl sm:p-8">
                <Search className="mx-auto mb-3 text-gray-400 sm:mb-4" size={32} />
                <h3 className="mb-2 text-lg font-bold text-gray-800 sm:text-xl">
                  該当する日記が見つかりません
                </h3>
                <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
                  別のハッシュタグで検索してみてください
                </p>
                <button
                  onClick={() => handleHashtagFilter([])}
                  className="rounded-lg bg-pink-500 px-4 py-2 text-sm text-white transition-colors hover:bg-pink-600 sm:px-6 sm:py-3 sm:text-base"
                >
                  フィルターをクリア
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredPosts.length > 0 && (
          <div className="text-center">
            <button className="rounded-full bg-pink-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600 sm:px-8 sm:py-3 sm:text-base">
              もっと見る
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryListPage;
