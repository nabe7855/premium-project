'use client';
import React from 'react';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Clock,
  Flame,
  Sparkles,
  Zap,
  Clapperboard as Clap,
} from 'lucide-react';

interface DiaryCardProps {
  post: {
    id: string;
    storeSlug: string;
    title: string;
    excerpt: string;
    date: string;
    tags: string[];
    image_url?: string;
    castName?: string;
    castAvatar?: string;
    reactions: { total: number; likes?: number; healing?: number; energized?: number; supportive?: number };
    commentCount: number;
    readTime?: number;
    isNew?: boolean;
  };
  listView?: boolean;
  compact?: boolean;
  trending?: number;
}

const DiaryCard: React.FC<DiaryCardProps> = ({
  post,
  listView = false,
  compact = false,
  trending,
}) => {
  const cardClasses = compact
    ? 'bg-white rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-300 border border-pink-100'
    : listView
      ? 'bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-pink-100 overflow-hidden'
      : 'bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-pink-100 overflow-hidden';

  const linkHref = `/store/${post.storeSlug}/diary/post/${post.id}`;

  // ✅ サムネイル画像が無い場合のフォールバック
  const imageSrc = post.image_url || '/images/placeholder.png';

  // ✅ キャスト名とアバターのフォールバック
  const castName = post.castName || 'キャスト名未設定';
  const castAvatar = post.castAvatar || '/images/avatar-placeholder.png';

  // ✅ 読了時間はダミーで3分固定（将来的に content.length から算出可能）
  const readTime = post.readTime ?? 3;

  // ✅ 新着フラグは1週間以内投稿ならtrueにする
  const isNew = post.isNew ?? (new Date().getTime() - new Date(post.date).getTime() < 7 * 24 * 60 * 60 * 1000);

  if (compact) {
    return (
      <Link href={linkHref} className="block">
        <div className={cardClasses}>
          <div className="flex items-start gap-2 sm:gap-3">
            <img
              src={imageSrc}
              alt={post.title}
              className="h-12 w-12 flex-shrink-0 rounded-lg object-cover sm:h-16 sm:w-16"
            />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-1 sm:gap-2">
                {trending && (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-500 sm:text-sm">
                    <Flame size={12} className="sm:h-3.5 sm:w-3.5" />
                    {trending}
                  </span>
                )}
                <span className="text-xs text-gray-600 sm:text-sm">{castName}</span>
              </div>
              <h3 className="mb-1 line-clamp-2 text-sm font-medium text-gray-800 sm:text-base">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 sm:gap-3 sm:text-sm">
                <span className="flex items-center gap-1">
                  <Heart size={12} className="sm:h-3.5 sm:w-3.5" />
                  {post.reactions.total}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={12} className="sm:h-3.5 sm:w-3.5" />
                  {post.commentCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (listView) {
    return (
      <Link href={linkHref} className="block">
        <div className={cardClasses}>
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-6 sm:p-6">
            <div className="h-32 w-full flex-shrink-0 sm:w-48">
              <img
                src={imageSrc}
                alt={post.title}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-1 sm:gap-2">
                {post.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800 sm:text-xl">{post.title}</h3>
              <p className="mb-3 line-clamp-2 text-sm text-gray-600 sm:text-base">{post.excerpt}</p>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:gap-4 sm:text-sm">
                <div className="flex items-center gap-1">
                  <img
                    src={castAvatar}
                    alt={castName}
                    className="h-5 w-5 rounded-full sm:h-6 sm:w-6"
                  />
                  <span>{castName}</span>
                </div>
                <span>{post.date}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} className="sm:h-3.5 sm:w-3.5" />
                  {readTime}分
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="flex items-center gap-1 text-xs text-pink-600 sm:text-sm">
                  <Heart size={12} className="sm:h-4 sm:w-4" />
                  {post.reactions.likes ?? post.reactions.total}
                </span>
                <span className="flex items-center gap-1 text-xs text-yellow-600 sm:text-sm">
                  <Sparkles size={12} className="sm:h-4 sm:w-4" />
                  {post.reactions.healing ?? 0}
                </span>
                <span className="flex items-center gap-1 text-xs text-blue-600 sm:text-sm">
                  <Zap size={12} className="sm:h-4 sm:w-4" />
                  {post.reactions.energized ?? 0}
                </span>
                <span className="flex items-center gap-1 text-xs text-green-600 sm:text-sm">
                  <Clap size={12} className="sm:h-4 sm:w-4" />
                  {post.reactions.supportive ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={linkHref} className="block">
      <div className={cardClasses}>
        <div className="relative">
          <img src={imageSrc} alt={post.title} className="h-40 w-full object-cover sm:h-48" />
          <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs backdrop-blur-sm sm:right-3 sm:top-3">
            <Clock size={10} className="mr-1 inline sm:h-3 sm:w-3" />
            {readTime}分
          </div>
          {isNew && (
            <div className="absolute left-2 top-2 rounded-full bg-pink-500 px-2 py-1 text-xs font-bold text-white sm:left-3 sm:top-3">
              NEW
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4">
          <div className="mb-2 flex flex-wrap items-center gap-1 sm:gap-2">
            {post.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h3 className="mb-2 line-clamp-2 text-base font-bold text-gray-800 sm:text-lg">
            {post.title}
          </h3>
          <p className="mb-3 line-clamp-3 text-xs text-gray-600 sm:text-sm">{post.excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={castAvatar}
                alt={castName}
                className="h-6 w-6 rounded-full object-cover sm:h-8 sm:w-8"
              />
              <div>
                <p className="text-xs font-medium text-gray-800 sm:text-sm">{castName}</p>
                <p className="text-xs text-gray-500">{post.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1 text-xs text-pink-600 sm:text-sm">
                <Heart size={12} className="sm:h-3.5 sm:w-3.5" />
                {post.reactions.total}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500 sm:text-sm">
                <MessageCircle size={12} className="sm:h-3.5 sm:w-3.5" />
                {post.commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DiaryCard;
