'use client';
import CastCard from '@/components/sections/diary/CastCard';
import MessageSection from '@/components/sections/diary/MessageSection';
import RelatedPosts from '@/components/sections/diary/RelatedPosts';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import { useStore } from '@/contexts/StoreContext';
import { mockDiaryPosts } from '@/data/diarydata';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { supabase } from '@/lib/supabaseClient';
import type { PostType } from '@/types/diary';
import {
  ArrowLeft,
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
  const { postId, slug } = useParams();
  const [post, setPost] = useState<PostType | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [castStats, setCastStats] = useState({ postsThisMonth: 0, lastPost: '投稿なし' });
  const [topConfig, setTopConfig] = useState<StoreTopPageConfig | null>(null);
  const { store } = useStore();

  // ✅ 店舗設定取得
  useEffect(() => {
    const fetchConfig = async () => {
      const result = await getStoreTopConfig(slug as string);
      if (result.success) {
        setTopConfig(result.config as StoreTopPageConfig);
      } else {
        setTopConfig(DEFAULT_STORE_TOP_CONFIG);
      }
    };
    fetchConfig();
  }, [slug]);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        console.log('🟡 Fetching post from Supabase:', postId);
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
              image_url,
              slug
            ),
            blog_images (
              image_url
            ),
            blog_tags (
              blog_tag_master ( name )
            )
          `,
          )
          .eq('id', postId)
          .single();

        if (error || !data) {
          console.log('⚪️ Supabase fetch failed or no data, falling back to mock:', error?.message);
          const foundPost = mockDiaryPosts.find((p) => p.id === postId && p.storeSlug === slug);
          setPost(foundPost || null);
        } else {
          console.log('🟢 Supabase fetch success:', data);
          // PostType に変換
          const castData = Array.isArray(data.casts) ? data.casts[0] : data.casts;
          const formattedPost: PostType = {
            id: data.id,
            title: data.title,
            content: data.content || '',
            excerpt: data.content ? data.content.slice(0, 100) : '',
            date: new Date(data.created_at).toLocaleDateString('ja-JP').replace(/\//g, '.'),
            tags: data.blog_tags?.map((t: any) => t.blog_tag_master?.name).filter(Boolean) || [],
            storeSlug: slug as string,
            castName: castData?.name || '不明なキャスト',
            castId: castData?.id || '',
            castSlug: castData?.slug || '',
            image:
              data.blog_images?.[0]?.image_url ||
              'https://via.placeholder.com/800x600?text=No+Image',
            castAvatar: castData?.image_url || '/images/avatar-placeholder.png',
            readTime: Math.max(Math.ceil((data.content?.length || 0) / 400), 1),
            commentCount: 0,
            image_url: data.blog_images?.[0]?.image_url,
            reactions: {
              total: 0,
              likes: 0, // 実装に合わせて調整
              healing: 0,
              energized: 0,
              supportive: 0,
            },
          };
          setPost(formattedPost);
        }
      } catch (err) {
        console.error('❌ Error fetching post:', err);
        const foundPost = mockDiaryPosts.find((p) => p.id === postId && p.storeSlug === slug);
        setPost(foundPost || null);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, slug]);

  useEffect(() => {
    const fetchCastStats = async () => {
      if (!post?.castId) return;

      try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        // 今月の投稿数
        const { count: monthCount } = await supabase
          .from('blogs')
          .select('*', { count: 'exact', head: true })
          .eq('cast_id', post.castId)
          .gte('created_at', firstDayOfMonth);

        // 最終投稿日
        const { data: lastBlog } = await supabase
          .from('blogs')
          .select('created_at')
          .eq('cast_id', post.castId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        let lastPostStr = '投稿なし';
        if (lastBlog) {
          const postDate = new Date(lastBlog.created_at);
          // 時刻を 00:00:00 にリセットして日付の差を計算
          const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const d2 = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());
          const diffDays = Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));

          lastPostStr = diffDays === 0 ? '今日' : diffDays === 1 ? '1日前' : `${diffDays}日前`;
        }

        setCastStats({
          postsThisMonth: monthCount || 0,
          lastPost: lastPostStr,
        });
      } catch (err) {
        console.error('❌ Error fetching cast stats:', err);
      }
    };

    fetchCastStats();
  }, [post?.castId]);

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-pink-500 border-t-transparent sm:h-16 sm:w-16"></div>
          <p className="text-sm text-gray-600 sm:text-base">記事を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-pink-500">
            <Share2 size={32} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-800">記事が見つかりませんでした</h2>
          <p className="mb-6 text-sm text-gray-600">
            お探しの記事は削除されたか、URLが間違っている可能性があります。
          </p>
          <Link
            href={`/store/${slug}/diary/diary-list`}
            className="inline-flex items-center gap-2 rounded-lg bg-pink-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600"
          >
            日記一覧に戻る
          </Link>
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
                href={`/store/${slug}/diary/cast/${encodeURIComponent(post.castName)}`}
                className="flex items-center gap-1 rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700 transition-colors hover:bg-pink-200 sm:px-3 sm:py-1.5 sm:text-sm"
              >
                <User size={12} className="sm:h-3.5 sm:w-3.5" />
                {post.castName}の日記一覧
              </Link>
              <button className="p-1.5 text-gray-600 transition-colors hover:text-pink-600 sm:p-2">
                <Share2 size={16} className="sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-4 pb-24 pt-16 sm:px-4 sm:py-6 sm:pb-8 sm:pt-20 md:py-8">
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
            href={`/store/${slug}/diary/cast/${encodeURIComponent(post.castName)}`}
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
                        href={`/store/${slug}/diary/cast/${encodeURIComponent(post.castName)}`}
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
                id: post.castId,
                slug: post.castSlug,
                storeSlug: post.storeSlug,
                name: post.castName,
                avatar: post.castAvatar,
                status: 'available',
                postsThisMonth: castStats.postsThisMonth,
                totalLikes: 1234, // ご要望により一旦モック
                lastPost: castStats.lastPost,
              }}
              expanded
            />

            <MessageSection postId={post.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <RelatedPosts currentPostId={post.id} castId={post.castId} tagNames={post.tags} />

            <div className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
              <h3 className="mb-3 text-base font-bold text-gray-800 sm:mb-4 sm:text-lg">
                クイックアクション
              </h3>
              <div className="space-y-2 sm:space-y-3">
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

      {/* ✅ テンプレートに応じたフッターを表示 */}
      {topConfig &&
        (store?.template === 'yokohama' ? (
          <YokohamaFooter config={topConfig.footer} />
        ) : (
          <FukuokaFooter config={topConfig.footer} />
        ))}
    </div>
  );
};

export default DiaryDetailPage;
