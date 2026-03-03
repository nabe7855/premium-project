import { getMediaArticles } from '@/lib/actions/media';
import { ChevronRightIcon, HeartPulseIcon, SparklesIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function MagazineTopPage() {
  // お客様向け・公開済みの記事のみを取得
  const result = await getMediaArticles('user');
  const allArticles = result.success
    ? result.articles?.filter((a) => a.status === 'published') || []
    : [];

  const renderEmptyState = () => (
    <div className="mt-8 rounded-2xl border border-pink-50 bg-[#FFFafb] p-16 text-center text-gray-500 shadow-sm">
      <HeartPulseIcon className="mx-auto mb-6 h-12 w-12 stroke-[1.5] text-pink-200" />
      <h3 className="mb-2 font-serif text-xl tracking-wide text-gray-700">記事を準備中です</h3>
      <p className="text-sm">心地よいコンテンツをお届けするため、現在制作を進めています。</p>
    </div>
  );

  return (
    <>
      <div className="mb-20 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
        {/* レイヤーと重なりのあるフェミニンなヒーローデザイン */}
        <div className="relative order-2 lg:order-1">
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-pink-50/50 blur-3xl"></div>

          <div className="relative z-10">
            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-4 py-1.5 text-[11px] font-bold tracking-widest text-pink-600">
              <SparklesIcon size={12} /> SPECIAL EXPERIENCES
            </span>
            <h1 className="mb-8 font-serif text-4xl leading-tight text-gray-800 md:text-5xl">
              心と満ちる、
              <br />
              <span className="pr-1 font-medium italic text-pink-400">あなただけの</span>時間
            </h1>
            <p className="mb-10 max-w-lg text-base font-medium leading-loose text-gray-500">
              セルフケアから、専門家監修のコラム、そして日常から解き放たれる特別な癒やしまで。
              <br />
              Lumiere Magazineは、現代を生きる女性のためのパーソナル・ケアガイドです。
            </p>
            <div className="flex w-fit flex-col gap-4 rounded-full shadow-[0_4px_20px_rgba(255,192,203,0.15)] sm:flex-row">
              <Link
                href="/store/fukuoka"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-500 px-8 py-3.5 text-[13px] font-bold tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-pink-600"
              >
                提携サロンを見る <ChevronRightIcon size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* ヒーロー画像 (ふんわりとした雰囲気のプレースホルダー) */}
        <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-[2rem] bg-pink-100/50 shadow-2xl shadow-pink-100 lg:order-2 lg:aspect-[3/4]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-pink-500/20 to-transparent"></div>
          <div className="flex h-full items-center justify-center bg-[#fdf8f9]">
            {/* 実際の画像挿入箇所 */}
            <span className="font-serif italic tracking-wider text-pink-300">
              Image: Relaxing Vibe
            </span>
          </div>
        </div>
      </div>

      {/* 最新マガジン */}
      <section>
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-pink-400">
            Latest Articles
          </p>
          <h2 className="font-serif text-3xl text-gray-800">最新のコラム</h2>
        </div>

        {allArticles.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {allArticles.map((article: any) => (
              <Link
                key={article.id}
                href={`/magazine/${article.slug}`}
                className="group flex flex-col overflow-hidden"
              >
                {/* 記事サムネイル（角丸で上品に） */}
                <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-pink-50 shadow-sm">
                  {article.thumbnail_url ? (
                    <Image
                      src={article.thumbnail_url}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <HeartPulseIcon className="h-10 w-10 stroke-1 text-pink-200" />
                    </div>
                  )}
                  {/* カテゴリタグを浮かせる */}
                  {article.tags && article.tags.length > 0 && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold tracking-wider text-pink-600 shadow-sm backdrop-blur-sm">
                      {article.tags[0].tag.name}
                    </span>
                  )}
                </div>

                {/* 記事情報 */}
                <div className="flex flex-col px-2">
                  <div className="mb-3 text-[11px] font-medium tracking-widest text-gray-400">
                    {new Date(article.published_at || article.created_at)
                      .toLocaleDateString('ja-JP')
                      .replace(/\//g, '.')}
                  </div>
                  <h3 className="mb-3 line-clamp-2 font-serif text-lg leading-snug text-gray-800 transition-colors group-hover:text-pink-500">
                    {article.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-xs font-medium leading-loose text-gray-500">
                    {article.excerpt ||
                      '記事の一部を要約して表示します。この内容は管理画面から自由に変更・執筆することができます。'}
                  </p>
                  <div className="under-line-effect mt-auto block w-fit text-xs font-bold tracking-wider text-pink-400">
                    Read More
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
