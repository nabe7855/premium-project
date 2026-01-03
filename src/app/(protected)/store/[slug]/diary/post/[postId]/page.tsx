'use client';
import CastCard from '@/components/sections/diary/CastCard';
import MessageSection from '@/components/sections/diary/MessageSection';
import RelatedPosts from '@/components/sections/diary/RelatedPosts';
import { mockDiaryPosts } from '@/data/diarydata';
import type { PostType } from '@/types/diary';
import {
  ArrowLeft,
  Bookmark,
  Clapperboard as Clap,
  Clock,
  Heart,
  Share2,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const DiaryDetailPage = () => {
  const { postId, slug } = useParams(); // ← 修正済み
  const [post, setPost] = useState<PostType | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    console.log('🟡 useEffect 発火');
    console.log('🔸 postId:', postId);
    console.log('🔸 slug:', slug);
    console.log('🔸 mockDiaryPosts:', mockDiaryPosts);

    const foundPost = mockDiaryPosts.find((p) => p.id === postId && p.storeSlug === slug);

    console.log('🟢 foundPost:', foundPost);
    setPost(foundPost || null);
  }, [postId, slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-pink-500 border-t-transparent sm:h-16 sm:w-16"></div>
          <p className="text-sm text-gray-600 sm:text-base">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      {/* Progress Bar */}
      <div className="fixed left-0 right-0 top-0 z-40">
        <div className="h-0.5 bg-pink-100 sm:h-1">
          <div
            className="h-full bg-pink-500 transition-all duration-300 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>

      {/* Fixed Header */}
      <div className="fixed left-0 right-0 top-0.5 z-30 border-b border-pink-100 bg-white/95 py-2 backdrop-blur-sm sm:top-1 sm:py-3">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/store/${slug}/diary/diary-list`} // ← ストアごとに戻る
              className="flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-pink-600 sm:gap-2 sm:text-base"
            >
              <ArrowLeft size={16} className="sm:h-5 sm:w-5" />
              日記一覧に戻る
            </Link>
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href={`/store/${slug || ''}/diary/cast/${encodeURIComponent(post.castName || '')}`}
                className="flex items-center gap-1 rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700 transition-colors hover:bg-pink-200 sm:px-3 sm:py-1.5 sm:text-sm"
              >
                <User size={12} className="sm:h-3.5 sm:w-3.5" />
                {post.castName}の日記一覧
              </Link>
              <button className="p-1.5 text-gray-600 transition-colors hover:text-pink-600 sm:p-2">
                <Bookmark size={16} className="sm:h-5 sm:w-5" />
              </button>
              <button className="p-1.5 text-gray-600 transition-colors hover:text-pink-600 sm:p-2">
                <Share2 size={16} className="sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-4 pt-16 sm:px-4 sm:py-6 sm:pt-20 md:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-gray-600 sm:mb-6 sm:text-sm">
          <Link href="/" className="hover:text-pink-600">
            Home
          </Link>
          <span className="mx-1 sm:mx-2">{'>'}</span>
          <Link href={`/store/${slug}/diary/diary-list`} className="hover:text-pink-600">
            写メ日記
          </Link>
          <span className="mx-1 sm:mx-2">{'>'}</span>
          <Link
            href={`/store/${slug || ''}/diary/cast/${encodeURIComponent(post.castName || '')}`}
            className="hover:text-pink-600"
          >
            {post.castName}の日記
          </Link>
          <span className="mx-1 sm:mx-2">{'>'}</span>
          <span>詳細</span>
        </nav>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Article */}
            <article className="mb-6 overflow-hidden rounded-xl border border-pink-100 bg-white shadow-sm sm:mb-8 sm:rounded-2xl">
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-48 w-full object-cover sm:h-64 md:h-80"
                />
                <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs text-gray-600 backdrop-blur-sm sm:right-4 sm:top-4 sm:px-3 sm:text-sm">
                  <Clock size={12} className="mr-1 inline sm:h-3.5 sm:w-3.5" />約{post.readTime}
                  分で読めます
                </div>
              </div>
              <div className="p-4 sm:p-6 md:p-8">
                <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700 sm:px-3 sm:text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <h1 className="mb-3 font-serif text-xl font-bold leading-tight text-gray-800 sm:mb-4 sm:text-2xl md:text-3xl lg:text-4xl">
                  {post.title}
                </h1>
                <div className="mb-4 flex items-center gap-3 text-gray-600 sm:mb-6 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.castAvatar}
                      alt={post.castName}
                      className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
                    />
                    <div>
                      <Link
                        href={`/store/${slug || ''}/diary/cast/${encodeURIComponent(post.castName || '')}`}
                        className="text-sm font-medium text-gray-800 transition-colors hover:text-pink-600 sm:text-base"
                      >
                        {post.castName}
                      </Link>
                      <p className="text-xs sm:text-sm">{post.date}</p>
                    </div>
                  </div>
                </div>
                <div className="prose prose-sm sm:prose-base lg:prose-lg mb-6 max-w-none sm:mb-8">
                  <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                    {post.content}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t border-pink-100 py-3 sm:gap-4 sm:py-4">
                  <button className="flex items-center gap-1 rounded-full bg-pink-50 px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-100">
                    <Heart size={14} />
                    {post.reactions.likes}
                  </button>
                  <button className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1.5 text-sm text-yellow-600 hover:bg-yellow-100">
                    <Sparkles size={14} />
                    {post.reactions.healing}
                  </button>
                  <button className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100">
                    <Zap size={14} />
                    {post.reactions.energized}
                  </button>
                  <button className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-sm text-green-600 hover:bg-green-100">
                    <Clap size={14} />
                    {post.reactions.supportive}
                  </button>
                </div>
              </div>
            </article>

            <CastCard
              cast={{
                name: post.castName || '',
                avatar: post.castAvatar || '',
                status: 'available',
                postsThisMonth: 8,
                totalLikes: 1234,
                lastPost: '2日前',
              }}
              expanded
            />

            <MessageSection postId={post.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
              <div className="mb-3 flex items-center gap-2 sm:mb-4">
                <img
                  src={post.castAvatar}
                  alt={post.castName}
                  className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
                />
                <div>
                  <h3 className="text-base font-bold text-gray-800 sm:text-lg">{post.castName}</h3>
                  <p className="text-xs text-gray-600 sm:text-sm">キャスト</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link
                  href={`/store/${slug || ''}/diary/cast/${encodeURIComponent(post.castName || '')}`}
                  className="block w-full rounded-lg bg-pink-500 px-3 py-2 text-center text-sm text-white hover:bg-pink-600"
                >
                  {post.castName}の他の日記を見る
                </Link>
                <button className="w-full rounded-lg bg-pink-100 px-3 py-2 text-sm text-pink-700 hover:bg-pink-200">
                  このキャストを予約する
                </button>
              </div>
            </div>

            <RelatedPosts currentPostId={post.id} />

            <div className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
              <h3 className="mb-3 text-base font-bold text-gray-800 sm:mb-4 sm:text-lg">
                クイックアクション
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <button className="w-full rounded-lg bg-pink-100 px-3 py-2 text-sm text-pink-700 hover:bg-pink-200">
                  お気に入りに追加
                </button>
                <Link
                  href={`/store/${slug}/diary/diary-list`}
                  className="block w-full rounded-lg bg-gray-100 px-3 py-2 text-center text-sm text-gray-700 hover:bg-gray-200"
                >
                  全ての日記を見る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryDetailPage;
