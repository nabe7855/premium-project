import IkeoCarousel from '@/components/ikeo/IkeoCarousel';
import { getMediaArticles, getMediaTags } from '@/lib/actions/media';
import {
  ChevronRightIcon,
  DumbbellIcon,
  HeartIcon,
  MessageSquareIcon,
  ShirtIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TrophyIcon,
  ZapIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function CareerMediaTopPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const selectedTag = searchParams.tag;

  const result = await getMediaArticles('recruit');
  let allArticles = result.success
    ? result.articles?.filter((a: any) => a.status === 'published') || []
    : [];

  const tagsResult = await getMediaTags('recruit');
  const allTags = tagsResult.success ? tagsResult.tags || [] : [];

  if (selectedTag) {
    allArticles = allArticles.filter((article: any) =>
      article.tags.some((t: any) => t.tag.name === selectedTag),
    );
  }

  const sections = [
    {
      title: 'ファッション・美容',
      tag: 'ファッション・美容',
      icon: ShirtIcon,
      desc: '清潔感を磨く',
    },
    {
      title: '会話・コミュ力',
      tag: '会話・コミュ力',
      icon: MessageSquareIcon,
      desc: '心をつかむ。',
    },
    { title: '恋愛・デート', tag: '恋愛・デート', icon: HeartIcon, desc: '満足させる術。' },
    { title: '健康・ボディ', tag: '健康・ボディ', icon: DumbbellIcon, desc: '自信を鍛える。' },
    { title: 'ラブグッズ', tag: 'ラブグッズ', icon: ShoppingBagIcon, desc: '大人の嗜み。' },
    {
      title: 'セラピストの流儀',
      tag: 'セラピストの流儀',
      icon: TrophyIcon,
      desc: '誇り高きプロの道。',
    },
  ];

  const subNav = [
    { label: '初心者ガイド', tag: '初心者ガイド' },
    { label: 'ファッション', tag: 'ファッション・美容' },
    { label: '恋愛・デート', tag: '恋愛・デート' },
    { label: '会話力', tag: '会話・コミュ力' },
    { label: '健康・ボディ', tag: '健康・ボディ' },
    { label: 'ラブグッズ', tag: 'ラブグッズ' },
    { label: 'セラピストの流儀', tag: 'セラピストの流儀' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfdff]">
      {/* ① ファーストビュー：カルーセルスライダー */}
      <IkeoCarousel />

      {/* ② サブナビゲーション（スライダー直下） */}
      <nav className="sticky top-16 z-30 border-b border-slate-100 bg-slate-900 text-white shadow-md">
        <div className="mx-auto max-w-6xl overflow-x-auto scrollbar-hide">
          <div className="flex h-11 items-center justify-between px-4 text-[11px] font-bold md:px-6">
            {subNav.map((item, idx) => (
              <div key={item.tag} className="flex flex-1 items-center justify-center">
                <Link
                  href={`/ikeo?tag=${item.tag}`}
                  className={`whitespace-nowrap px-1 tracking-wider transition-all hover:text-blue-400 md:px-3 ${
                    selectedTag === item.tag ? 'text-blue-400' : 'text-slate-300'
                  }`}
                >
                  {item.label}
                </Link>
                {idx !== subNav.length - 1 && (
                  <div className="h-4 w-[1px] flex-shrink-0 bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* ③ メインコンテンツ */}
      <main className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        {/* モテ度診断バナー */}
        <section className="mb-14">
          <Link
            href="/ikeo/diagnostic"
            className="group relative block overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 p-6 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl md:rounded-3xl md:p-10"
          >
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 transition-transform duration-700 group-hover:scale-110">
              <ZapIcon className="h-full w-full" />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-widest text-blue-400">
                  Diagnostic Tool
                </span>
                <h2 className="mb-2 text-xl font-bold text-white md:text-2xl">
                  あなたの「モテるポテンシャル」を測定
                </h2>
                <p className="text-xs text-blue-100/60 md:text-sm">
                  10の質問で、AIがあなたの魅力を分析します。
                </p>
              </div>
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-all group-hover:bg-blue-500 md:h-14 md:w-14">
                <ChevronRightIcon size={20} />
              </div>
            </div>
          </Link>
        </section>

        {/* カテゴリナビ */}
        <section className="mb-14">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-slate-800 md:text-2xl">
              カテゴリから探す
            </h2>
            <div className="ml-4 h-[2px] flex-1 bg-slate-100" />
          </div>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-5 md:gap-4">
            {sections.map((cat) => (
              <Link
                key={cat.tag}
                href={`/ikeo/?tag=${cat.tag}`}
                className={`group flex flex-col items-center rounded-2xl border p-4 transition-all hover:shadow-lg md:p-6 ${
                  selectedTag === cat.tag
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all group-hover:bg-blue-600 group-hover:text-white md:h-14 md:w-14">
                  <cat.icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="text-center text-[11px] font-bold leading-snug text-slate-700 md:text-[13px]">
                  {cat.title}
                </h3>
                <p className="mt-1 text-[9px] text-slate-400 md:text-[10px]">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 記事一覧 */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-slate-800 md:text-2xl">
              {selectedTag ? `「${selectedTag}」の記事` : '最新コラム'}
            </h2>
            {selectedTag && (
              <Link href="/ikeo" className="text-[11px] font-bold text-blue-600 hover:underline">
                すべて表示
              </Link>
            )}
          </div>

          {allArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {allArticles.map((article: any) => (
                <Link
                  key={article.id}
                  href={`/ikeo/${article.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    {article.thumbnail_url && (
                      <Image
                        src={article.thumbnail_url}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1">
                      {article.tags.map((t: any) => (
                        <span
                          key={t.tag.id}
                          className="rounded-sm bg-slate-900/70 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-md"
                        >
                          {t.tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-3 line-clamp-2 font-bold leading-relaxed text-slate-800 transition-colors group-hover:text-blue-600">
                      {article.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-400">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                      <span className="text-[10px] font-bold text-slate-300">
                        {new Date(article.published_at || article.created_at).toLocaleDateString(
                          'ja-JP',
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600">
                        READ MORE <ChevronRightIcon size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 py-20 text-center">
              <ZapIcon className="mx-auto mb-4 h-10 w-10 text-slate-200" />
              <p className="text-sm text-slate-400">現在、新しいコンテンツを準備しております。</p>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="mt-20">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-10 text-center text-white shadow-2xl md:p-16">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
            <div className="relative z-10">
              <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400">
                <SparklesIcon size={14} /> Join Us
              </span>
              <h2 className="mb-4 font-serif text-2xl font-bold md:text-4xl">
                「選ばれる男」としての、一歩を。
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-sm leading-loose text-slate-400">
                洗練された環境で、自分自身の価値を証明してみませんか？
              </p>
              <Link
                href="/store/fukuoka/recruit"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500"
              >
                採用情報を見る <ChevronRightIcon size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
