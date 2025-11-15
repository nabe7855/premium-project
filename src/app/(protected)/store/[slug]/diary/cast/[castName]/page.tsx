'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import DiaryCard from '@/components/sections/diary/DiaryCard';
import CastCard from '@/components/sections/diary/CastCard';
import { mockDiaryPosts } from '@/data/diarydata';

const CastDiaryPage = () => {
  const { castName } = useParams<{ castName: string }>();
  const [castPosts, setCastPosts] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  const decodedCastName = castName ? decodeURIComponent(castName) : '';

  useEffect(() => {
    // Filter posts by cast name
    let filtered = mockDiaryPosts.filter((post) => post.castName === decodedCastName);

    // Sort posts
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

    setCastPosts(filtered);
  }, [decodedCastName, sortBy]);

  // Get cast info from first post
  const castInfo =
    castPosts.length > 0
      ? {
          name: decodedCastName,
          avatar: castPosts[0].castAvatar,
          status: 'available',
          postsThisMonth: castPosts.filter((post) => {
            const postDate = new Date(post.date);
            const currentDate = new Date();
            return (
              postDate.getMonth() === currentDate.getMonth() &&
              postDate.getFullYear() === currentDate.getFullYear()
            );
          }).length,
          totalLikes: castPosts.reduce((sum, post) => sum + post.reactions.total, 0),
          lastPost: castPosts.length > 0 ? '2日前' : '投稿なし',
        }
      : null;

  // SEO meta tags
  useEffect(() => {
    if (decodedCastName) {
      document.title = `${decodedCastName}の写メ日記一覧｜Strawberry Boys`;

      // Add canonical tag pointing to main diary page
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        existingCanonical.remove();
      }

      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = `${window.location.origin}/diary/diary-list`;
      document.head.appendChild(canonical);

      // Add meta description
      const existingDescription = document.querySelector('meta[name="description"]');
      if (existingDescription) {
        existingDescription.setAttribute(
          'content',
          `${decodedCastName}の写メ日記一覧。日常の素顔や想いを綴った特別な日記をお楽しみください。`,
        );
      }
    }

    return () => {
      // Cleanup on unmount
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.remove();
      }
    };
  }, [decodedCastName]);

  if (!decodedCastName) {
    return (
      <div className="flex min-h-screen items-center justify-center px-3 sm:px-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 sm:text-base">キャストが見つかりません</p>
          <Link
            href="/diary/diary-list"
            className="text-sm text-pink-600 hover:text-pink-700 sm:text-base"
          >
            日記一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-gray-600 sm:mb-6 sm:text-sm">
          <Link href="/" className="hover:text-pink-600">
            Home
          </Link>
          <span className="mx-1 sm:mx-2">{'>'}</span>
          <Link href="/diary/diary-list" className="hover:text-pink-600">
            写メ日記
          </Link>
          <span className="mx-1 sm:mx-2">{'>'}</span>
          <span>{decodedCastName}の日記</span>
        </nav>

        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/diary/diary-list"
            className="inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-pink-600 sm:gap-2 sm:text-base"
          >
            <ArrowLeft size={16} className="sm:h-5 sm:w-5" />
            日記一覧に戻る
          </Link>
        </div>

        {/* Cast Header */}
        <div className="mb-6 sm:mb-8">
          <div className="rounded-xl bg-gradient-to-r from-pink-100 to-pink-50 p-4 sm:rounded-2xl sm:p-6 md:p-8">
            <div className="mb-4 text-center sm:mb-6">
              <h1 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl lg:text-4xl">
                {decodedCastName}の写メ日記
              </h1>
              <p className="font-serif text-sm text-gray-600 sm:text-base md:text-lg">
                {decodedCastName}が綴る、特別な日常の記録
              </p>
            </div>

            {/* Cast Stats */}
            <div className="mb-4 grid grid-cols-3 gap-2 text-center sm:mb-6 sm:gap-4">
              <div className="rounded-lg bg-white/70 p-2 sm:p-3">
                <div className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">
                  {castPosts.length}
                </div>
                <div className="text-xs text-gray-600 sm:text-sm">投稿数</div>
              </div>
              <div className="rounded-lg bg-white/70 p-2 sm:p-3">
                <div className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">
                  {castInfo?.totalLikes.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-600 sm:text-sm">総いいね</div>
              </div>
              <div className="rounded-lg bg-white/70 p-2 sm:p-3">
                <div className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">
                  {castInfo?.postsThisMonth || 0}
                </div>
                <div className="text-xs text-gray-600 sm:text-sm">今月の投稿</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cast Info Card */}
        {castInfo && (
          <div className="mb-6 sm:mb-8">
            <CastCard cast={castInfo} expanded />
          </div>
        )}

        {/* Sort Controls */}
        <div className="mb-4 flex flex-col justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-0">
          <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
            {decodedCastName}の日記一覧 ({castPosts.length}件)
          </h2>
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

        {/* Posts Grid */}
        {castPosts.length > 0 ? (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {castPosts.map((post) => (
              <DiaryCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center sm:py-12">
            <div className="rounded-xl border border-pink-100 bg-white p-6 shadow-sm sm:rounded-2xl sm:p-8">
              <Calendar className="mx-auto mb-3 text-gray-400 sm:mb-4" size={32} />
              <h3 className="mb-2 text-lg font-bold text-gray-800 sm:text-xl">
                まだ日記がありません
              </h3>
              <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
                {decodedCastName}の最初の日記をお待ちください
              </p>
              <Link
                href="/diary/diary-list"
                className="inline-flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-sm text-white transition-colors hover:bg-pink-600 sm:px-6 sm:py-3 sm:text-base"
              >
                他の日記を見る
              </Link>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {castPosts.length > 0 && (
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

export default CastDiaryPage;
