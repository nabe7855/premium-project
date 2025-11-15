'use client';
import React from 'react';
import Link from 'next/link';
//import { useParams } from 'next/navigation';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import { mockDiaryPosts } from '@/data/diarydata';

interface RelatedPostsProps {
  currentPostId: string;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPostId }) => {
  const relatedPosts = mockDiaryPosts.filter((post) => post.id !== currentPostId).slice(0, 3);

  return (
    <div className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
      <h3 className="mb-3 text-base font-bold text-gray-800 sm:mb-4 sm:text-lg">関連する日記</h3>
      <div className="space-y-3 sm:space-y-4">
        {relatedPosts.map((post) => (
          <Link key={post.id} href={`/diary/posts/${post.id}`} className="block">
            <div className="flex gap-2 rounded-lg p-2 transition-colors hover:bg-pink-50 sm:gap-3 sm:p-3">
              <img
                src={post.image}
                alt={post.title}
                className="h-12 w-12 flex-shrink-0 rounded-lg object-cover sm:h-16 sm:w-16"
              />
              <div className="min-w-0 flex-1">
                <h4 className="mb-1 line-clamp-2 text-sm font-medium text-gray-800 sm:text-base">
                  {post.title}
                </h4>
                <p className="mb-2 text-xs text-gray-600 sm:text-sm">{post.castName}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 sm:gap-3">
                  <span className="flex items-center gap-1">
                    <Heart size={10} className="sm:h-3 sm:w-3" />
                    {post.reactions.total}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={10} className="sm:h-3 sm:w-3" />
                    {post.commentCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} className="sm:h-3 sm:w-3" />
                    {post.readTime}分
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
