'use client';
import CastCard from '@/components/sections/diary/CastCard';
import DiaryCard from '@/components/sections/diary/DiaryCard';
import { getDiaryPostsByCastId } from '@/lib/diary/getDiaryPostsByCastId';
import { supabase } from '@/lib/supabaseClient';
import type { PostType } from '@/types/diary';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const CastDiaryPage = () => {
  const { castName, slug } = useParams();
  const [castPosts, setCastPosts] = useState<PostType[]>([]);
  const [castInfo, setCastInfo] = useState<any>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);

  const decodedCastName = castName ? decodeURIComponent(castName as string) : '';

  useEffect(() => {
    const fetchData = async () => {
      if (!decodedCastName) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // 1. キャスト情報を取得 (名前で検索)
        const { data: castData, error: castError } = await supabase
          .from('casts')
          .select('id, name, slug, image_url')
          .eq('name', decodedCastName)
          .maybeSingle();

        if (castError || !castData) {
          console.error('❌ Cast not found:', decodedCastName, castError);
          setIsLoading(false);
          return;
        }

        const formattedCastInfo = {
          id: castData.id,
          slug: castData.slug,
          storeSlug: slug as string,
          name: castData.name,
          avatar: castData.image_url || '/images/avatar-placeholder.png',
          status: 'available', // TODO: リアルなステータス取得
          postsThisMonth: 0,
          totalLikes: 0,
          lastPost: '2日前',
        };
        setCastInfo(formattedCastInfo);

        // 2. 日記投稿を取得
        const posts = await getDiaryPostsByCastId(castData.id, slug as string);

        // 統計情報の更新
        formattedCastInfo.postsThisMonth = posts.filter((post) => {
          const postDate = new Date(post.date);
          const now = new Date();
          return (
            postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear()
          );
        }).length;
        formattedCastInfo.totalLikes = posts.reduce(
          (sum, post) => sum + (post.reactions.likes || 0),
          0,
        );

        setCastPosts(posts);
      } catch (error) {
        console.error('❌ Error fetching cast diary data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [decodedCastName, slug]);

  // ソート処理
  const sortedPosts = [...castPosts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'popular':
        const aTotal = Object.values(a.reactions).reduce((acc, val) => acc + val, 0);
        const bTotal = Object.values(b.reactions).reduce((acc, val) => acc + val, 0);
        return bTotal - aTotal;
      default:
        return 0;
    }
  });

  // SEO
  useEffect(() => {
    if (decodedCastName) {
      document.title = `${decodedCastName}の写メ日記一覧｜Strawberry Boys`;
    }
  }, [decodedCastName]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!castInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center px-3 sm:px-4">
        <div className="text-center">
          <p className="mb-4 text-sm text-gray-600 sm:text-base">キャストが見つかりません</p>
          <Link
            href={`/store/${slug}/diary/diary-list`}
            className="rounded-lg bg-pink-500 px-6 py-2 text-sm text-white hover:bg-pink-600 sm:text-base"
          >
            日記一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white pb-24">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:py-8">
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
          <span>{decodedCastName}の日記</span>
        </nav>

        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link
            href={`/store/${slug}/diary/diary-list`}
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
                  {castInfo.totalLikes.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 sm:text-sm">総いいね</div>
              </div>
              <div className="rounded-lg bg-white/70 p-2 sm:p-3">
                <div className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">
                  {castInfo.postsThisMonth}
                </div>
                <div className="text-xs text-gray-600 sm:text-sm">今月の投稿</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cast Info Card */}
        <div className="mb-6 sm:mb-8">
          <CastCard cast={castInfo} expanded />
        </div>

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
          </select>
        </div>

        {/* Posts Grid */}
        {sortedPosts.length > 0 ? (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {sortedPosts.map((post) => (
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
                href={`/store/${slug}/diary/diary-list`}
                className="inline-flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-sm text-white transition-colors hover:bg-pink-600 sm:px-6 sm:py-3 sm:text-base"
              >
                他の日記を見る
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CastDiaryPage;
