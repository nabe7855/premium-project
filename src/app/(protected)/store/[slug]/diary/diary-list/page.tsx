'use client';
import CastSearchDropdown from '@/components/sections/diary/CastSearchDropdown';
import DiaryCard from '@/components/sections/diary/DiaryCard';
import FilterPanel from '@/components/sections/diary/FilterPanel';
import Header from '@/components/sections/layout/Header';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import { useStore } from '@/contexts/StoreContext';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { supabase } from '@/lib/supabaseClient';
import { Filter, Flame, Grid, List, Search, Sparkles } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DiaryPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  tags: string[];
  reactions: { total: number };
  commentCount: number;
  storeSlug: string;
  castName: string;
}

const DiaryListPage = () => {
  const params = useParams();
  const storeSlug = params?.slug as string;
  const { store } = useStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [allPosts, setAllPosts] = useState<DiaryPost[]>([]); // Store all fetched posts
  const [filteredAndSortedPosts, setFilteredAndSortedPosts] = useState<DiaryPost[]>([]); // Store processed posts
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [topConfig, setTopConfig] = useState<StoreTopPageConfig | null>(null);

  // ✅ 店舗設定取得
  useEffect(() => {
    const fetchConfig = async () => {
      const result = await getStoreTopConfig(storeSlug);
      if (result.success) {
        setTopConfig(result.config as StoreTopPageConfig);
      }
    };
    fetchConfig();
  }, [storeSlug]);

  // ✅ DBから日記取得
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select(
          `
          id,
          title,
          content,
          created_at,
          casts (
            id,
            name,
            cast_store_memberships (
              stores ( slug )
            )
          ),
          blog_tags (
            blog_tag_master ( name )
          )
        `,
        )
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ fetchPosts error:', error.message);
        return;
      }

      // storeSlug でフィルタリング
      const posts =
        data
          ?.filter((post: any) => {
            // casts は 1つのためオブジェクトで返る。その配下のメンバーシップを確認
            const memberships = post.casts?.cast_store_memberships ?? [];
            const storeSlugs = memberships.map((m: any) => m.stores?.slug).filter(Boolean);
            return storeSlugs.includes(storeSlug);
          })
          .map((post: any) => ({
            id: post.id,
            title: post.title,
            content: post.content ?? '',
            excerpt: post.content ? post.content.slice(0, 100).replace(/\n/g, ' ') + '...' : '',
            date: post.created_at,
            tags: post.blog_tags?.map((t: any) => t.blog_tag_master?.name).filter(Boolean) ?? [],
            reactions: { total: 0 }, // TODO: リアクション集計
            commentCount: 0, // TODO: コメント数集計
            storeSlug,
            castName: post.casts?.name ?? '不明なキャスト',
          })) ?? [];

      setAllPosts(posts);
    };

    fetchPosts();
  }, [storeSlug]);

  // ✅ フィルタリングとソート
  useEffect(() => {
    let filtered = [...allPosts]; // Start with all fetched posts

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

    setFilteredAndSortedPosts(filtered);
  }, [sortBy, selectedHashtags, allPosts]); // Depend on allPosts to re-filter/sort when raw data changes

  const handleHashtagFilter = (hashtags: string[]) => {
    setSelectedHashtags(hashtags);
  };

  // おすすめ・トレンドは暫定的に最初の数件から
  const trendingPosts = filteredAndSortedPosts.slice(0, 3);
  const recommendedPosts = filteredAndSortedPosts.slice(3, 6);

  return (
    <div
      className={`min-h-screen ${store.theme.bodyClass || 'bg-gradient-to-br from-pink-50 to-white'}`}
    >
      {topConfig && topConfig.header.isVisible && <Header config={topConfig.header} />}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-100 to-pink-50 py-6 pt-24 sm:py-8 sm:pt-28 md:py-12 md:pt-32">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
              Photo Diary
            </h1>
            <p className="mx-auto max-w-2xl px-4 font-serif text-sm text-gray-600 sm:text-base md:text-lg">
              キャストが綴る、とびきり甘い&quot;日常&quot;の記録。誰にも言えない想いを、あなたにだけ。
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
                  className={`p-2 sm:p-2.5 ${
                    viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'text-gray-600'
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-2.5 ${
                    viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'text-gray-600'
                  }`}
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
                <DiaryCard key={post.id} post={post} compact />
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
                <DiaryCard key={post.id} post={post} compact trending={index + 1} />
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
                  {filteredAndSortedPosts.length}件の日記が見つかりました
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

          {filteredAndSortedPosts.length > 0 ? (
            <div
              className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}
            >
              {filteredAndSortedPosts.map((post) => (
                <DiaryCard key={post.id} post={post} listView={viewMode === 'list'} />
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
        {filteredAndSortedPosts.length > 0 && (
          <div className="text-center">
            <button className="rounded-full bg-pink-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600 sm:px-8 sm:py-3 sm:text-base">
              もっと見る
            </button>
          </div>
        )}
      </div>

      {/* ✅ テンプレートに応じたフッターを表示 */}
      {storeSlug === 'yokohama' && topConfig?.footer && (
        <YokohamaFooter config={topConfig.footer} />
      )}
      {storeSlug === 'fukuoka' && topConfig?.footer && <FukuokaFooter config={topConfig.footer} />}
    </div>
  );
};

export default DiaryListPage;
