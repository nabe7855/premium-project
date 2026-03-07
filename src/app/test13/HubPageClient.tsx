'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Play,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/* ─── 静的データ ─────────────────────────────────── */

const FAQ_DATA = [
  {
    id: 1,
    question: '初めてでも大丈夫ですか？',
    answer:
      'はい、初回の方には専任のコンシェルジュが丁寧にサポートいたします。事前のカウンセリングから当日のフォローまで、不安なことがあれば何でもお気軽にご相談ください。初回限定の割引もご用意しております。',
  },
  {
    id: 2,
    question: '料金システムはどうなっていますか？',
    answer:
      '時間制の明確な料金システムです。表示価格以外の追加料金等は一切発生いたしません。お支払いは現金・クレジットカード・電子マネーに対応しています。',
  },
  {
    id: 3,
    question: 'キャンセルはできますか？',
    answer:
      'ご予約の24時間前まででしたら無料でキャンセル可能です。24時間以内のキャンセルについては、プランにより異なりますが、料金の50〜100%のキャンセル料が発生する場合がございます。',
  },
  {
    id: 4,
    question: 'どのような方がキャストとして在籍していますか？',
    answer:
      '20代から30代前半の方を中心に、厳格な選考（採用率3%）を通過した方のみが在籍しています。定期的な研修とマナー講習を受けており、安心してご利用いただけます。',
  },
  {
    id: 5,
    question: 'プライバシーは守られますか？',
    answer:
      'お客様の個人情報は厳重に管理しており、第三者に開示することは一切ございません。キャストにも守秘義務を徹底しており、安心してご利用いただけます。匿名でのご利用も可能です。',
  },
  {
    id: 6,
    question: 'AIマッチングはどのような仕組みですか？',
    answer:
      '心理学に基づいた3つの質問にお答えいただくことで、あなたの性格や好みを分析し、最適なキャストをマッチングします。95%以上のお客様に「期待以上だった」とご満足いただいています。',
  },
];

const GUIDE_ARTICLES = [
  {
    title: '初めての方へ、完全ガイド',
    desc: '予約から当日の流れまで、ステップ別に分かりやすく解説します。',
    icon: '🌸',
    tag: 'はじめて',
    href: '/guide',
  },
  {
    title: 'キャストの選び方ガイド',
    desc: 'タイプ別・目的別に最適なキャストを選ぶためのポイントを紹介。',
    icon: '✨',
    tag: '選び方',
    href: '/guide/cast-select',
  },
  {
    title: '本指名・フリー指名の違いとは？',
    desc: '初回の方に多いご質問を丁寧に解説します。',
    icon: '💡',
    tag: 'よくある疑問',
    href: '/guide/nomination',
  },
  {
    title: 'プランと料金の完全解説',
    desc: 'コースの種類と料金の仕組みをシンプルに説明します。',
    icon: '💰',
    tag: '料金・プラン',
    href: '/plan',
  },
];

interface HubPageClientProps {
  casts: any[];
  stores: any[];
  videos: any[];
  diaries: any[];
  mediaArticles: {
    userArticles: any[]; // イケジョラボ + スイートステイ
    recruitArticles: any[]; // イケオラボ
  };
}

/* ─── メインコンポーネント ─────────────────────────────── */

export default function HubPageClient({
  casts,
  stores,
  videos,
  diaries,
  mediaArticles,
}: HubPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'cast' | 'store' | 'video'>('cast');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 検索フィルター
  const filteredCasts = casts.filter(
    (c) =>
      !searchQuery ||
      c.name?.includes(searchQuery) ||
      c.catch_copy?.includes(searchQuery) ||
      c.profile?.includes(searchQuery),
  );

  const FALLBACK_CAST_IMG =
    'https://images.unsplash.com/photo-1544161515-4ae6b91827d1?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white selection:bg-amber-500/30">
      {/* ─── JSON-LD 構造化データ (AIO対応) ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_DATA.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }),
        }}
      />

      {/* ─── 1. HERO + 検索セクション ─── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-32 pt-24">
        {/* 背景グラデーション */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
          <div className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[150px]" />
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-pink-500/5 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-6 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.3em] text-amber-400">
              PLATFORM HUB — Japan's No.1 Wellness
            </span>
            <h1 className="mb-6 font-serif text-5xl font-black leading-tight tracking-tight md:text-7xl lg:text-8xl">
              すべての「整え」を、
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                この一箇所
              </span>
              で。
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-slate-400 md:text-xl">
              全国の支店、オウンドメディア、そして日々更新される数千の物語。
              <br className="hidden md:block" />
              情報の「中継地点」として、最適なウェルネス体験をナビゲートします。
            </p>
          </motion.div>

          {/* 検索バー */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto max-w-3xl"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-6 h-6 w-6 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="キャスト名・お悩み・目的・店舗名で探す..."
                className="h-20 w-full rounded-2xl border border-white/10 bg-white/5 pl-16 pr-40 text-lg text-white placeholder-slate-500 outline-none ring-amber-500/30 backdrop-blur-xl transition-all focus:border-amber-500/40 focus:ring-2"
              />
              <button className="absolute right-3 rounded-xl bg-amber-500 px-6 py-3 text-sm font-black text-black transition-all hover:scale-105 hover:bg-amber-400 active:scale-95">
                探す
              </button>
            </div>

            {/* クイックナビ */}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {['はじめて', '癒やし系', '話上手', '近くの店舗', '今日空き'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-400 transition-all hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-400"
                >
                  # {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 店舗マーキー */}
        {stores.length > 0 && (
          <div className="absolute bottom-0 z-10 w-full overflow-hidden border-t border-white/5 bg-black/50 backdrop-blur-md">
            <div className="animate-scroll-text flex whitespace-nowrap py-4">
              {[...stores, ...stores].map((store, i) => (
                <Link
                  key={i}
                  href={`/store/${store.slug}`}
                  className="group mx-8 flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-amber-400"
                >
                  <MapPin className="h-3 w-3 text-amber-500" />
                  {store.name}
                  <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ─── 2. コンテンツ切り替えタブ (キャスト / 店舗 / 動画) ─── */}
      <section className="bg-slate-900 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {/* タブ */}
          <div className="mb-12 flex gap-2 overflow-x-auto pb-2">
            {(
              [
                { id: 'cast', label: '人気キャスト', icon: <Users className="h-4 w-4" /> },
                { id: 'store', label: '店舗一覧', icon: <MapPin className="h-4 w-4" /> },
                { id: 'video', label: '動画', icon: <Play className="h-4 w-4" /> },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-black transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* キャストグリッド */}
            {activeTab === 'cast' && (
              <motion.div
                key="cast"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {filteredCasts.length === 0 ? (
                  <p className="py-20 text-center text-slate-500">
                    該当するキャストが見つかりませんでした。
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {(searchQuery ? filteredCasts : casts).slice(0, 15).map((cast) => (
                      <motion.div
                        key={cast.id}
                        whileHover={{ y: -6, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="group cursor-pointer"
                      >
                        <Link href={`/cast/${cast.slug || cast.id}`}>
                          <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-slate-800">
                            <img
                              src={cast.image_url || cast.main_image_url || FALLBACK_CAST_IMG}
                              alt={cast.name}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = FALLBACK_CAST_IMG;
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                              <span className="block text-xs font-black text-amber-400">
                                詳細を見る →
                              </span>
                            </div>
                            {cast.age && (
                              <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                                {cast.age}歳
                              </div>
                            )}
                          </div>
                          <div className="font-bold text-white">{cast.name}</div>
                          {cast.catch_copy && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                              {cast.catch_copy}
                            </p>
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
                <div className="mt-10 text-center">
                  <Link
                    href="/casts"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-4 text-sm font-black text-slate-300 transition-all hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-400"
                  >
                    全キャストを見る <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* 店舗グリッド */}
            {activeTab === 'store' && (
              <motion.div
                key="store"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {stores.length === 0 ? (
                  <p className="py-20 text-center text-slate-500">店舗情報を読み込み中...</p>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {stores.map((store) => (
                      <motion.div
                        key={store.id}
                        whileHover={{ y: -4 }}
                        className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-800 transition-all hover:border-amber-500/30"
                      >
                        <Link href={`/store/${store.slug}`}>
                          <div className="relative aspect-video overflow-hidden">
                            {store.image_url ? (
                              <img
                                src={store.image_url}
                                alt={store.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-gradient-to-br from-amber-500/20 to-pink-500/20">
                                <MapPin className="h-12 w-12 text-amber-500/40" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                          </div>
                          <div className="p-5">
                            <h3 className="mb-1 text-lg font-black text-white group-hover:text-amber-400">
                              {store.name}
                            </h3>
                            {store.address && (
                              <p className="mb-3 flex items-center gap-1 text-xs text-slate-500">
                                <MapPin className="h-3 w-3" /> {store.address}
                              </p>
                            )}
                            {store.catch_copy && (
                              <p className="line-clamp-2 text-sm text-slate-400">
                                {store.catch_copy}
                              </p>
                            )}
                            <div className="mt-4 flex items-center gap-1 text-xs font-black text-amber-500">
                              詳細を見る <ArrowRight className="h-3 w-3" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 動画グリッド */}
            {activeTab === 'video' && (
              <motion.div
                key="video"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {videos.length === 0 ? (
                  <p className="py-20 text-center text-slate-500">
                    動画コンテンツは近日公開予定です。
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {videos.map((video: any) => (
                      <motion.div
                        key={video.id}
                        whileHover={{ y: -4 }}
                        className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10"
                      >
                        {video.thumbnail_url ? (
                          <img
                            src={video.thumbnail_url}
                            className="aspect-video w-full object-cover"
                          />
                        ) : (
                          <div className="flex aspect-video items-center justify-center bg-slate-800">
                            <Play className="h-10 w-10 text-amber-500" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500">
                            <Play className="h-5 w-5 text-black" />
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm font-bold text-white">{video.title || '動画'}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {(video.stores as any)?.name}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── 3. 写メ日記フィード (UGC) ─── */}
      {diaries.length > 0 && (
        <section className="bg-white px-6 py-20 text-slate-900">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12">
              <span className="mb-3 block text-xs font-black uppercase tracking-[0.3em] text-amber-600">
                Daily Updates
              </span>
              <h2 className="font-serif text-4xl font-black leading-tight">
                今の雰囲気を、
                <br />
                <span className="text-amber-600">リアルに感じる。</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {diaries.slice(0, 6).map((d: any) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 transition-all hover:shadow-xl"
                >
                  {d.images?.[0]?.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={d.images[0].image_url}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="mb-3 text-xs font-black uppercase tracking-widest text-amber-600">
                      写メ日記
                    </p>
                    <h3 className="mb-2 text-lg font-bold leading-tight text-slate-900">
                      {d.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-slate-500">{d.content}</p>
                    <button className="mt-4 flex items-center gap-2 text-xs font-black text-amber-600 transition-all hover:gap-4">
                      Read More <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 3.5 Group Media Ecosystem (オウンドメディア) ─── */}
      <section className="bg-slate-950 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 border-l-4 border-amber-500 pl-6">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.3em] text-amber-500">
              Group Media Ecosystem
            </span>
            <h2 className="font-serif text-4xl font-black">運営メディアを探る</h2>
            <p className="mt-2 text-slate-400">
              ライフスタイル、ウェルネス、ホテルガイド。このグループの3つのメディアがマイライフを豊かにします。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* イケジョラボ */}
            <motion.div
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-b from-pink-950/40 to-slate-900"
            >
              <Link href="/ikejo">
                <div className="relative p-8">
                  <div className="absolute right-6 top-6 text-5xl opacity-20">💗</div>
                  <span className="mb-4 inline-block rounded-full bg-pink-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-pink-400">
                    Women's Wellness
                  </span>
                  <h3 className="mb-2 text-2xl font-black text-white transition-colors group-hover:text-pink-400">
                    イケジョラボ
                  </h3>
                  <p className="mb-6 text-sm text-slate-400">
                    自立した女性のライフスタイルメディア。セルフケア・恋愛・体験談などを記事で深掘り。
                  </p>

                  {mediaArticles.userArticles.length > 0 ? (
                    <div className="space-y-3">
                      {mediaArticles.userArticles.slice(0, 2).map((article: any) => (
                        <div
                          key={article.id}
                          className="flex items-start gap-3 rounded-xl bg-white/5 p-3"
                        >
                          {article.thumbnail_url && (
                            <img
                              src={article.thumbnail_url}
                              className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                              alt={article.title}
                            />
                          )}
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-xs font-bold leading-snug text-white">
                              {article.title}
                            </p>
                            {article.tags?.[0] && (
                              <span className="mt-1 block text-[10px] text-pink-400">
                                {article.tags[0].tag.name}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl bg-white/5 p-4 text-xs text-slate-500">
                      記事を準備中です
                    </p>
                  )}

                  <div className="mt-6 flex items-center gap-2 text-sm font-black text-pink-400 transition-all group-hover:gap-4">
                    記事を読む <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* イケオラボ */}
            <motion.div
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-b from-blue-950/40 to-slate-900"
            >
              <Link href="/ikeo">
                <div className="relative p-8">
                  <div className="absolute right-6 top-6 text-5xl opacity-20">⚡</div>
                  <span className="mb-4 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                    Men's Wellness
                  </span>
                  <h3 className="mb-2 text-2xl font-black text-white transition-colors group-hover:text-blue-400">
                    イケオラボ
                  </h3>
                  <p className="mb-6 text-sm text-slate-400">
                    メンズウェルネス &
                    スタイル。ファッション・恋愛・会話力から「選ばれる男」をナビゲート。
                  </p>

                  {mediaArticles.recruitArticles.length > 0 ? (
                    <div className="space-y-3">
                      {mediaArticles.recruitArticles.slice(0, 2).map((article: any) => (
                        <div
                          key={article.id}
                          className="flex items-start gap-3 rounded-xl bg-white/5 p-3"
                        >
                          {article.thumbnail_url && (
                            <img
                              src={article.thumbnail_url}
                              className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                              alt={article.title}
                            />
                          )}
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-xs font-bold leading-snug text-white">
                              {article.title}
                            </p>
                            {article.tags?.[0] && (
                              <span className="mt-1 block text-[10px] text-blue-400">
                                {article.tags[0].tag.name}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl bg-white/5 p-4 text-xs text-slate-500">
                      記事を準備中です
                    </p>
                  )}

                  <div className="mt-6 flex items-center gap-2 text-sm font-black text-blue-400 transition-all group-hover:gap-4">
                    記事を読む <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* スイートステイ */}
            <motion.div
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-b from-amber-950/30 to-slate-900"
            >
              <Link href="/sweetstay">
                <div className="relative p-8">
                  <div className="absolute right-6 top-6 text-5xl opacity-20">🏨</div>
                  <span className="mb-4 inline-block rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
                    Hotel Guide
                  </span>
                  <h3 className="mb-2 text-2xl font-black text-white transition-colors group-hover:text-amber-400">
                    スイートステイ
                  </h3>
                  <p className="mb-6 text-sm text-slate-400">
                    大人のための隠れ家ホテルガイド。全国のラブホテルからピッタリな一軒を見つけよう。
                  </p>
                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-white/5 p-4">
                    <div className="text-center">
                      <p className="text-2xl font-black text-amber-400">3,700+</p>
                      <p className="mt-1 text-[10px] text-slate-500">全国のホテル</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-amber-400">AI</p>
                      <p className="mt-1 text-[10px] text-slate-500">紹介文自動生成</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-sm font-black text-amber-400 transition-all group-hover:gap-4">
                    ホテルを探す <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 4. 初心者ガイド・ナレッジセクション (SEO/AIO強化) ─── */}
      <section className="bg-slate-950 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-3 block text-xs font-black uppercase tracking-[0.3em] text-amber-500">
                Knowledge Hub
              </span>
              <h2 className="font-serif text-4xl font-black">
                知識と安心を、
                <br />
                <span className="text-amber-400">あなたの手に。</span>
              </h2>
            </div>
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-black text-slate-300 transition-all hover:border-amber-500/40 hover:text-amber-400"
            >
              全ガイド記事 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {GUIDE_ARTICLES.map((article, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={article.href}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-slate-900 p-6 transition-all hover:border-amber-500/30 hover:bg-slate-800"
                >
                  <div className="mb-4 text-4xl">{article.icon}</div>
                  <span className="mb-3 inline-block rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase text-amber-400">
                    {article.tag}
                  </span>
                  <h3 className="mb-2 flex-1 text-lg font-bold text-white transition-colors group-hover:text-amber-400">
                    {article.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">{article.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-black text-amber-500">
                    読む <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. FAQ (ATO/AIO 構造化) ─── */}
      <section className="bg-slate-900 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <span className="mb-3 block text-xs font-black uppercase tracking-[0.3em] text-amber-500">
              FAQ
            </span>
            <h2 className="font-serif text-4xl font-black">よくあるご質問</h2>
            <p className="mt-3 text-slate-400">
              初めての方から常連の方まで、よくいただくご質問にお答えします。
            </p>
          </div>
          <div className="space-y-3">
            {FAQ_DATA.map((faq) => (
              <div
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800 transition-all hover:border-amber-500/20"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left"
                >
                  <span className="font-bold text-white">Q. {faq.question}</span>
                  {openFaq === faq.id ? (
                    <ChevronUp className="h-5 w-5 flex-shrink-0 text-amber-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 flex-shrink-0 text-slate-500" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="border-t border-white/5 px-6 pb-6 pt-4">
                        <p className="leading-relaxed text-slate-300">
                          <span className="font-black text-amber-400">A. </span>
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. AI診断 CTA ─── */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-32">
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[150px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-500/20 bg-amber-500/10">
            <Sparkles className="h-10 w-10 animate-pulse text-amber-500" />
          </div>
          <h2 className="mb-6 font-serif text-5xl font-black leading-tight md:text-7xl">
            AIが導く、
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              黄金の体験。
            </span>
          </h2>
          <p className="mb-10 text-xl text-slate-400">
            90%以上のユーザーが活用する「AIアシスト診断」。
            <br />
            たった3つの質問で、最適なキャストをご提案します。
          </p>
          <button className="rounded-full bg-amber-500 px-12 py-6 text-xl font-black text-black shadow-[0_20px_80px_rgba(245,158,11,0.4)] transition-all hover:scale-105 hover:bg-amber-400 active:scale-95">
            AIパーソナライズ診断を開始
          </button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 bg-black px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            <div className="col-span-2">
              <div className="mb-4 font-serif text-3xl font-black text-amber-500">
                PLATFORM<span className="text-white">.HUB</span>
              </div>
              <p className="max-w-sm text-sm leading-loose text-slate-500">
                女性のウェルネスと「整え」のプラットフォーム。全国の姉妹店と、選び抜かれたキャストがお迎えします。
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-400">
                サービス
              </h4>
              <ul className="space-y-3 text-sm text-slate-500">
                {['キャスト一覧', '店舗一覧', 'プラン・料金', '予約方法'].map((item) => (
                  <li key={item}>
                    <a href="#" className="transition-colors hover:text-amber-400">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-400">
                ガイド
              </h4>
              <ul className="space-y-3 text-sm text-slate-500">
                {['はじめての方へ', 'よくある質問', 'プライバシーポリシー', 'お問い合わせ'].map(
                  (item) => (
                    <li key={item}>
                      <a href="#" className="transition-colors hover:text-amber-400">
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-white/5 pt-8 text-center text-xs text-slate-600">
            © 2025 Platform Hub. All Rights Reserved.
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes scroll-text {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-text {
          animation: scroll-text 40s linear infinite;
          width: fit-content;
        }
      `}</style>
    </div>
  );
}
