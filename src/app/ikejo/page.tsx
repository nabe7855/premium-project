import MagazineBannerSlider from '@/components/ikejo/MagazineBannerSlider';
import { getMediaArticles, getMediaTags } from '@/lib/actions/media';
import {
  BookOpenIcon,
  ChevronRightIcon,
  CircleDollarSignIcon,
  HeartIcon,
  HeartPulseIcon,
  HomeIcon,
  InfoIcon,
  MessageCircleIcon,
  SparklesIcon,
  TrophyIcon,
  UsersIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function MagazineTopPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const selectedTag = searchParams.tag;

  // お客様向け・公開済みの記事のみを取得
  const result = await getMediaArticles('ikejo', 'user');
  let allArticles = result.success
    ? result.articles?.filter((a: any) => a.status === 'published') || []
    : [];

  // タグ一覧を取得
  const tagsResult = await getMediaTags('user');
  const allTags = tagsResult.success ? tagsResult.tags || [] : [];

  // タグでフィルタリング
  if (selectedTag) {
    allArticles = allArticles.filter((article: any) =>
      article.tags.some((t: any) => t.tag.name === selectedTag),
    );
  }

  const mainNav = [
    { title: 'トップページ', icon: HomeIcon, href: '/magazine', label: 'TOP PAGE' },
    {
      title: 'はじめての方へ',
      icon: InfoIcon,
      href: '/ikejo?tag=はじめての方へ',
      label: 'FIRST',
    },
    {
      title: '料金システム',
      icon: CircleDollarSignIcon,
      href: '/store/fukuoka',
      label: 'PRICE SYSTEM',
    },
    { title: 'セラピスト', icon: UsersIcon, href: '/store/fukuoka', label: 'THERAPISTS' },
    { title: 'ランキング', icon: TrophyIcon, href: '/store/fukuoka', label: 'RANKING' },
    { title: '口コミ', icon: MessageCircleIcon, href: '/store/fukuoka', label: 'REVIEW' },
  ];

  const subNav = [
    { title: '初めての方へ', href: '/ikejo?tag=初めての方へ' },
    { title: 'セルフケア', href: '/ikejo?tag=セルフケア' },
    { title: 'パートナーと', href: '/ikejo?tag=パートナーと' },
    { title: '恋愛・相談', href: '/ikejo?tag=恋愛・相談' },
    { title: '体験談', href: '/ikejo?tag=体験談' },
    { title: 'ラブグッズ', href: '/ikejo?tag=ラブグッズ' },
    { title: '女風ガイド', href: '/ikejo?tag=女風ガイド' },
  ];

  const renderEmptyState = () => (
    <div className="mt-8 rounded-2xl border border-pink-50 bg-[#FFFafb] p-16 text-center text-gray-500 shadow-sm">
      <HeartPulseIcon className="mx-auto mb-6 h-12 w-12 stroke-[1.5] text-pink-200" />
      <h3 className="mb-2 font-serif text-xl tracking-wide text-gray-700">記事を準備中です</h3>
      <p className="text-sm">心地よいコンテンツをお届けするため、現在制作を進めています。</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffafa]">
      {/* 1. アイコン付きトップナビ（中央ロゴ） */}
      <section className="border-b border-pink-50 bg-white py-4 md:py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-0">
            {/* 左側メニュー */}
            <div className="hidden flex-1 justify-end gap-6 md:flex">
              {mainNav.slice(0, 3).map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col items-center gap-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-pink-300 transition-colors group-hover:bg-pink-500 group-hover:text-white">
                    <item.icon size={22} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-700">{item.title}</span>
                  <span className="text-[8px] uppercase tracking-tighter text-pink-200">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* 中央ロゴ */}
            <div className="mx-12 flex flex-col items-center">
              <div className="mb-1 font-serif text-2xl font-bold uppercase tracking-[0.2em] text-pink-400">
                イケジョ
              </div>
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-pink-200">
                ラボ
              </span>
            </div>

            {/* 右側メニュー */}
            <div className="hidden flex-1 justify-start gap-6 md:flex">
              {mainNav.slice(3).map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col items-center gap-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-pink-300 transition-colors group-hover:bg-pink-500 group-hover:text-white">
                    <item.icon size={22} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-700">{item.title}</span>
                  <span className="text-[8px] uppercase tracking-tighter text-pink-200">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* モバイル用表示 */}
            <div className="grid grid-cols-6 gap-2 md:hidden">
              {mainNav.map((item) => (
                <Link key={item.title} href={item.href} className="flex flex-col items-center">
                  <item.icon size={20} className="text-pink-300" />
                  <span className="mt-1 scale-90 whitespace-nowrap text-[8px]">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* 2. メインバナースライダー（複数見え構成） */}
      <section className="bg-white">
        <MagazineBannerSlider />
      </section>
      {/* 3. サブナビゲーションバー — 6項目を1行に均等配置 */}
      <section className="bg-pink-400 text-white shadow-md">
        <div className="mx-auto max-w-6xl overflow-x-auto scrollbar-hide">
          <div className="flex h-12 w-full items-center justify-between px-2 text-[11px] font-bold md:px-6 md:text-xs">
            {subNav.map((item, idx) => (
              <div key={item.title} className="flex flex-1 items-center justify-center">
                <Link
                  href={item.href}
                  className="whitespace-nowrap px-1 tracking-wider transition-all hover:opacity-70 md:px-3"
                >
                  {item.title}
                </Link>
                {idx !== subNav.length - 1 && (
                  <div className="h-4 w-[1px] flex-shrink-0 bg-white/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* サイドプロモーション（LINE & YouTube） - スライダーの下にすっきりと配置 */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* LINE予約 */}
            <div className="relative flex items-center justify-between overflow-hidden rounded-[2.5rem] bg-[#51DB6A] p-8 text-white shadow-sm transition-transform hover:scale-[1.02]">
              <div className="relative z-10">
                <h3 className="mb-2 text-xl font-bold">LINEで簡単予約</h3>
                <p className="mb-6 text-xs opacity-90">トークだけで予約・相談が完結します</p>
                <button className="rounded-full bg-white px-6 py-2 text-xs font-bold text-[#51DB6A]">
                  友達登録する
                </button>
              </div>
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-md md:h-32 md:w-32">
                <MessageCircleIcon size={48} className="text-white" />
              </div>
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white opacity-5"></div>
            </div>

            {/* YouTube */}
            <div className="relative flex items-center justify-between overflow-hidden rounded-[2.5rem] bg-pink-100 p-8 text-gray-800 shadow-sm transition-transform hover:scale-[1.02]">
              <div className="relative z-10">
                <h3 className="mb-2 text-xl font-bold text-pink-500">公式YouTube</h3>
                <p className="mb-6 text-xs text-gray-500">
                  店舗の雰囲気やセラピストを動画でチェック
                </p>
                <button className="rounded-full bg-pink-500 px-6 py-2 text-xs font-bold text-white shadow-md">
                  動画を見る
                </button>
              </div>
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-pink-50 text-pink-400 md:h-32 md:w-32">
                <TrophyIcon size={48} strokeWidth={1} />
              </div>
              <div className="absolute inset-0 bg-white/40 opacity-0 transition-opacity group-hover:opacity-100"></div>
            </div>
          </div>
        </div>
      </section>
      <main className="mx-auto max-w-6xl px-6 py-20 pb-32">
        {/* シーン・悩み別ナビゲーション */}
        <section className="mb-24">
          <div className="mb-12 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-pink-300">
              Personalized Guide
            </p>
            <h2 className="font-serif text-3xl text-gray-800">お悩みやシーンから探す</h2>
            <div className="mx-auto mt-4 h-1 w-10 bg-pink-200"></div>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              {
                name: 'はじめての方へ',
                tag: '初心者ガイド',
                icon: HeartPulseIcon,
                desc: '安心の利用ガイド',
              },
              { name: 'セルフケア', tag: 'セルフケア', icon: SparklesIcon, desc: '心と体の整え方' },
              {
                name: '恋愛・相談',
                tag: '恋愛・コミュニケーション',
                icon: HeartIcon,
                desc: '大切な人との関係',
              },
              { name: '体験談', tag: '体験談', icon: BookOpenIcon, desc: 'ユーザーのリアルな声' },
              {
                name: '女風ガイド',
                tag: '女風ガイド',
                icon: SparklesIcon,
                desc: 'プロの癒やしの嗜み方',
              },
            ].map((cat) => (
              <Link
                key={cat.tag}
                href={`/ikejo/?tag=${cat.tag}`}
                className={`group flex flex-col items-center rounded-3xl border p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-100/50 ${
                  selectedTag === cat.tag
                    ? 'border-pink-300 bg-pink-50/50'
                    : 'border-pink-50 bg-white'
                }`}
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-pink-300 transition-all group-hover:bg-pink-500 group-hover:text-white">
                  <cat.icon size={30} strokeWidth={1} />
                </div>
                <h3 className="mb-1 text-[13px] font-bold tracking-wider text-gray-800 transition-colors group-hover:text-pink-500">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-gray-400">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 記事一覧セクション */}
        <section>
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-pink-300">
              Discover New Stories
            </p>
            <h2 className="font-serif text-3xl text-gray-800">
              {selectedTag ? `「${selectedTag}」の記事一覧` : '最新のコラム記事'}
            </h2>
            <div className="mx-auto mt-4 h-1 w-10 bg-pink-200"></div>
          </div>

          {/* タグフィルター */}
          <div className="mb-16 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/ikejo"
              className={`rounded-full px-6 py-2.5 text-[11px] font-bold tracking-widest transition-all ${
                !selectedTag
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-200'
                  : 'border border-pink-100 bg-white text-gray-400 hover:bg-pink-50'
              }`}
            >
              ALL
            </Link>
            {allTags.map((tag: any) => (
              <Link
                key={tag.id}
                href={`/ikejo/?tag=${tag.name}`}
                className={`rounded-full px-6 py-2.5 text-[11px] font-bold tracking-widest transition-all ${
                  selectedTag === tag.name
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-200'
                    : 'border border-pink-100 bg-white text-gray-400 hover:bg-pink-50'
                }`}
              >
                {tag.name.toUpperCase()}
              </Link>
            ))}
          </div>

          {allArticles.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
              {allArticles.map((article: any) => (
                <Link
                  key={article.id}
                  href={`/ikejo/${article.slug}`}
                  className="group flex flex-col overflow-hidden"
                >
                  <div className="relative mb-6 aspect-[16/10] w-full overflow-hidden rounded-[2rem] bg-pink-50 shadow-sm transition-shadow group-hover:shadow-xl group-hover:shadow-pink-100/30">
                    {article.thumbnail_url ? (
                      <Image
                        src={article.thumbnail_url}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <HeartPulseIcon className="h-10 w-10 text-pink-100" />
                      </div>
                    )}
                    {article.tags && article.tags.length > 0 && (
                      <span className="absolute left-6 top-6 rounded-full bg-white/95 px-4 py-1.5 text-[10px] font-bold text-pink-500 shadow-sm backdrop-blur-sm">
                        {article.tags[0].tag.name}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col px-2">
                    <div className="mb-3 text-[10px] font-bold tracking-[0.2em] text-gray-300">
                      {new Date(article.published_at || article.created_at)
                        .toLocaleDateString('ja-JP')
                        .replace(/\//g, '.')}
                    </div>
                    <h3 className="mb-4 line-clamp-2 font-serif text-lg font-bold leading-snug text-gray-800 transition-colors group-hover:text-pink-500">
                      {article.title}
                    </h3>
                    <p className="mb-6 line-clamp-2 text-xs leading-loose text-gray-500">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-[11px] font-bold text-pink-300">
                      <span className="border-b border-pink-100 pb-1">READ MORE</span>
                      <ChevronRightIcon size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* お店への導線 (CTA) */}
        <section className="mt-40">
          <div className="relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-[#fff7f9] to-[#fff0f3] p-12 text-center md:p-24">
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-10 text-pink-200">
                <HeartIcon size={48} strokeWidth={1} />
              </div>
              <h2 className="mb-8 font-serif text-3xl font-bold text-gray-800 md:text-5xl">
                心ほどける、最高の時間を。
              </h2>
              <p className="mx-auto mb-12 max-w-2xl text-sm leading-loose text-gray-500 md:text-base">
                プロのセラピストによる極上の癒やしで、
                <br />
                日常のストレスから解き放たれる贅沢なひとときを過ごしませんか？
                <br />
                お客様一人ひとりに寄り添った、心のこもったおもてなしをお約束します。
              </p>
              <Link
                href="/store/fukuoka"
                className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-10 py-4 text-sm font-bold text-white shadow-xl shadow-pink-200 transition-all hover:-translate-y-1 hover:bg-pink-600 hover:shadow-pink-300"
              >
                サロンの詳細・予約はこちら <ChevronRightIcon size={18} />
              </Link>
            </div>

            {/* 装飾 */}
            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-pink-100 opacity-30 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-orange-100 opacity-20 blur-3xl"></div>
          </div>
        </section>
      </main>
    </div>
  );
}
