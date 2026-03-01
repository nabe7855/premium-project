'use client';
import { getRelatedPosts } from '@/lib/diary/getRelatedPosts';
import { PostType } from '@/types/diary';
import { Clock, Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface RelatedPostsProps {
  currentPostId: string;
  castId: string;
  tagNames: string[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPostId, castId, tagNames }) => {
  const { slug } = useParams();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setIsLoading(true);
      const data = await getRelatedPosts({
        currentPostId,
        castId,
        storeSlug: slug as string,
        tagNames,
        limit: 3,
      });
      setPosts(data);
      setIsLoading(false);
    };

    if (currentPostId) {
      fetchRelated();
    }
  }, [currentPostId, castId, slug, tagNames]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
        <h3 className="mb-3 text-base font-bold text-gray-800 sm:mb-4 sm:text-lg">関連する日記</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex animate-pulse gap-3">
              <div className="h-12 w-12 rounded-lg bg-gray-200 sm:h-16 sm:w-16"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-3 w-1/2 rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
      <h3 className="mb-3 text-base font-bold text-gray-800 sm:mb-4 sm:text-lg">関連する日記</h3>
      <div className="space-y-3 sm:space-y-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/store/${slug}/diary/post/${post.id}`} className="block">
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
                    {Object.values(post.reactions || {}).reduce((a, b) => a + b, 0)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={10} className="sm:h-3 sm:w-3" />0
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
