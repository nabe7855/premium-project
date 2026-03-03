import { getMediaArticles, getMediaTags } from '@/lib/actions/media';
import {
  ChevronRightIcon,
  DumbbellIcon,
  HeartIcon,
  MessageSquareIcon,
  ShirtIcon,
  ShoppingBagIcon,
  SparklesIcon,
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

  // 採用・男性向け・公開済みの記事のみをサーバー側で取得
  const result = await getMediaArticles('recruit');
  let allArticles = result.success
    ? result.articles?.filter((a: any) => a.status === 'published') || []
    : [];

  // タグを取得
  const tagsResult = await getMediaTags('recruit');
  const allTags = tagsResult.success ? tagsResult.tags || [] : [];

  // フィルタリング
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
  ];

  return (
    <div className="min-h-screen bg-[#fcfdff]">
      {/* ヒーローセクション - 自信と成長を感じさせるデザイン */}
      <section className="relative mb-20 overflow-hidden bg-slate-900 px-6 py-20 text-white md:px-12 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1483389127117-b6a2102724ae?q=80&w=2000"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 text-xs font-bold tracking-widest text-blue-300 backdrop-blur-sm">
              <SparklesIcon size={14} /> FOR THE ULTIMATE IKEO LABO
            </span>
            <h1 className="mb-8 font-serif text-4xl leading-tight md:text-6xl">
              「モテる男」の、
              <br />
              すべてがここに。
            </h1>
            <p className="mb-10 text-lg leading-loose text-slate-300">
              見た目、会話、マインド。
              <br />
              自分自身の魅力を最大限に引き出し、理想の人生とキャリアを手に入れる。
              <br />
              大人な男性のための、総合自己研鑽メディア「イケオラボ」。
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/career/?tag=初心者ガイド"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-bold transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
              >
                まずはここからチェック
              </Link>
              <Link
                href="/store/fukuoka/recruit"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold backdrop-blur-sm transition-all hover:bg-white/20"
              >
                採用情報を見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* モテ度診断バナー */}
        <section className="mb-24">
          <Link
            href="/career/diagnostic"
            className="group relative block overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-900 to-indigo-900 p-8 shadow-2xl md:p-12"
          >
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 transition-transform duration-700 group-hover:scale-110">
              <ZapIcon className="h-full w-full" />
            </div>
            <div className="relative z-10">
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-blue-400">
                Diagnostic Tool
              </span>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                あなたの「モテるポテンシャル」を測定
              </h2>
              <p className="mb-8 max-w-lg text-blue-100/70">
                10の質問で、あなたの魅力と克服すべき課題をAIが分析。診断結果に合わせた個別カリキュラムをご提案します。
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-blue-400 group-hover:underline">
                診断を開始する <ChevronRightIcon size={16} />
              </div>
            </div>
          </Link>
        </section>

        {/* 悩み・シーン別ナビ */}
        <section className="mb-24">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-serif text-3xl text-slate-800">カテゴリーから探す</h2>
            <div className="mx-auto h-1 w-12 bg-blue-500"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {sections.map((cat) => (
              <Link
                key={cat.tag}
                href={`/career/?tag=${cat.tag}`}
                className={`group flex flex-col items-center rounded-3xl border p-8 transition-all hover:shadow-xl ${
                  selectedTag === cat.tag
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-100 bg-white'
                }`}
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all group-hover:bg-blue-600 group-hover:text-white">
                  <cat.icon size={32} strokeWidth={1} />
                </div>
                <h3 className="mb-1 font-bold text-slate-800">{cat.title}</h3>
                <p className="text-[10px] text-slate-400">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 記事一覧 */}
        <section>
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 font-serif text-3xl text-slate-800">
                {selectedTag ? `「${selectedTag}」の記事` : '最新のコラム'}
              </h2>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Knowledge for Growth
              </p>
            </div>
            {selectedTag && (
              <Link href="/career" className="text-xs font-bold text-blue-600 hover:underline">
                すべて表示
              </Link>
            )}
          </div>

          {allArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {allArticles.map((article: any) => (
                <Link
                  key={article.id}
                  href={`/career/${article.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-slate-100 bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    {article.thumbnail_url && (
                      <Image
                        src={article.thumbnail_url}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute left-4 top-4 flex flex-wrap gap-1">
                      {article.tags.map((t: any) => (
                        <span
                          key={t.tag.id}
                          className="rounded-full bg-slate-900/60 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur-md"
                        >
                          {t.tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-4 line-clamp-2 font-bold leading-relaxed text-slate-800 group-hover:text-blue-600">
                      {article.title}
                    </h3>
                    <p className="mb-6 line-clamp-2 text-xs leading-relaxed text-slate-400">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                      <span className="text-[10px] font-bold text-slate-300">
                        {new Date(article.published_at || article.created_at).toLocaleDateString()}
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
            <div className="rounded-[2.5rem] bg-slate-50 py-24 text-center">
              <ZapIcon className="mx-auto mb-4 h-12 w-12 text-slate-200" />
              <p className="text-slate-400">現在、新しいコンテンツを準備しております。</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
