'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  Clock,
  Filter,
  Heart,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  User,
} from 'lucide-react';
import { useState } from 'react';

/* --- Helpers --- */

// Cluster-specific UI logic (Dynamic UI requirement)
const getClusterStyle = (id: string) => {
  switch (id) {
    case '10': // Senior cluster: Large fonts, simplified visibility
      return {
        heading: 'text-6xl md:text-9xl',
        body: 'text-xl md:text-2xl font-bold',
        accent: 'text-blue-400',
        nav: 'text-lg',
      };
    case '1': // Gen Z cluster: Vibrant accents, visual-first
      return {
        heading: 'text-5xl md:text-8xl',
        body: 'text-lg md:text-xl',
        accent: 'text-pink-500',
        nav: 'text-sm',
      };
    default:
      return {
        heading: 'text-5xl md:text-8xl',
        body: 'text-lg md:text-xl',
        accent: 'text-amber-500',
        nav: 'text-sm',
      };
  }
};

/* --- Components --- */

// 1. Cinematic Hero Section (90-second rule)
const CinematicHero = ({ style, activeCluster }: { style: any; activeCluster: string }) => (
  <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-slate-950">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/20 to-slate-950" />
      <img
        src="https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=2000"
        className="animate-subtle-zoom h-full w-full scale-105 object-cover opacity-60"
        alt="Hero Cinematic"
      />
    </div>

    <div className="container relative z-20 mx-auto flex h-full flex-col justify-center px-6">
      <motion.div
        key={activeCluster}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <span
          className={`mb-6 inline-flex items-center gap-2 rounded-full border bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-md ${activeCluster === '1' ? 'border-pink-500/30 text-pink-400' : 'border-amber-500/30 text-amber-400'}`}
        >
          <Sparkles className="h-3 w-3" />
          Next-Gen Platform
        </span>
        <h1
          className={`mb-6 max-w-4xl font-serif font-black leading-tight text-white drop-shadow-2xl ${style.heading}`}
        >
          自分を整える、
          <br />
          <span className={style.accent}>本質的な美しさ</span>への投資。
        </h1>
        <p
          className={`mb-10 max-w-2xl leading-relaxed text-slate-300 drop-shadow-md ${style.body}`}
        >
          「デジタルの手間」から解放され、心身を充足させる五感体験へ。
          AIが導く、あなただけにパーソナライズされたウェルネス・プラットフォーム。
        </p>

        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-slate-950 shadow-xl transition-transform hover:scale-105">
            <Play className="h-4 w-4 fill-current" />
            コンセプト動画
          </button>
          <button className="rounded-xl border border-white/30 bg-transparent px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10">
            診断を開始
          </button>
        </div>
      </motion.div>
    </div>

    <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 animate-bounce">
      <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/20 p-1">
        <div
          className={`h-2 w-1 rounded-full ${activeCluster === '1' ? 'bg-pink-500' : 'bg-amber-500'}`}
        />
      </div>
    </div>
  </section>
);

// 2. Cluster Selector (10 Specialized Personas)
const ClusterSelector = ({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) => {
  const clusters = [
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

  return (
    <div className="overflow-hidden border-y border-white/5 bg-slate-900 py-20">
      <div className="container mx-auto mb-10 px-6">
        <h2 className="mb-4 font-serif text-3xl font-bold text-white">ライフスタイル別に探す</h2>
        <p className="text-slate-400">10のクラスター別に最適化された、没入型のエクスペリエンス。</p>
      </div>

      <div className="no-scrollbar mask-gradient-sides flex gap-4 overflow-x-auto px-6 pb-6">
        {clusters.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`group w-[240px] flex-shrink-0 rounded-2xl border px-6 py-8 text-left transition-all ${
              activeId === c.id
                ? 'border-amber-400 bg-amber-500 text-white shadow-xl shadow-amber-900/40'
                : 'border-white/10 bg-white/5 text-slate-300 hover:border-amber-500/50 hover:bg-white/10'
            }`}
          >
            <div
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${activeId === c.id ? 'bg-white/20' : 'bg-amber-500/20 text-amber-500'}`}
            >
              <User className="h-5 w-5" />
            </div>
            <div className="mb-1 text-xs font-bold uppercase tracking-widest opacity-60">
              {c.tag}
            </div>
            <div className="text-xl font-bold">{c.name}</div>
            <div className="mt-4 flex items-center text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100">
              表示を切り替える <ChevronRight className="ml-1 h-3 w-3" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// 3. Netflix-style Selection (Content Rows)
const ContentRow = ({ title, items }: { title: string; items: any[] }) => (
  <div className="px-6 py-12">
    <div className="container mx-auto">
      <div className="mb-8 flex items-center justify-between px-4">
        <h3 className="font-serif text-2xl font-bold text-white">{title}</h3>
        <button className="text-sm font-bold text-amber-500 hover:underline">すべて表示</button>
      </div>

      <div className="no-scrollbar flex gap-6 overflow-x-auto px-4 pb-6">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -10 }}
            className="group relative w-[300px] flex-shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-900 md:w-[350px]"
          >
            <div className="relative aspect-[16/9] w-full">
              <img
                src={item.image}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={item.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
              <div className="absolute right-4 top-4">
                <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] text-white backdrop-blur-md">
                  {item.duration || '01:30'}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/20 backdrop-blur-md">
                  <Play className="h-5 w-5 fill-current text-white" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-amber-500">
                  {item.category}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock className="h-3 w-3" />
                  {item.date}
                </div>
              </div>
              <h4 className="line-clamp-2 text-lg font-bold text-white transition-colors group-hover:text-amber-500">
                {item.title}
              </h4>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

// 4. Tablog-style Smart Search (Multi-axis Filter)
const TablogSearch = () => (
  <section className="container mx-auto px-6 py-20">
    <div className="mx-auto max-w-4xl rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-10 shadow-2xl backdrop-blur-2xl">
      <div className="mb-10 flex flex-col items-center gap-8 md:flex-row">
        <div className="group relative w-full flex-grow md:w-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-amber-500" />
          <input
            type="text"
            placeholder="目的・お悩み・エリアから探す"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/50 py-6 pl-16 pr-6 text-lg text-white outline-none transition-all focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-10 py-6 font-black text-slate-950 transition-transform hover:scale-105 md:w-auto">
          <Filter className="h-4 w-4" />
          多軸検索
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
        {[
          { label: 'エリア', val: '東京都内・近郊' },
          { label: '予算', val: '30,000円〜' },
          { label: '雰囲気', val: 'モダン・隠れ家' },
          { label: '空き状況', val: '今日・明日' },
        ].map((f, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-colors group-hover:text-amber-500">
              {f.label}
            </div>
            <div className="font-bold text-slate-200 transition-colors group-hover:text-white">
              {f.val}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 5. Education Pillar Section (PREP Method)
const EducationSection = () => (
  <section className="bg-white py-24 text-slate-950">
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-start gap-16 lg:flex-row">
        <div className="max-w-md lg:sticky lg:top-24">
          <span className="mb-4 block text-xs font-black uppercase tracking-[0.2em] text-amber-600">
            Education & Confidence
          </span>
          <h2 className="mb-8 font-serif text-4xl font-black leading-tight md:text-5xl">
            「正しく知る」ことが、あなたの自信に。
          </h2>
          <p className="mb-8 leading-relaxed text-slate-600">
            情報の非対称性を解消し、納得感のある選択を支援するための専門家監修コンテンツ。PREP法に基づき、結論ファーストであなたの疑問に答えます。
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
              <ShieldCheck className="h-6 w-6 text-amber-600" />
              <div>
                <dt className="text-sm font-bold text-amber-900">100% 専門家監修</dt>
                <dd className="text-xs text-amber-700">エビデンスに基づいた一次情報のみ。</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow space-y-12">
          {[
            {
              title: '性的ウェルネスとメンタルヘルスの密接な関係',
              prep: 'P',
              content: '美しさの根源は「自分を肯定する力」にあります。',
              tag: 'Self Care',
            },
            {
              title: '初めての利用マナー：スマートな大人の選択',
              prep: 'R',
              content: '相互尊重の精神は、体験の質を劇的に向上させます。',
              tag: 'Guide',
            },
          ].map((item, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-8 transition-all duration-500 hover:bg-white hover:shadow-2xl md:p-12"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 font-black text-white">
                  {item.prep}
                </div>
                <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-bold lowercase text-slate-600">
                  {item.tag}
                </span>
              </div>
              <h4 className="mb-4 text-2xl font-bold">{item.title}</h4>
              <p className="mb-6 border-l-4 border-amber-500 pl-4 italic text-slate-600">
                「{item.content}」
              </p>
              <button className="flex items-center gap-2 text-sm font-black text-amber-600 transition-all hover:gap-3">
                記事全文を読む <ChevronRight className="h-4 w-4" />
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Main Page Execution
export default function ContentHub() {
  const [activeCluster, setActiveCluster] = useState('3');
  const style = getClusterStyle(activeCluster);
  const [items] = useState([
    {
      category: 'Hot Picks',
      title: '【密着】2025年最新。自分を慈しむ週末の過ごし方',
      image:
        'https://images.unsplash.com/photo-1544161515-4ae6b91827d1?auto=format&fit=crop&q=80&w=800',
      date: '2025.03.01',
    },
    {
      category: 'Education',
      title: '専門医が語る「セロトニン分泌」を高めるトリートメント',
      image:
        'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=800',
      date: '2025.02.28',
    },
    {
      category: 'Series',
      title: '東京・隠れ家店舗シリーズ #04 代官山',
      image:
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
      date: '2025.02.25',
    },
    {
      category: 'Trends',
      title: 'プレ社会人が熱視線を送る「ASMRによる解放」',
      image:
        'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800',
      date: '2025.02.20',
    },
  ]);

  return (
    <div
      className={`min-h-screen bg-slate-950 font-sans text-white selection:bg-amber-500/30 ${activeCluster === '10' ? 'text-lg' : ''}`}
    >
      {/* JSON-LD Implementation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Next-Gen Female Content Hub',
            description: '2025年女性向けデジタル市場の決定版・ハブプラットフォーム',
          }),
        }}
      />

      {/* Cinematic Hero */}
      <CinematicHero style={style} activeCluster={activeCluster} />

      {/* Mini-Nav */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 px-6 py-4 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between">
          <div
            className={`font-serif text-2xl font-black tracking-tighter ${activeCluster === '1' ? 'text-pink-500' : 'text-amber-500'}`}
          >
            PLATFORM<span className="text-white">.HUB</span>
          </div>
          <div
            className={`hidden items-center gap-8 font-bold tracking-widest text-slate-400 md:flex ${style.nav}`}
          >
            <a href="#" className="uppercase transition-colors hover:text-white">
              Experience
            </a>
            <a href="#" className="uppercase transition-colors hover:text-white">
              Education
            </a>
            <a href="#" className="uppercase transition-colors hover:text-white">
              Clusters
            </a>
            <a href="#" className="uppercase transition-colors hover:text-white">
              Search
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-colors hover:bg-white/5">
              <Search className="h-4 w-4" />
            </button>
            <button
              className={`rounded-lg bg-white px-5 py-2 text-xs font-black uppercase tracking-widest text-slate-950 transition-colors ${activeCluster === '1' ? 'hover:bg-pink-500' : 'hover:bg-amber-500'}`}
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      <main>
        <ClusterSelector activeId={activeCluster} onSelect={setActiveCluster} />
        <div className="bg-slate-950 py-10">
          <ContentRow title="あなたへのおすすめ" items={items} />
          <ContentRow title="ASMR/五感体験シリーズ" items={items.slice(1, 3)} />
        </div>
        <TablogSearch />
        <EducationSection />

        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-slate-950 py-32">
          <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[150px]" />
          <div className="container relative z-10 mx-auto max-w-4xl px-6 text-center">
            <div className="mb-8 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md">
                <Sparkles className="h-10 w-10 animate-pulse text-amber-400" />
              </div>
            </div>
            <h2 className="mb-8 font-serif text-4xl font-black leading-tight md:text-6xl">
              AI診断で、もっと「わたし」らしい選択を。
            </h2>
            <p className="mb-12 text-lg text-slate-300">
              視聴履歴と行動ログから、あなたの潜在的な嗜好を分析。Netflixのような「受動的発見」をウェルネス体験にも。
            </p>
            <button className="rounded-[2rem] bg-amber-500 px-12 py-6 text-xl font-black text-slate-950 shadow-2xl shadow-amber-500/40 transition-all hover:scale-105">
              AI診断を開始
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black px-6 py-20">
        <div className="container mx-auto grid grid-cols-1 gap-12 text-slate-500 md:grid-cols-4">
          <div className="col-span-2">
            <div className="mb-6 font-serif text-3xl font-black text-amber-500">
              PLATFORM<span className="text-white">.HUB</span>
            </div>
            <p className="mb-8 max-w-md text-sm leading-relaxed">
              2025年、女性のライフスタイルは情報の「消費」から「整え」へと進化します。
            </p>
            <div className="flex gap-4">
              <button className="rounded-full border border-white/10 p-3 hover:bg-white/5">
                <Heart className="h-4 w-4" />
              </button>
              <button className="rounded-full border border-white/10 p-3 hover:bg-white/5">
                <Star className="h-4 w-4" />
              </button>
              <button className="rounded-full border border-white/10 p-3 hover:bg-white/5">
                <BookOpen className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="pt-8 md:pt-0">
            <h5 className="mb-6 text-xs font-bold uppercase tracking-widest text-white">
              Information
            </h5>
            <ul className="space-y-4 text-xs">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  ご利用ガイド
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  安心の取り組み
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-[10px] md:flex-row">
          <div>© 2025 NEXT-GEN HUB PLATFORM.</div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes subtle-zoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.1);
          }
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 20s ease-in-out infinite alternate;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mask-gradient-sides {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </div>
  );
}
