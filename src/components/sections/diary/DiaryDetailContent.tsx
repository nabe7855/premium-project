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
            {post.images && post.images.length > 0 ? (
              <div className="flex flex-col">
                {post.images.map((imgSrc, idx) => (
                  <div key={idx} className="relative flex justify-center bg-gray-50/50 min-h-[300px] border-b border-pink-50">
                    <img
                      src={imgSrc}
                      alt={`${post.title} - ${post.castName}の日記 - 画像${idx + 1}`}
                      className="h-auto max-h-[70vh] w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={`relative flex justify-center bg-gray-50/50 min-h-[300px] transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-200 border-t-pink-500"></div>
                  </div>
                )}
                <img
                  src={post.image}
                  alt={`${post.title} - ${post.castName}の日記`}
                  onLoad={() => setImageLoaded(true)}
                  className="h-auto max-h-[70vh] w-auto object-contain"
                />
              </div>
            )}
            <div className="p-4 sm:p-8">
              <h1 className="mb-2 text-[10px] sm:text-xs text-gray-400 font-normal">
                女性用風俗 日本最大級 ストロベリーボーイズ{slug === 'fukuoka' ? '福岡（博多・天神・中洲）' : '横浜（みなとみらい・関内）'} | {post.castName}の写メ日記
              </h1>
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">{post.title}</h2>
              <Link
                href={`/store/${slug}/cast/${post.castSlug}`}
                className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-pink-600"
              >
                <img 
                  src={post.castAvatar} 
                  className="h-8 w-8 rounded-full object-cover" 
                  alt={`${post.castName} - プロフィール写真`}
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

              {/* 🚀 リアル検索クエリSEOタグセット (中身に応じて自動判定・動的切り替え) */}
              {(() => {
                const textContent = `${post.title || ''} ${post.content || ''}`;
                const generatedTags: { label: string; href: string }[] = [];

                // 1. 元々の投稿タグがあれば優先追加
                if (post.tags && post.tags.length > 0) {
                  post.tags.forEach((t) => {
                    if (t) generatedTags.push({ label: `＃${t.replace(/^＃/, '')}`, href: `/store/${slug}/diary` });
                  });
                }

                // 2. 店舗および本文キーワードによる動的タグ判定
                if (slug === 'fukuoka') {
                  if (textContent.includes('博多')) {
                    generatedTags.push({ label: '＃博多女風', href: '/store/fukuoka/area/hakata' });
                    generatedTags.push({ label: '＃博多駅ラブホテル利用', href: '/store/fukuoka/area/hakata' });
                  }
                  if (textContent.includes('天神')) {
                    generatedTags.push({ label: '＃天神女性用風俗', href: '/store/fukuoka/area/tenjin' });
                  }
                  if (textContent.includes('中洲')) {
                    generatedTags.push({ label: '＃中洲女風', href: '/store/fukuoka/area/nakasu' });
                  }
                  // 基本地域ビッグキーワード（ランダム順序付与）
                  generatedTags.push({ label: '＃福岡女性用風俗', href: '/store/fukuoka/area/hakata' });
                  generatedTags.push({ label: '＃福岡女風', href: '/store/fukuoka/area/tenjin' });
                  generatedTags.push({ label: '＃福岡女風料金相場', href: '/store/fukuoka/price' });
                  generatedTags.push({ label: '＃女風バレない', href: '/store/fukuoka/first-time' });
                } else if (slug === 'yokohama') {
                  if (textContent.includes('関内')) {
                    generatedTags.push({ label: '＃関内女風', href: '/store/yokohama/area/kannai' });
                    generatedTags.push({ label: '＃関内ラブホテル利用', href: '/store/yokohama/area/kannai' });
                  }
                  if (textContent.includes('みなとみらい')) {
                    generatedTags.push({ label: '＃みなとみらい女性用風俗', href: '/store/yokohama/area/minatomirai' });
                  }
                  if (textContent.includes('桜木町')) {
                    generatedTags.push({ label: '＃桜木町女風出張', href: '/store/yokohama/area/sakuragicho' });
                  }
                  // 基本地域ビッグキーワード
                  generatedTags.push({ label: '＃横浜女性用風俗', href: '/store/yokohama/area/kannai' });
                  generatedTags.push({ label: '＃横浜女風', href: '/store/yokohama/area/minatomirai' });
                  generatedTags.push({ label: '＃横浜女風料金相場', href: '/store/yokohama/price' });
                  generatedTags.push({ label: '＃女風バレない', href: '/store/yokohama/first-time' });
                } else {
                  generatedTags.push({ label: '＃女性用風俗', href: `/store/${slug}` });
                  generatedTags.push({ label: '＃女風出張ホスト', href: `/store/${slug}` });
                  generatedTags.push({ label: '＃女風バレない', href: `/store/${slug}` });
                }

                // 3. 重複除去して最大6個にスライス
                const uniqueTags = Array.from(
                  new Map(generatedTags.map((item) => [item.label, item])).values(),
                ).slice(0, 7);

                return (
                  <div className="mt-8 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/60 to-pink-50/30 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-rose-600">
                      <Share2 className="h-3.5 w-3.5 text-rose-500" />
                      <span>この記事の関連検索キーワード</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-medium">
                      {uniqueTags.map((tagObj, idx) => (
                        <Link
                          key={idx}
                          href={tagObj.href}
                          className={`rounded-full px-3 py-1 transition ${
                            idx < 2
                              ? 'bg-white text-rose-600 border border-rose-200 shadow-2xs hover:bg-rose-500 hover:text-white'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-rose-300'
                          }`}
                        >
                          {tagObj.label}
                        </Link>
                      ))}
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
