'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Camera,
  Filter,
  Hotel,
  Layout,
  MapPin,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

/* --- 1. クラスター & メディアメタデータ --- */

const CLUSTERS = [
  { id: '1', name: 'プレ社会人', tag: '音売れフード/ASMR' },
  { id: '2', name: '若手シングル', tag: '平成女児カルチャー' },
  { id: '3', name: '中堅シングル', tag: '平穏ミュート志向' },
  { id: '4', name: 'ベテランシングル', tag: 'Re良質消費' },
  { id: '5', name: 'ヤング夫婦', tag: 'お金のペアスタイル' },
  { id: '6', name: 'ミドル夫婦', tag: '持たない住まい' },
  { id: '7', name: '乳幼児期ママ', tag: '家事速攻完了' },
  { id: '8', name: '児童ママ', tag: '異作業の一本化' },
  { id: '9', name: '青年期ママ', tag: '楽外出ファッション' },
  { id: '10', name: 'セカンドライフ', tag: 'デジタルスキル65' },
];

const OWNED_MEDIA = [
  {
    name: 'スイートホテル',
    desc: '大人のための隠れ家ホテルガイド。',
    color: 'from-pink-500 to-rose-600',
    icon: <Hotel className="h-5 w-5" />,
    latest: {
      title: '2025年。都内で選ぶべき「自分を整える」ラグジュアリーホテル3選',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
      category: 'Hotel Guide',
    },
  },
  {
    name: 'イケ女ラボ',
    desc: '自立した女性のライフスタイルメディア。',
    color: 'from-purple-500 to-indigo-600',
    icon: <Users className="h-5 w-5" />,
    latest: {
      title: 'マインドフルネスと美容。内側から輝くための朝の習慣',
      image:
        'https://images.unsplash.com/photo-1544161515-4ae6b91827d1?auto=format&fit=crop&q=80&w=800',
      category: 'Lifestyle',
    },
  },
  {
    name: 'イケ男ラボ',
    desc: 'メンズウェルネス & スタイル。',
    color: 'from-blue-500 to-cyan-600',
    icon: <Zap className="h-5 w-5" />,
    latest: {
      title: 'デキシを整える。現代の紳士に贈る「自分投資」の極意',
      image:
        'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=800',
      category: "Men's Wellness",
    },
  },
];

/* --- 2. クラスター別UIスタイルの決定 --- */

const getClusterStyle = (id: string) => {
  switch (id) {
    case '10': // シニア
      return {
        heading: 'text-7xl md:text-9xl leading-[1.1]',
        body: 'text-2xl md:text-3xl font-bold',
        accent: 'text-blue-500',
        bg: 'bg-white',
        text: 'text-slate-900',
        nav: 'text-lg font-black uppercase text-slate-800',
        card: 'p-8 border-4 border-slate-200 rounded-3xl',
      };
    case '1': // Gen Z
      return {
        heading: 'text-5xl md:text-8xl font-black italic tracking-tighter',
        body: 'text-lg md:text-xl font-medium',
        accent: 'text-pink-500',
        bg: 'bg-black',
        text: 'text-white',
        nav: 'text-xs font-black tracking-widest text-slate-400',
        card: 'p-4 rounded-[2.5rem] bg-white/5 border-white/10',
      };
    default:
      return {
        heading: 'text-5xl md:text-8xl font-serif font-black tracking-tight',
        body: 'text-lg md:text-xl font-light leading-relaxed',
        accent: 'text-amber-500',
        bg: 'bg-slate-950',
        text: 'text-white',
        nav: 'text-sm font-bold tracking-[0.2em] text-slate-400',
        card: 'p-6 rounded-3xl bg-white/5 border border-white/10',
      };
  }
};

/* --- 3. メイン・コンポーネント --- */

export default function NextGenHub() {
  const [activeCluster, setActiveCluster] = useState('3');
  const [activeTab, setActiveTab] = useState<'all' | 'diary' | 'reviews' | 'tweets'>('all');
  const style = getClusterStyle(activeCluster);

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${style.bg} ${style.text} overflow-x-hidden selection:bg-amber-500/30`}
    >
      {/* --- UIステータスバー (クラスター選択) --- */}
      <div className="no-scrollbar fixed top-0 z-[110] w-full overflow-x-auto border-b border-white/10 bg-black/90 px-6 py-2">
        <div className="flex items-center gap-4">
          <span className="whitespace-nowrap text-[10px] font-black uppercase text-amber-500">
            Cluster Select:
          </span>
          {CLUSTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCluster(c.id)}
              className={`flex-shrink-0 rounded-full px-3 py-1 text-[10px] font-bold transition-all ${activeCluster === c.id ? 'bg-amber-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* --- 4.1 シネマティック・ヒーロー & 支店アクセス --- */}
      <section className="relative flex h-[100vh] w-full flex-col items-center justify-end overflow-hidden pb-20 pt-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <img
            src="https://images.unsplash.com/photo-1544161515-4ae6b91827d1?auto=format&fit=crop&q=80&w=2000"
            className="animate-slow-zoom h-full w-full object-cover opacity-60"
          />
        </div>

        <div className="container relative z-20 mb-16 px-10">
          <motion.div
            key={activeCluster}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className={`${style.heading} mb-8 font-black drop-shadow-2xl`}>
              すべての「整え」を、
              <br />
              <span className={style.accent}>この一箇所</span>で。
            </h1>
            <p className={`${style.body} mb-12 max-w-2xl text-slate-300`}>
              全国の支店、オウンドメディア、そして日々更新される数千の物語。
              <br />
              情報の「中継地点」として、あなたに最適なウェルネス体験をナビゲートします。
            </p>
          </motion.div>
        </div>

        {/* 支店アクセスの横スクロールバナー */}
        <div className="relative z-30 w-full overflow-hidden border-y border-white/10 bg-white/5 backdrop-blur-3xl">
          <div className="animate-scroll-text flex whitespace-nowrap py-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 px-6">
                {[
                  '東京本店',
                  '横浜支店',
                  '名古屋栄店',
                  '大阪梅田店',
                  '福岡天神店',
                  '札幌中央店',
                  '仙台広瀬店',
                ].map((store) => (
                  <button
                    key={store}
                    className="group flex items-center gap-3 text-sm font-black text-white transition-colors hover:text-amber-500"
                  >
                    <MapPin className="h-4 w-4 text-amber-500" /> {store}
                    <ArrowRight className="h-3 w-3 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="relative z-10">
        {/* --- 運営オウンドメディア・セクション --- */}
        <section className="bg-slate-950 px-10 py-32">
          <div className="container mx-auto">
            <div className="mb-16 flex items-center justify-between border-l-4 border-amber-500 pl-8">
              <div>
                <h2 className="font-serif text-4xl font-black">Group Media Ecosystem</h2>
                <p className="mt-2 text-sm uppercase tracking-widest text-slate-500">
                  運営メディア：最新のトレンド & ライフスタイル
                </p>
              </div>
              <button className="rounded-full border border-white/10 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all hover:bg-white/5">
                All Media Portal
              </button>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {OWNED_MEDIA.map((media) => (
                <motion.div
                  key={media.name}
                  whileHover={{ y: -10 }}
                  className="group relative cursor-pointer overflow-hidden rounded-[3rem] border border-white/10 bg-slate-900"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={media.latest.image}
                      className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80`}
                    />
                    <div className="absolute left-6 top-6">
                      <div
                        className={`flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase text-white backdrop-blur-md`}
                      >
                        {media.icon} {media.name}
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <span className="mb-3 block text-[10px] font-black uppercase tracking-widest text-amber-500">
                      Latest Article — {media.latest.category}
                    </span>
                    <h3 className="mb-6 text-xl font-bold leading-tight transition-colors group-hover:text-amber-500">
                      {media.latest.title}
                    </h3>
                    <p className="mb-8 line-clamp-2 text-sm leading-relaxed text-slate-400">
                      {media.desc}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white transition-all group-hover:gap-4">
                      Read Blog <ArrowRight className="h-4 w-4 text-amber-500" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- セラピスト・ボリューム表示 (Infinite Scroll) --- */}
        <section className="overflow-hidden border-y border-white/5 bg-slate-900 py-24">
          <div className="container mx-auto mb-16 px-10 text-center">
            <span className="mb-4 block text-xs font-black uppercase tracking-[0.3em] text-amber-500">
              Meet Our Professionals
            </span>
            <h2 className="mb-6 text-4xl font-black">圧倒的な在籍数と、多様な個性。</h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              全国の支店から、日々新しいセラピストが「自分らしいウェルネス」を発信しています。
            </p>
          </div>

          {/* キャストカードの無限スクロール */}
          <div className="animate-infinite-x flex gap-8 px-10 py-10 hover:[animation-play-state:paused]">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="group w-64 flex-shrink-0">
                <div className="relative mb-6 aspect-[3/4] overflow-hidden rounded-[2rem] border border-white/10 ring-amber-500/30 transition-all group-hover:ring-4">
                  <img
                    src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=600`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-6 left-6">
                    <div className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-500">
                      New Cast
                    </div>
                    <div className="text-xl font-black text-white">Therapist Name.</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-slate-500">
                    癒やし系
                  </span>
                  <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-slate-500">
                    話上手
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- UGC & リアルタイムフィード (写メ日記 / 口コミ / つぶやき) --- */}
        <section className="relative z-20 rounded-[4rem] bg-white py-32 text-slate-950">
          <div className="container mx-auto px-10">
            <div className="mb-20 max-w-4xl">
              <h2 className="font-serif text-5xl font-black leading-tight">
                今の雰囲気を、リアルに感じる。
                <br />
                <span className="text-amber-600">Daily Updates.</span>
              </h2>
            </div>

            {/* タブ切り替え */}
            <div className="no-scrollbar mb-16 flex gap-10 overflow-x-auto border-b border-slate-200 pb-4">
              {[
                { id: 'all', label: 'All Feed', icon: <Layout className="h-4 w-4" /> },
                { id: 'diary', label: '写メ日記', icon: <Camera className="h-4 w-4" /> },
                { id: 'reviews', label: '口コミ', icon: <MessageSquare className="h-4 w-4" /> },
                { id: 'tweets', label: 'つぶやき', icon: <TrendingUp className="h-4 w-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 rounded-t-2xl px-6 py-4 text-sm font-black transition-all ${activeTab === tab.id ? 'translate-y-4 bg-slate-950 text-white' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="rounded-[3rem] border border-slate-200 bg-slate-50 p-10 transition-all duration-500 hover:bg-white hover:shadow-2xl"
                >
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-2xl bg-slate-200">
                      <img
                        src={`https://images.unsplash.com/photo-${1600000000000 + i}?auto=format&fit=crop&q=80&w=100`}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-black">Member Name</div>
                      <div className="text-[10px] text-slate-400">2025.03.07 15:45</div>
                    </div>
                  </div>

                  {/* 写メ日記シミュレーター */}
                  <div className="mb-6 aspect-video overflow-hidden rounded-3xl border border-slate-200">
                    <img
                      src={`https://images.unsplash.com/photo-${1510000000000 + i}?auto=format&fit=crop&q=80&w=400`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p className="mb-10 line-clamp-3 text-lg leading-relaxed text-slate-600">
                    今日は「整え」をテーマにお客様をお迎えしました。新しいアロマを入荷したので、ぜひ体験しに来てください...
                  </p>

                  <button className="flex items-center gap-2 text-sm font-black uppercase text-amber-600 underline decoration-amber-500 decoration-2 underline-offset-8 transition-all hover:gap-6">
                    Read More Diary <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 多軸検索パネル (要件定義書 4.2) --- */}
        <section className="bg-slate-950 px-10 py-40">
          <div className="container mx-auto">
            <div className="relative overflow-hidden rounded-[4rem] border border-white/10 bg-slate-900/60 p-16 shadow-2xl backdrop-blur-3xl">
              <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[150px]" />
              <div className="relative z-10 flex flex-col items-center gap-12 lg:flex-row">
                <div className="lg:w-1/2">
                  <h2 className="mb-8 font-serif text-5xl font-black">
                    理想の体験を、
                    <br />
                    <span className="text-amber-500">多軸</span>で絞り込む。
                  </h2>
                  <p className="text-lg leading-relaxed text-slate-400">
                    エリア、予算、雰囲気、そして今の空き状況。
                    <br />
                    「食べログ型」の精緻な検索で、ミスマッチのない案内を約束します。
                  </p>
                </div>
                <div className="w-full space-y-8 lg:w-1/2">
                  <div className="relative">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="お悩み・目的から探す"
                      className="h-24 w-full rounded-3xl border border-white/10 bg-black/40 pl-24 pr-8 text-xl text-white outline-none ring-amber-500/20 transition-all focus:ring-4"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <button className="flex h-20 items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 text-xs font-black uppercase transition-all hover:bg-white/10">
                      <Filter className="h-4 w-4" /> Area Select
                    </button>
                    <button className="flex h-20 items-center justify-center gap-4 rounded-2xl bg-amber-500 text-xs font-black uppercase text-black transition-all hover:scale-105">
                      Search Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- AI診断導線 (成約トリガー) --- */}
        <section className="relative overflow-hidden bg-slate-950 py-48">
          <div className="container relative z-10 mx-auto max-w-4xl px-10 text-center">
            <div className="mb-12 inline-flex h-24 w-24 items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl">
              <Sparkles className="h-10 w-10 animate-pulse text-amber-500" />
            </div>
            <h2 className="mb-12 font-serif text-5xl font-black leading-tight md:text-8xl">
              AIが導く、
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                黄金の体験。
              </span>
            </h2>
            <p className="mb-20 text-2xl text-slate-400">
              90%以上のユーザーが利用する「AIアシスト診断」。
              <br />
              情報の非対称性を解消し、納得感のある選択へ。
            </p>
            <button className="rounded-full bg-amber-500 px-16 py-8 text-2xl font-black text-black shadow-[0_20px_80px_rgba(245,158,11,0.5)] transition-all hover:scale-110 active:scale-95">
              AIパーソナライズ診断を開始
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black px-10 py-40">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-20 md:grid-cols-5">
            <div className="col-span-2">
              <div className={`mb-10 font-serif text-4xl font-black ${style.accent}`}>
                PLATFORM<span className="text-white">.HUB</span>
              </div>
              <p className="text-md max-w-md leading-loose text-slate-500">
                2025年、女性のライフスタイルは進化します。
              </p>
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
          animation: slow-zoom 40s ease-in-out infinite alternate;
        }

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
          width: fit-content;
        }

        @keyframes infinite-x {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-infinite-x {
          display: inline-flex;
          animation: infinite-x 40s linear infinite;
          width: max-content;
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
