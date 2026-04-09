'use client';
import CastCard from '@/components/sections/diary/CastCard';
import MessageSection from '@/components/sections/diary/MessageSection';
import RelatedPosts from '@/components/sections/diary/RelatedPosts';
import { mockDiaryPosts } from '@/data/diarydata';
import { getSupabasePublicUrl } from '@/lib/image-url';
import { getStoreBySlug } from '@/lib/actions/reservation';
import { supabase } from '@/lib/supabaseClient';
import type { PostType } from '@/types/diary';
import { Share2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface DiaryDetailContentProps {
  postId: string;
  slug: string;
}

const DiaryDetailContent: React.FC<DiaryDetailContentProps> = ({ postId, slug }) => {
  const [post, setPost] = useState<PostType | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dbStoreId, setDbStoreId] = useState<string | undefined>(undefined);
  const [castStats, setCastStats] = useState({ postsThisMonth: 0, lastPost: '投稿なし' });

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select(
            `
            id,
            title,
            content,
            created_at,
            published_at,
            updated_at,
            casts ( id, name, image_url, main_image_url, slug ),
            blog_images ( image_url ),
            blog_tags ( blog_tag_master ( name ) ),
            is_comment_enabled,
            blog_comments ( count )
          `,
          )
          .eq('id', postId)
          .eq('status', 'published')
          .single();

        if (error || !data) {
          const foundMock = mockDiaryPosts.find((p) => p.id === postId && p.storeSlug === slug);
          setPost(foundMock || null);
        } else {
          const castData = Array.isArray(data.casts) ? data.casts[0] : data.casts;
          const formatted: PostType = {
            id: data.id,
            title: data.title,
            content: data.content || '',
            excerpt: data.content ? data.content.slice(0, 100) : '',
            date: new Date(data.published_at || data.created_at).toLocaleDateString('ja-JP').replace(/\//g, '.'),
            updatedDate: data.updated_at ? new Date(data.updated_at).toLocaleDateString('ja-JP').replace(/\//g, '.') : undefined,
            tags: data.blog_tags?.map((t: any) => t.blog_tag_master?.name).filter(Boolean) || [],
            storeSlug: slug,
            castName: castData?.name || '不明なキャスト',
            castId: castData?.id || '',
            castSlug: castData?.slug || '',
            image: getSupabasePublicUrl(data.blog_images?.[0]?.image_url) ||
              'https://images.unsplash.com/photo-1516280440614-37939bbddcd2?q=80&w=800&auto=format&fit=crop',
            castAvatar: getSupabasePublicUrl(castData?.main_image_url || castData?.image_url) ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(castData?.name || 'anonymous')}`,
            readTime: Math.max(Math.ceil((data.content?.length || 0) / 400), 1),
            commentCount: data.blog_comments?.[0]?.count || 0,
            isCommentEnabled: data.is_comment_enabled ?? true,
            reactions: { total: 0, likes: 0, healing: 0, energized: 0, supportive: 0 },
          };
          setPost(formatted);
        }
        const dbStore = await getStoreBySlug(slug);
        if (dbStore) setDbStoreId(dbStore.id);

        // ✅ 閲覧数を加算（バックグラウンドで実行）
        supabase.rpc('increment_view_count', { post_id: postId }).then(({ error }) => {
          if (error) console.error('❌ Failed to increment view count:', error);
        });
      } catch (err) {
        console.error('❌ Error fetching post:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId, slug]);

  useEffect(() => {
    const fetchCastStats = async () => {
      if (!post?.castId) return;
      try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const { count } = await supabase
          .from('blogs')
          .select('*', { count: 'exact', head: true })
          .eq('cast_id', post.castId)
          .gte('created_at', firstDay);
        const { data } = await supabase
          .from('blogs')
          .select('created_at')
          .eq('cast_id', post.castId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        let lastStr = '投稿なし';
        if (data) {
          const postDate = new Date(data.created_at);
          const diff = Math.floor(
            (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
              new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate()).getTime()) /
              86400000,
          );
          lastStr = diff === 0 ? '今日' : diff === 1 ? '1日前' : `${diff}日前`;
        }
        setCastStats({ postsThisMonth: count || 0, lastPost: lastStr });
      } catch (err) {
        console.error(err);
      }
    };
    fetchCastStats();
  }, [post?.castId]);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(Math.min((scroll / height) * 100, 100));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4 text-center">
        <div>
          <Share2 size={48} className="mx-auto mb-4 text-pink-200" />
          <h2 className="mb-2 text-xl font-bold">記事が見つかりませんでした</h2>
          <Link href={`/store/${slug}/diary/diary-list`} className="text-pink-500 underline">
            一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:py-8">
      <div className="fixed left-0 right-0 top-0 z-[100] h-1 bg-pink-100">
        <div
          className="h-full bg-pink-500 transition-all"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <nav className="mb-4 pt-4 text-xs text-gray-600 sm:text-sm">
        <Link href="/" className="hover:text-pink-600">
          Home
        </Link>
        <span className="mx-1">{'>'}</span>
        <Link href={`/store/${slug}/diary/diary-list`} className="hover:text-pink-600">
          写メ日記
        </Link>
        <span className="mx-1">{'>'}</span>
        <Link
          href={`/store/${slug}/diary/cast/${encodeURIComponent(post.castName)}`}
          className="hover:text-pink-600"
        >
          {post.castName}の日記
        </Link>
        <span className="mx-1">{'>'}</span>
        <span>詳細</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <article className="mb-8 overflow-hidden rounded-2xl border border-pink-100 bg-white">
            <div className="flex justify-center bg-gray-50/50">
              <img
                src={post.image}
                alt={post.title}
                className="h-auto max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 sm:p-8">
              <h1 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">{post.title}</h1>
              <Link
                href={`/store/${slug}/cast/${post.castSlug}`}
                className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-pink-600"
              >
                <img src={post.castAvatar} className="h-8 w-8 rounded-full object-cover" alt="" />
                <span className="font-medium">
                  {post.castName} • 公開: {post.date}
                  {post.updatedDate && post.updatedDate !== post.date && (
                    <span className="ml-2 text-xs opacity-80 text-gray-400">
                      (最終更新: {post.updatedDate})
                    </span>
                  )}
                </span>
              </Link>
              <div className="prose mb-8 max-w-none whitespace-pre-wrap">{post.content}</div>

            </div>
          </article>
          <CastCard
            cast={{
              id: post.castId,
              slug: post.castSlug,
              storeSlug: post.storeSlug,
              name: post.castName,
              avatar: post.castAvatar,
              status: 'available',
              postsThisMonth: castStats.postsThisMonth,
              totalLikes: 1234,
              lastPost: castStats.lastPost,
              storeId: dbStoreId,
            }}
            expanded
          />
          <MessageSection postId={post.id} isEnabled={post.isCommentEnabled} />
        </div>
        <aside className="space-y-6">
          <RelatedPosts currentPostId={post.id} castId={post.castId} tagNames={post.tags} />
          <div className="rounded-2xl border border-pink-100 bg-white p-6">
            <h3 className="mb-4 font-bold">アクション</h3>
            <Link
              href={`/store/${slug}/diary/diary-list`}
              className="block w-full rounded-lg bg-pink-50 py-3 text-center text-pink-600"
            >
              全ての日記を見る
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DiaryDetailContent;
