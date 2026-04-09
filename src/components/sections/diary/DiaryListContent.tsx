'use client';
import CastSearchDropdown from '@/components/sections/diary/CastSearchDropdown';
import DiaryCard from '@/components/sections/diary/DiaryCard';
import FilterPanel from '@/components/sections/diary/FilterPanel';
import { useStore } from '@/contexts/StoreContext';
import { supabase } from '@/lib/supabaseClient';
import { Filter, Flame, Grid, List, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';

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
  image_url?: string;
  castAvatar?: string;
}

interface DiaryListContentProps {
  storeSlug: string;
}

const DiaryListContent: React.FC<DiaryListContentProps> = ({ storeSlug }) => {
  const { store } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [allPosts, setAllPosts] = useState<DiaryPost[]>([]);
  const [filteredAndSortedPosts, setFilteredAndSortedPosts] = useState<DiaryPost[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('blogs')
        .select(
          `
          id,
          title,
          content,
          created_at,
          published_at,
          status,
          casts (
            id,
            name,
            image_url,
            main_image_url,
            cast_store_memberships (
              stores ( slug )
            )
          ),
          blog_images (
            image_url
          ),
          blog_tags (
            blog_tag_master ( name )
          ),
          is_comment_enabled,
          blog_comments ( count )
        `,
        )
        .in('status', ['published', 'scheduled'])
        .lte('published_at', now)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('❌ fetchPosts error:', error.message);
        return;
      }

      const posts =
        data
          ?.filter((post: any) => {
            const castObj = Array.isArray(post.casts) ? post.casts[0] : post.casts;
            const memberships = castObj?.cast_store_memberships ?? [];
            const slugs = Array.isArray(memberships)
              ? memberships.map((m: any) => m.stores?.slug).filter(Boolean)
              : [];
            return slugs.includes(storeSlug);
          })
          .map((post: any) => {
            const castObj = Array.isArray(post.casts) ? post.casts[0] : post.casts;
            return {
              id: post.id,
              title: post.title,
              content: post.content ?? '',
              excerpt: post.content ? post.content.slice(0, 100).replace(/\n/g, ' ') + '...' : '',
              date: post.published_at || post.created_at,
              tags: post.blog_tags?.map((t: any) => t.blog_tag_master?.name).filter(Boolean) ?? [],
              reactions: { total: 0 },
              commentCount: post.blog_comments?.[0]?.count || 0,
              isCommentEnabled: post.is_comment_enabled ?? true,
              storeSlug,
              castName: castObj?.name ?? '不明なキャスト',
              castAvatar: castObj?.main_image_url || castObj?.image_url,
              image_url: post.blog_images?.[0]?.image_url,
            };
          }) ?? [];

      setAllPosts(posts);
    };

    fetchPosts();
  }, [storeSlug]);

  useEffect(() => {
    let filtered = [...allPosts];
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
  }, [sortBy, selectedHashtags, allPosts]);

  const handleHashtagFilter = (hashtags: string[]) => {
    setSelectedHashtags(hashtags);
  };

  const trendingPosts = filteredAndSortedPosts.slice(0, 3);
  const recommendedPosts = filteredAndSortedPosts.slice(3, 6);

  return (
    <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:py-8">
      {/* Hero Section (Optionally move this to server component if it's static) */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl">
          Photo Diary
        </h1>
        <p className="mx-auto max-w-2xl font-serif text-sm text-gray-600 sm:text-base">
          キャストが綴る、とびきり甘い&quot;日常&quot;の記録。誰にも言えない想いを、あなたにだけ。
        </p>
      </div>

      <div className="mb-6 sm:mb-8">
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:gap-4 lg:flex-row lg:items-center">
          <CastSearchDropdown className="flex-1" />
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm transition-colors hover:bg-pink-50"
            >
              <Filter size={16} />
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
                className={`p-2 ${viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'text-gray-600'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'text-gray-600'}`}
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

      <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="text-pink-500" size={18} />
            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">For You</h2>
          </div>
          <div className="space-y-3">
            {recommendedPosts.map((post) => (
              <DiaryCard key={post.id} post={post} compact />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center gap-2">
            <Flame className="text-red-500" size={18} />
            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">話題の日記</h2>
          </div>
          <div className="space-y-3">
            {trendingPosts.map((post, index) => (
              <DiaryCard key={post.id} post={post} compact trending={index + 1} />
            ))}
          </div>
        </div>
      </div>

      <div
        className={`grid gap-4 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
      >
        {filteredAndSortedPosts.map((post) => (
          <DiaryCard key={post.id} post={post} listView={viewMode === 'list'} />
        ))}
      </div>
    </main>
  );
};

export default DiaryListContent;
