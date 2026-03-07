'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  Eye,
  Filter,
  Play,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Volume2,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

/* --- 1. 高度なクラスター定義 (Cluster Metadata) --- */

const CLUSTERS = [
  {
    id: '1',
    name: 'プレ社会人',
    tag: '音売れフード/ASMR',
    accent: '#FF2D55',
    font: 'font-sans',
    focus: 'Vertical Video',
    logic: 'Vibrant',
  },
  {
    id: '2',
    name: '若手シングル',
    tag: '平成女児カルチャー',
    accent: '#FF69B4',
    font: 'font-serif',
    focus: 'Immersive',
    logic: 'Retro-Modern',
  },
  {
    id: '3',
    name: '中堅シングル',
    tag: '平穏ミュート志向',
    accent: '#94A3B8',
    font: 'font-sans',
    focus: 'Expertise',
    logic: 'Minimal',
  },
  {
    id: '4',
    name: 'ベテランシングル',
    tag: 'Re良質消費',
    accent: '#D4AF37',
    font: 'font-serif',
    focus: 'Evidence',
    logic: 'Premium',
  },
  {
    id: '5',
    name: 'ヤング夫婦',
    tag: 'お金のペアスタイル',
    accent: '#4F46E5',
    font: 'font-sans',
    focus: 'Sharing',
    logic: 'Practical',
  },
  {
    id: '6',
    name: 'ミドル夫婦',
    tag: '持たない住まい',
    accent: '#475569',
    font: 'font-serif',
    focus: 'Authentic',
    logic: 'Elegance',
  },
  {
    id: '7',
    name: '乳幼児期ママ',
    tag: '家事速攻完了',
    accent: '#10B981',
    font: 'font-sans',
    focus: 'Speed/Q&A',
    logic: 'Instant',
  },
  {
    id: '8',
    name: '児童ママ',
    tag: '異作業の一本化',
    accent: '#F59E0B',
    font: 'font-sans',
    focus: 'Pillar Pages',
    logic: 'Multi-functional',
  },
  {
    id: '9',
    name: '青年期ママ',
    tag: '楽外出ファッション',
    accent: '#EC4899',
    font: 'font-sans',
    focus: 'Mobile/Location',
    logic: 'Social',
  },
  {
    id: '10',
    name: 'セカンドライフ',
    tag: 'デジタルスキル65',
    accent: '#3B82F6',
    font: 'font-sans',
    focus: 'Accessibility',
    logic: 'Simple',
  },
];

/* --- 2. クラスター別UIスタイルの決定 --- */

const getClusterStyle = (id: string) => {
  const c = CLUSTERS.find((x) => x.id === id) || CLUSTERS[2];

  switch (id) {
    case '10': // シニア: 高視認性・シンプル
      return {
        heading: 'text-7xl md:text-9xl tracking-tight leading-[1.1]',
        body: 'text-2xl md:text-3xl font-bold leading-relaxed',
        accent: 'text-blue-500',
        bg: 'bg-white',
        text: 'text-slate-900',
        nav: 'text-lg font-black',
        card: 'p-10 border-4',
        btn: 'px-12 py-8 text-2xl',
      };
    case '1': // Gen Z: ビビッド・短尺特化
      return {
        heading: 'text-5xl md:text-8xl font-black italic',
        body: 'text-lg md:text-xl font-medium',
        accent: 'text-pink-500',
        bg: 'bg-black',
        text: 'text-white',
        nav: 'text-xs italic',
        card: 'p-4 rounded-3xl',
        btn: 'px-8 py-4 text-base',
      };
    default:
      return {
        heading: 'text-5xl md:text-7xl lg:text-8xl font-serif font-black',
        body: 'text-lg md:text-xl font-normal leading-loose',
        accent: 'text-amber-500',
        bg: 'bg-slate-950',
        text: 'text-white',
        nav: 'text-sm tracking-[0.2em]',
        card: 'p-6 rounded-2xl border-white/10',
        btn: 'px-8 py-4 text-sm',
      };
  }
};

/* --- 3. コンテンツデータ (AIO/SEO最適化) --- */

const CONTENT_DATA = {
  pillar: {
    title: '性的ウェルネス完全ガイド 2025',
    description: '自己肯定感を最大化させる、現代女性のためのセルフケア投資。',
  },
  clusters: [
    {
      title: '週末のデジタルデトックス',
      prep: 'P',
      c: '情報の「消費」から自分を「整える」体験へ。',
      tag: 'Mental',
    },
    {
      title: '専門店が教える利用マナー',
      prep: 'R',
      c: '相互の信頼関係が、サービスの質を30%向上させます。',
      tag: 'Guide',
    },
    {
      title: '投資としてのウェルネス',
      prep: 'E',
      c: '精神的充足はLTV（QOL）を高める最良の資産です。',
      tag: 'Finance',
    },
  ],
};

/* --- 4. メイン・コンポーネント --- */

export default function ContentHubV2() {
  const [activeCluster, setActiveCluster] = useState('3');
  const [artworkMode, setArtworkMode] = useState<'A' | 'B'>('A'); // サムネイル出し分けシミュレーター
  const style = getClusterStyle(activeCluster);

  // クラスターに応じたおすすめアイテムの出し分け
  const getPersonalizedItems = () => {
    const base = [
      {
        category: 'Hot',
        title: '【密着】2025年最新。自分を慈しむ週末',
        image:
          artworkMode === 'A'
            ? 'https://images.unsplash.com/photo-1544161515-4ae6b91827d1'
            : 'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069',
      },
      {
        category: 'ASMR',
        title: '耳から整う、究極の音響体験',
        image:
          artworkMode === 'A'
            ? 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9'
            : 'https://images.unsplash.com/photo-1459749411177-042180ce673a',
      },
    ];
    return base;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${style.bg} ${style.text} overflow-x-hidden selection:bg-amber-500/30`}
    >
      {/* 6.4 構造化データ (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'PLATFORM.HUB',
            description: '2025年最新。検索・エンタメ・教育が融合する女性向けハブ',
            author: { '@type': 'Organization', name: 'Next-Gen Dev Team' },
          }),
        }}
      />

      {/* --- Header --- */}
      <nav className="fixed top-0 z-[100] flex w-full items-center justify-between border-b border-white/5 bg-slate-950/80 px-6 py-4 backdrop-blur-2xl">
        <div className={`font-serif text-2xl font-black tracking-tighter ${style.accent}`}>
          PLATFORM<span className="text-white">.HUB</span>
        </div>

        <div className={`hidden items-center gap-10 lg:flex ${style.nav}`}>
          {['Experience', 'Education', 'Clusters', 'AIO Search'].map((item) => (
            <a key={item} href="#" className="uppercase transition-all hover:text-amber-500">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setArtworkMode(artworkMode === 'A' ? 'B' : 'A')}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] hover:bg-white/10"
          >
            <Settings className="h-3 w-3" /> UI Mode: {artworkMode}
          </button>
          <button
            className={`rounded bg-white px-6 py-2 font-black uppercase text-black ${style.nav}`}
          >
            Login
          </button>
        </div>
      </nav>

      <main className="pt-20">
        {/* --- 4.1 シネマティック・ファーストビュー (Hero) --- */}
        <section className="relative flex h-[95vh] w-full items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/40 to-transparent" />
            <img
              src="https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=2000"
              className="animate-slow-zoom h-full w-full scale-100 object-cover opacity-60"
            />
          </div>

          <div className="container relative z-20 px-10">
            <motion.div
              key={activeCluster}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="max-w-5xl"
            >
              <span
                className={`mb-10 inline-flex items-center gap-2 rounded-full border bg-white/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.3em] ${style.accent}`}
              >
                <Zap className="h-4 w-4" /> 2025 Digital Labor Agency
              </span>
              <h1 className={`${style.heading} mb-8 drop-shadow-2xl`}>
                自分を整える、
                <br />
                <span className={style.accent}>本質的な価値</span>への投資。
              </h1>
              <p className={`balance max-w-2xl ${style.body} mb-12 text-slate-300`}>
                情報の過多から解放され、心身を充足させる五感体験へ。
                <br />
                AIによる「手間代行」が、あなただけに最適化されたウェルネスを提示します。
              </p>

              <div className="flex flex-wrap gap-6">
                <button
                  className={`flex items-center gap-3 rounded-full bg-white font-black text-black shadow-2xl transition-all hover:scale-105 ${style.btn}`}
                >
                  <Play className="h-5 w-5 fill-current" />
                  90秒で体験する動画
                </button>
                <button
                  className={`rounded-full border border-white/20 bg-transparent font-black text-white transition-all hover:bg-white/5 ${style.btn}`}
                >
                  AI診断を始める
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- 2.2 10クラスター・セレクター --- */}
        <section className="border-y border-white/5 bg-slate-900/50 py-24">
          <div className="container mb-12 px-10">
            <h2 className="mb-4 font-serif text-3xl font-black">Clusters : あなたの属性を選択</h2>
            <p className="text-slate-500">
              10のクラスター別にUIとレコメンドをリアルタイム調整します。
            </p>
          </div>

          <div className="no-scrollbar flex gap-6 overflow-x-auto px-10 pb-8">
            {CLUSTERS.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCluster(c.id)}
                className={`group relative w-[240px] flex-shrink-0 text-left transition-all ${style.card} ${activeCluster === c.id ? 'border-amber-400 bg-amber-500 ring-4 ring-amber-500/20' : 'border-white/10 bg-white/5 hover:border-amber-500/50'}`}
              >
                <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors group-hover:text-amber-500">
                  {c.tag}
                </div>
                <div className="text-xl font-black text-white">{c.name}</div>
                <div className="mt-4 flex items-center text-[10px] font-bold opacity-40">
                  Detail <ArrowRight className="ml-2 h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* --- 4.2 Netflix型コンテンツ行 (Artwork Personalizationモデル) --- */}
        <section className="px-10 py-20">
          <div className="mb-12 flex items-center justify-between border-l-4 border-amber-500 pl-6">
            <div>
              <h3 className="font-serif text-3xl font-black">あなたに最適化された受動的発見</h3>
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">
                Artwork Personalization :{' '}
                {artworkMode === 'A' ? 'Romance Selection' : 'Comedy/Viral Selection'}
              </p>
            </div>
            <button className="text-xs font-black uppercase tracking-widest hover:text-amber-500">
              See All Videos
            </button>
          </div>

          <div className="no-scrollbar flex gap-8 overflow-x-auto pb-10">
            {getPersonalizedItems().map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -12 }}
                className="group relative w-[380px] flex-shrink-0 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900"
              >
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={item.image}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all group-hover:opacity-100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-md">
                      <Play className="h-6 w-6 fill-current text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <span className="mb-4 inline-block rounded bg-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">
                    {item.category}
                  </span>
                  <h4 className="text-xl font-bold leading-snug transition-colors group-hover:text-amber-500">
                    {item.title}
                  </h4>
                  <div className="mt-6 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      <Clock className="h-3 w-3" /> 01:30
                    </span>
                    <span className="flex items-center gap-2">
                      <Volume2 className="h-3 w-3" /> ASMR ON
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- 4.2 多軸検索 (Tablog型) --- */}
        <section className="container mx-auto px-10 py-32">
          <div className="rounded-[3rem] border border-white/10 bg-slate-900/80 p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
            <div className="mb-16 flex flex-col gap-8 lg:flex-row">
              <div className="group relative flex-grow">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-amber-500" />
                <input
                  type="text"
                  placeholder="エリア・お悩み・目的から探す"
                  className="h-24 w-full rounded-3xl border border-white/10 bg-black/40 pl-20 pr-8 text-xl text-white outline-none transition-all focus:ring-4 focus:ring-amber-500/20"
                />
              </div>
              <button className="flex h-24 items-center justify-center gap-4 rounded-3xl bg-amber-500 px-16 text-xl font-black text-black transition-all hover:scale-[1.02]">
                <Filter className="h-6 w-6" /> 多軸検索
              </button>
            </div>

            <div className="grid grid-cols-2 gap-12 border-t border-white/5 pt-12 md:grid-cols-4">
              {[
                { l: 'Area', v: '東京都内', icon: <User className="h-3 w-3" /> },
                { l: 'Budget', v: '30,000 yen~', icon: <Star className="h-3 w-3" /> },
                { l: 'Atmosphere', v: 'ラグジュアリー', icon: <Eye className="h-3 w-3" /> },
                { l: 'Condition', v: '今日・明日予約可', icon: <Zap className="h-3 w-3" /> },
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-colors group-hover:text-amber-500">
                    {item.icon} {item.l}
                  </div>
                  <div className="text-xl font-bold text-slate-200 transition-colors group-hover:text-white">
                    {item.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 3.2 トピッククラスター & 6.3 PREP法 (Education) --- */}
        <section className="relative z-40 rounded-[4rem] bg-white py-32 text-slate-950">
          <div className="container mx-auto px-10">
            <div className="flex flex-col gap-20 lg:flex-row">
              <div className="lg:w-1/3">
                <div className="sticky top-40">
                  <span className="mb-6 block text-xs font-black uppercase tracking-widest text-amber-600">
                    Education / Confident Choice
                  </span>
                  <h2 className="mb-8 font-serif text-5xl font-black leading-[1.1]">
                    {CONTENT_DATA.pillar.title}
                  </h2>
                  <p className="mb-10 text-lg leading-relaxed text-slate-600">
                    {CONTENT_DATA.pillar.description}
                  </p>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <dt className="mb-2 flex items-center gap-2 text-sm font-black text-slate-900">
                      <ShieldCheck className="h-5 w-5 text-amber-500" />{' '}
                      専門家による「信頼のインフラ」
                    </dt>
                    <dd className="text-xs leading-relaxed text-slate-500">
                      全ての情報は医療従事者・ウェルネス専門家が監修。情報の非対称性を解消します。
                    </dd>
                  </div>
                </div>
              </div>

              <div className="space-y-12 lg:w-2/3">
                {CONTENT_DATA.clusters.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group rounded-[3rem] border border-slate-200 bg-slate-50 p-12 transition-all duration-500 hover:bg-white hover:shadow-2xl"
                  >
                    <div className="mb-8 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-xl font-black text-black shadow-lg shadow-amber-500/20">
                        {item.prep}
                      </div>
                      <span className="rounded-full border border-slate-200 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {item.tag}
                      </span>
                    </div>
                    <h4 className="mb-6 text-3xl font-black transition-colors group-hover:text-amber-600">
                      {item.title}
                    </h4>
                    <p className="mb-10 border-l-4 border-amber-500 pl-8 text-lg italic leading-relaxed text-slate-600">
                      「 {item.c} 」
                    </p>
                    <button className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-black underline decoration-amber-500 decoration-2 underline-offset-8 transition-all group-hover:gap-6">
                      Read Cluster Content <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- 7.2 AI診断 CTA (成約のトリガー) --- */}
        <section className="relative overflow-hidden bg-slate-950 py-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_100%)] opacity-50" />
          <div className="container relative z-10 mx-auto max-w-4xl px-10 text-center">
            <div className="mb-12 inline-flex h-24 w-24 animate-pulse items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl">
              <Sparkles className="h-10 w-10 text-amber-500" />
            </div>
            <h2 className="mb-10 font-serif text-4xl font-black leading-[1.1] md:text-7xl">
              AIが、あなただけの
              <br />
              <span className="bg-gradient-to-r from-amber-200 to-amber-600 bg-clip-text text-transparent">
                最適解
              </span>
              を提示します。
            </h2>
            <p className="mb-16 text-xl leading-relaxed text-slate-400">
              90%のユーザーが利用する「AIアシスト診断」。
              <br />
              検索の手間から解放され、心から納得できる選択を。
            </p>
            <button className="rounded-full bg-amber-500 px-16 py-8 text-2xl font-black text-black shadow-[0_20px_60px_rgba(245,158,11,0.4)] transition-all hover:scale-110 active:scale-95">
              AIによるパーソナライズ診断を開始
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/20 bg-black px-10 py-32">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-20 md:grid-cols-5">
            <div className="col-span-2">
              <div className={`mb-10 font-serif text-4xl font-black ${style.accent}`}>
                PLATFORM<span className="text-white">.HUB</span>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-slate-500">
                2025年、女性のライフスタイルは情報の「消費」から「整え」へと進化します。
                <br />
                私たちは信頼のインフラとして、最高品質のエクスペリエンスを届けるハブであり続けます。
              </p>
            </div>
            {['Information', 'Safety', 'Company'].map((t) => (
              <div key={t}>
                <h5 className="mb-8 text-xs font-black uppercase tracking-widest text-white">
                  {t}
                </h5>
                <ul className="space-y-4 text-xs text-slate-500">
                  <li className="cursor-pointer transition-colors hover:text-white">利用規約</li>
                  <li className="cursor-pointer transition-colors hover:text-white">
                    プライバシーポリシー
                  </li>
                  <li className="cursor-pointer transition-colors hover:text-white">
                    監修者プロフィール
                  </li>
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-32 flex flex-col items-center justify-between gap-10 border-t border-white/10 pt-12 text-[10px] uppercase tracking-widest text-slate-600 md:flex-row">
            <div>© 2025 NEXT-GEN CONTENT HUB PLATFORM. ALL RIGHTS RESERVED.</div>
            <div className="flex gap-10">
              <span className="cursor-pointer hover:text-white">Security Center</span>
              <span className="cursor-pointer hover:text-white">Support</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes slow-zoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.1);
          }
        }
        .animate-slow-zoom {
          animation: slow-zoom 30s ease-in-out infinite alternate;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .balance {
          text-wrap: balance;
        }
      `}</style>
    </div>
  );
}
