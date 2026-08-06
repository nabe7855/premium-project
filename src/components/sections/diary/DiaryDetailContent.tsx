'use client';
import CastCard from '@/components/sections/diary/CastCard';
import MessageSection from '@/components/sections/diary/MessageSection';
import RelatedPosts from '@/components/sections/diary/RelatedPosts';
import { mockDiaryPosts } from '@/data/diarydata';
import { getSupabasePublicUrl } from '@/lib/image-url';
import { getStoreBySlug } from '@/lib/actions/reservation';
import { supabase } from '@/lib/supabaseClient';
import { PostType } from '@/types/diary';
import { Share2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState, useMemo } from 'react';
import { DiaryDetailSkeleton } from './DiaryDetailSkeleton';

interface DiaryDetailContentProps {
  postId: string;
  slug: string;
  initialPost?: PostType | null;
}

const DiaryDetailContent: React.FC<DiaryDetailContentProps> = ({ postId, slug, initialPost }) => {
  const [post, setPost] = useState<PostType | null>(initialPost || null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(!initialPost);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dbStoreId, setDbStoreId] = useState<string | undefined>(undefined);
  const [castStats, setCastStats] = useState({ postsThisMonth: 0, lastPost: '投稿なし' });
  const [castQuestionBoxUrl, setCastQuestionBoxUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      // initialPost が既にある場合は画面描画のローディングを行わない
      if (!initialPost) {
        setIsLoading(true);
      }
      
      try {
        // 店舗情報および記事データの取得
        const [postResult, storeResult] = await Promise.all([
          !initialPost
            ? supabase
                .from('blogs')
                .select(`
                  id, title, content, created_at, published_at, updated_at,
                  casts ( id, name, image_url, main_image_url, slug ),
                  blog_images ( image_url ),
                  blog_tags ( blog_tag_master ( name ) ),
                  is_comment_enabled,
                  blog_comments ( count )
                `)
                .eq('id', postId)
                .eq('status', 'published')
                .single()
            : Promise.resolve({ data: null, error: null }),
          getStoreBySlug(slug)
        ]);

        const { data, error } = postResult;
        const dbStore = storeResult;

        if (dbStore) setDbStoreId(dbStore.id);

        if (!initialPost) {
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
              images: (data.blog_images?.map((img: any) => getSupabasePublicUrl(img.image_url)).filter(Boolean) as string[]) || [],
              readTime: Math.max(Math.ceil((data.content?.length || 0) / 400), 1),
              commentCount: data.blog_comments?.[0]?.count || 0,
              isCommentEnabled: data.is_comment_enabled ?? true,
              reactions: { total: 0, likes: 0, healing: 0, energized: 0, supportive: 0 },
            };
            setPost(formatted);
          }
        }

        // 閲覧数を非同期で更新（レンダリングをブロックしない）
        supabase.rpc('increment_view_count', { post_id: postId }).then(({ error }) => {
          if (error) console.error('❌ Failed to increment view count:', error);
        });
      } catch (err) {
        console.error('❌ Error in data fetching:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId, slug, initialPost]);

  useEffect(() => {
    const fetchCastStats = async () => {
      if (!post?.castId) return;
      try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const [{ count }, { data }, { data: castRes }] = await Promise.all([
          supabase
            .from('blogs')
            .select('*', { count: 'exact', head: true })
            .eq('cast_id', post.castId)
            .gte('created_at', firstDay),
          supabase
            .from('blogs')
            .select('created_at')
            .eq('cast_id', post.castId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from('casts')
            .select('question_box_url')
            .eq('id', post.castId)
            .single()
        ]);

        if (castRes?.question_box_url) {
          setCastQuestionBoxUrl(castRes.question_box_url);
        }

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
    return <DiaryDetailSkeleton />;
  }

  if (!post) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4 text-center">
        <div>
          <Share2 size={48} className="mx-auto mb-4 text-pink-200" />
          <h2 className="mb-2 text-xl font-bold">記事が見つかりませんでした</h2>
          <Link href={`/store/${slug}/diary`} className="text-pink-500 underline">
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
        <Link href={`/store/${slug}/diary`} className="hover:text-pink-600">
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
            {(() => {
              const imageList = post.images && post.images.length > 0
                ? post.images
                : (post.image ? [post.image] : []);

              if (imageList.length === 0) return null;

              return (
                <div className="flex flex-col">
                  {imageList.map((imgSrc, idx) => {
                    const optimizedSrc = getSupabasePublicUrl(imgSrc) || imgSrc;
                    return (
                      <div key={idx} className="relative flex justify-center bg-gray-50/50 min-h-[300px] aspect-[4/3] w-full border-b border-pink-50 overflow-hidden">
                        <img
                          src={optimizedSrc}
                          alt={`${post.title} - ${post.castName}の日記${imageList.length > 1 ? ` - 画像${idx + 1}` : ''}`}
                          loading={idx === 0 ? "eager" : "lazy"}
                          decoding="async"
                          width={800}
                          height={600}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            <div className="p-4 sm:p-8">
              <p className="mb-2 text-[10px] sm:text-xs text-gray-400 font-normal">
                女性用風俗 ストロベリーボーイズ{slug === 'fukuoka' ? '福岡（博多・天神・中洲）' : '横浜（みなとみらい・関内）'} | {post.castName}の写メ日記
              </p>
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">{post.title}</h2>
              <Link
                href={`/store/${slug}/cast/${post.castSlug}`}
                className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-pink-600"
              >
                <img 
                  src={post.castAvatar} 
                  className="h-8 w-8 rounded-full object-cover" 
                  alt={`${post.castName} - プロフィール写真`}
                  loading="lazy"
                  decoding="async"
                  width={32}
                  height={32}
                />
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

              {/* 🚀 キャストが選択したリアルSEO集客タグ ＆ 地域LP連携リンク */}
              {(() => {
                const activeTags = post.tags && post.tags.length > 0 ? post.tags : (
                  slug === 'fukuoka' 
                    ? ['福岡女性用風俗', '福岡女風', '博多女風', '女風バレない']
                    : ['横浜女性用風俗', '横浜女風', '関内女風', '女風バレない']
                );

                return (
                  <div className="mt-8 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/60 to-pink-50/30 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-rose-600">
                      <Share2 className="h-3.5 w-3.5 text-rose-500" />
                      <span>この記事の関連タグ・検索キーワード</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-medium">
                      {activeTags.map((tagName, idx) => {
                        const cleanTag = tagName.replace(/^＃/, '');
                        // タグに応じた対応出張エリア/機能LPのリンク先マッピング
                        let href = `/store/${slug}/diary`;
                        if (cleanTag.includes('博多')) href = '/store/fukuoka/area/hakata';
                        else if (cleanTag.includes('天神')) href = '/store/fukuoka/area/tenjin';
                        else if (cleanTag.includes('関内')) href = '/store/yokohama/area/kannai';
                        else if (cleanTag.includes('みなとみらい')) href = '/store/yokohama/area/minatomirai';
                        else if (cleanTag.includes('料金')) href = `/store/${slug}/price`;
                        else if (cleanTag.includes('バレない') || cleanTag.includes('初めて')) href = `/store/${slug}/first-time`;
                        else if (cleanTag.includes('福岡')) href = '/store/fukuoka';
                        else if (cleanTag.includes('横浜')) href = '/store/yokohama';

                        return (
                          <Link
                            key={idx}
                            href={href}
                            className={`rounded-full px-3.5 py-1.5 transition-all duration-200 ${
                              idx < 2
                                ? 'bg-rose-500 text-white font-bold shadow-xs hover:bg-rose-600'
                                : 'bg-white text-slate-700 font-medium border border-rose-200 hover:border-rose-400 hover:text-rose-600'
                            }`}
                          >
                            ＃{cleanTag}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
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
              questionBoxUrl: castQuestionBoxUrl,
            }}
            expanded
            showQuestionBoxLink={true}
          />
          <MessageSection postId={post.id} isEnabled={post.isCommentEnabled} />
        </div>
        <aside className="space-y-6">
          <RelatedPosts currentPostId={post.id} castId={post.castId} tagNames={post.tags} />
          <div className="rounded-2xl border border-pink-100 bg-white p-6">
            <h3 className="mb-4 font-bold">アクション</h3>
            <Link
              href={`/store/${slug}/diary`}
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
