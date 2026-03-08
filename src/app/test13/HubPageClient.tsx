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
  const [activeCluster, setActiveCluster] = useState('中堅シングル');

  const CLUSTERS = [
    { id: 'pre', label: 'プレ社会人', sub: '音売れフード/ASMR' },
    { id: 'young', label: '若手シングル', sub: '平成女児カルチャー' },
    { id: 'mid', label: '中堅シングル', sub: '平穏ミュート志向' },
    { id: 'vet', label: 'ベテランシングル', sub: 'RE良質消費' },
    { id: 'young-c', label: 'ヤング夫婦', sub: 'お金のペアスタイル' },
    { id: 'mid-c', label: 'ミドル夫婦', sub: '持たない住まい' },
    { id: 'baby', label: '乳幼児期ママ', sub: '育児ハック' },
    { id: 'child', label: '児童ママ', sub: '体験型教育' },
    { id: 'youth', label: '青年期ママ', sub: 'ウェルビーイング' },
    { id: 'second', label: 'セカンドライフ', sub: '新・悠々自適' },
  ];

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
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 selection:bg-rose-500/30">
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

      {/* ─── 1. HERO + 検索セクション (Layout from Image 1 but Bright Theme) ─── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-16">
        {/* クラスターセレクター (Top Nav) */}
        <div className="absolute top-0 z-50 flex w-full items-center gap-4 overflow-x-auto border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-xl md:justify-center">
          <span className="text-[10px] font-black tracking-widest text-rose-500">
            CLUSTER SELECT:
          </span>
          {CLUSTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCluster(c.label)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[10px] font-black transition-all ${
                activeCluster === c.label
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 背景 */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white" />
          <div className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[url('https://images.unsplash.com/photo-1516589174184-c18259ec398e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 blur-sm grayscale-[0.5]" />
          <div className="absolute bottom-0 h-64 w-full bg-gradient-to-t from-white to-transparent" />
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-rose-500/5 via-transparent to-amber-500/5" />
        </div>

        <div className="relative z-10 w-full max-w-7xl px-4 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="text-left"
          >
            <h1 className="mb-12 font-serif text-6xl font-black leading-[1.1] tracking-tighter text-slate-900 md:text-8xl lg:text-[9rem]">
              すべての「整え」を、
              <br />
              <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-rose-600 bg-clip-text text-transparent">
                この一箇所
              </span>
              で。
            </h1>
            <p className="max-w-xl text-lg font-medium leading-relaxed text-slate-500 md:text-2xl">
              女性のウェルネス、ライフスタイル、そして物語。
              情報の「ハブ」として、あなたに最適な体験をナビゲートします。
            </p>
          </motion.div>
        </div>

        {/* 店舗マーキー */}
        {stores.length > 0 && (
          <div className="absolute bottom-0 z-10 w-full overflow-hidden border-t border-slate-100 bg-white/40 backdrop-blur-md">
            <div className="animate-scroll-text flex whitespace-nowrap py-4">
              {[...stores, ...stores].map((store, i) => (
                <Link
                  key={i}
                  href={`/store/${store.slug}`}
                  className="group mx-8 flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-rose-500"
                >
                  <MapPin className="h-3 w-3 text-rose-500/60" />
                  {store.name}
                  <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ─── 1.2 Message from Store (Added Section) ─── */}
      <section className="relative overflow-hidden bg-[#f0f9ff]/30 px-6 py-32">
        {/* 背景の幾何学パターンをCSSで再現 */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(30deg, #444 12%, transparent 12.5%, transparent 87%, #444 87.5%, #444), linear-gradient(150deg, #444 12%, transparent 12.5%, transparent 87%, #444 87.5%, #444), linear-gradient(30deg, #444 12%, transparent 12.5%, transparent 87%, #444 87.5%, #444), linear-gradient(150deg, #444 12%, transparent 12.5%, transparent 87%, #444 87.5%, #444), linear-gradient(60deg, #999 25%, transparent 25.5%, transparent 75%, #999 75%, #999), linear-gradient(60deg, #999 25%, transparent 25.5%, transparent 75%, #999 75%, #999)',
            backgroundSize: '40px 70px',
            backgroundPosition: '0 0, 0 0, 20px 35px, 20px 35px, 0 0, 20px 35px',
          }}
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center gap-12 lg:flex-row">
            {/* 左のシルエット */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 0.15, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="hidden shrink-0 lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400"
                alt="silhouette"
                className="h-96 w-auto object-contain mix-blend-multiply grayscale"
              />
            </motion.div>

            {/* テキストコンテンツ */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-center"
            >
              <div className="space-y-8 font-serif text-slate-600 md:text-lg md:leading-relaxed">
                <div className="space-y-2">
                  <p>ひとに相談できない「悩み」</p>
                  <p>口に出しづらい「疑問」</p>
                  <p>抑えきれない「欲望」と「妄想」</p>
                </div>

                <div className="py-4 font-black">
                  <p className="text-rose-500">“性”をもっと自由にするための</p>
                  <p>自分に正直に向きあうための</p>
                  <p>ひとつの選択肢</p>
                </div>

                <div className="py-2">
                  <p className="text-2xl font-black text-slate-900">女性用風俗</p>
                  <p className="text-xs font-black tracking-[0.3em] text-slate-400">
                    -スイートスポット東京-
                  </p>
                </div>

                <div className="space-y-2 pt-4">
                  <p>少しだけ勇気をだして</p>
                  <p>プロフェッショナルな</p>
                  <p>男性セラピストと</p>
                  <p className="mt-4 text-xl font-bold text-slate-900">
                    まだ見ぬ扉を開けてみませんか
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 右のシルエット */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 0.15, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="hidden shrink-0 lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400"
                alt="silhouette"
                className="h-96 w-auto object-contain mix-blend-multiply grayscale"
              />
            </motion.div>
          </div>
        </div>

        {/* 背景の境界線 */}
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </section>

      {/* ─── 1.5 ライフスタイル別に探す (Layout from Image 2 but Bright Theme) ─── */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="mb-4 text-4xl font-black text-slate-900">ライフスタイル別に探す</h2>
            <p className="text-sm font-medium uppercase tracking-[0.2em] tracking-wide text-slate-500">
              Select your cluster
            </p>
          </motion.div>

          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-8">
            {CLUSTERS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveCluster(c.label)}
                className={`group relative min-w-[280px] cursor-pointer overflow-hidden rounded-[2.5rem] border p-8 transition-all duration-500 ${
                  activeCluster === c.label
                    ? 'border-rose-500 bg-rose-500 shadow-xl shadow-rose-500/20'
                    : 'border-slate-100 bg-slate-50 hover:border-rose-200 hover:bg-white'
                }`}
              >
                <div
                  className={`mb-8 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                    activeCluster === c.label ? 'bg-white/20' : 'bg-rose-50 group-hover:bg-rose-100'
                  }`}
                >
                  <Users
                    className={`h-6 w-6 ${activeCluster === c.label ? 'text-white' : 'text-rose-500'}`}
                  />
                </div>
                <div className="relative z-10">
                  <span
                    className={`mb-1 block text-[10px] font-black uppercase tracking-widest ${
                      activeCluster === c.label ? 'text-white/60' : 'text-slate-400'
                    }`}
                  >
                    {c.sub}
                  </span>
                  <h3
                    className={`text-2xl font-black ${
                      activeCluster === c.label ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    {c.label}
                  </h3>
                </div>
                <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-transform group-hover:scale-150" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 検索バーセクション */}
      <section className="bg-slate-50 px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="relative flex items-center">
            <Search className="absolute left-6 h-6 w-6 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キャスト名・キーワード・店舗・お悩み..."
              className="h-20 w-full rounded-3xl border border-slate-200 bg-white pl-16 pr-40 text-lg text-slate-900 placeholder-slate-400 outline-none ring-rose-500/20 transition-all focus:border-rose-400 focus:shadow-xl focus:ring-4"
            />
            <button className="absolute right-3 rounded-2xl bg-rose-500 px-8 py-4 text-sm font-black text-white shadow-lg shadow-rose-500/20 transition-all hover:scale-105 active:scale-95">
              SEARCH
            </button>
          </div>
        </div>
      </section>

      {/* ─── 2. コンテンツ切り替えタブ ─── */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
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
                className={`flex flex-shrink-0 items-center gap-2 rounded-full px-8 py-4 text-sm font-black transition-all ${
                  activeTab === tab.id
                    ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/20'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'cast' && (
              <motion.div
                key="cast"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              >
                {filteredCasts.slice(0, 15).map((cast) => (
                  <motion.div key={cast.id} whileHover={{ y: -8 }} className="group cursor-pointer">
                    <Link href={`/cast/${cast.slug || cast.id}`}>
                      <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm transition-shadow group-hover:shadow-2xl group-hover:shadow-rose-500/5">
                        <img
                          src={cast.image_url || cast.main_image_url || FALLBACK_CAST_IMG}
                          alt={cast.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        {cast.age && (
                          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-slate-800 shadow-sm">
                            {cast.age}歳
                          </div>
                        )}
                      </div>
                      <div className="px-1 text-center">
                        <div className="text-lg font-black text-slate-800 transition-colors group-hover:text-rose-600">
                          {cast.name}
                        </div>
                        {cast.catch_copy && (
                          <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-400">
                            {cast.catch_copy}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'store' && (
              <motion.div
                key="store"
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {stores.map((store) => (
                  <motion.div
                    key={store.id}
                    whileHover={{ y: -4 }}
                    className="group overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-2"
                  >
                    <Link href={`/store/${store.slug}`}>
                      <div className="mb-4 aspect-video overflow-hidden rounded-2xl">
                        <img
                          src={
                            store.image_url ||
                            'https://images.unsplash.com/photo-1544161515-4ae6b91827d1?auto=format&fit=crop&q=80&w=600'
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-black text-slate-800 transition-colors group-hover:text-rose-500">
                          {store.name}
                        </h3>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="h-3 w-3" />
                          {store.address || '全国各店'}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'video' && (
              <motion.div
                key="video"
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
              >
                {videos.map((video: any) => (
                  <motion.div
                    key={video.id}
                    whileHover={{ y: -8 }}
                    className="group cursor-pointer rounded-3xl bg-slate-50 p-2"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-2xl">
                      <img
                        src={video.thumbnail_url}
                        className="h-full w-full object-cover"
                        alt={video.title}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="h-10 w-10 fill-white text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-black text-slate-800">{video.title}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── 3. 写メ日記フィード ─── */}
      {diaries.length > 0 && (
        <section className="bg-slate-50 px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12">
              <span className="mb-3 block text-xs font-black uppercase tracking-[0.3em] text-rose-500">
                Daily Feed
              </span>
              <h2 className="font-serif text-4xl font-black text-slate-900">
                最新の
                <span className="text-rose-500">更新情報</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {diaries.slice(0, 6).map((d: any) => (
                <motion.div
                  key={d.id}
                  whileHover={{ y: -8 }}
                  className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-2"
                >
                  <div className="mb-6 aspect-video overflow-hidden rounded-3xl">
                    <img src={d.images?.[0]?.image_url} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800">{d.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">{d.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 3.5 オウンドメディア連携 ─── */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 border-l-4 border-rose-500 pl-6">
            <span className="text-xs font-black uppercase tracking-widest text-rose-500">
              Media Ecosystem
            </span>
            <h2 className="mt-2 text-4xl font-black text-slate-900">運営メディアを探る</h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                title: 'イケジョラボ',
                sub: "Women's Wellness",
                color: 'rose',
                href: '/ikejo',
                icon: '💗',
                desc: '自立した女性のライフスタイルメディア。',
              },
              {
                title: 'イケオラボ',
                sub: "Men's Wellness",
                color: 'blue',
                href: '/ikeo',
                icon: '⚡',
                desc: 'メンズウェルネス。選ばれる男へのナビゲート。',
              },
              {
                title: 'スイートステイ',
                sub: 'Hotel Guide',
                color: 'amber',
                href: '/sweetstay',
                icon: '🏨',
                desc: '大人の隠れ家ホテルガイド。AIが導く一軒。',
              },
            ].map((media) => (
              <motion.div
                key={media.title}
                whileHover={{ y: -8 }}
                className={`group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-50 p-10`}
              >
                <div className="absolute right-8 top-8 mb-6 text-4xl opacity-20">{media.icon}</div>
                <span className={`text-[10px] font-black uppercase text-slate-400`}>
                  {media.sub}
                </span>
                <h3 className="mt-2 text-2xl font-black text-slate-800">{media.title}</h3>
                <p className="mb-8 mt-4 text-sm leading-relaxed text-slate-500">{media.desc}</p>
                <Link
                  href={media.href}
                  className="flex items-center gap-2 text-sm font-black text-rose-500 transition-all hover:gap-4"
                >
                  READ MORE <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-rose-500/5 blur-3xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Knowledge Hub ─── */}
      <section className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="text-4xl font-black text-slate-900">
              安心の<span className="text-rose-500">ご利用ガイド</span>
            </h2>
            <Link
              href="/guide"
              className="flex items-center gap-1 text-sm font-black text-rose-500"
            >
              VIEW ALL <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {GUIDE_ARTICLES.map((article) => (
              <motion.div
                key={article.title}
                whileHover={{ y: -8 }}
                className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm"
              >
                <div className="mb-6 text-4xl">{article.icon}</div>
                <h3 className="mb-2 text-lg font-black text-slate-800">{article.title}</h3>
                <p className="text-sm text-slate-400">{article.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. FAQ ─── */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-4xl font-black text-slate-900">よくある質問</h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq) => (
              <div
                key={faq.id}
                className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="flex w-full items-center justify-between p-8 text-left font-black text-slate-800"
                >
                  {faq.question}
                  {openFaq === faq.id ? (
                    <ChevronUp className="text-rose-500" />
                  ) : (
                    <ChevronDown className="text-slate-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-100/50 bg-white/50 p-8 pt-0 leading-relaxed text-slate-500">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. AI CTA ─── */}
      <section className="relative overflow-hidden bg-rose-50 py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl">
            <Sparkles className="h-10 w-10 animate-pulse text-rose-500" />
          </div>
          <h2 className="mb-8 text-5xl font-black leading-tight text-slate-900 md:text-7xl">
            AIが導く、
            <br />
            <span className="text-rose-500">黄金の体験。</span>
          </h2>
          <p className="mb-12 text-lg font-black uppercase tracking-widest text-slate-400">
            AI PERSONALIZED MATCHING
          </p>
          <button className="rounded-full bg-rose-500 px-12 py-6 text-xl font-black text-white shadow-2xl shadow-rose-500/40 transition-all hover:scale-105">
            診断を開始する
          </button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-100 bg-white px-6 py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-4">
          <div className="col-span-2">
            <div className="mb-6 font-serif text-3xl font-black text-rose-500">
              PLATFORM<span className="text-slate-900">.HUB</span>
            </div>
            <p className="max-w-sm leading-loose text-slate-400">
              女性のウェルネスと「整え」のプラットフォーム。全国の支店とAI技術が理想をサポートします。
            </p>
          </div>
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-slate-300">
              SERVICES
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li>キャストを探す</li>
              <li>店舗一覧</li>
              <li>ご利用ガイド</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-slate-300">
              SUPPORT
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li>よくあるご質問</li>
              <li>プライバシーポリシー</li>
              <li>お問い合わせ</li>
            </ul>
          </div>
        </div>
        <div className="mt-20 border-t border-slate-50 pt-10 text-center text-[10px] font-black tracking-widest text-slate-400">
          © 2025 PLATFORM HUB. ALL RIGHTS RESERVED.
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
          animation: scroll-text 60s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
