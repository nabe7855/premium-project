'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MapPin,
  Play,
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
                  <p>誰にも打ち明けられなかった、胸の奥の疼き</p>
                  <p>正解が見つからない、自分だけの迷い</p>
                  <p>ずっと鍵をかけてきた、純粋な衝動</p>
                </div>

                <div className="py-4 font-black">
                  <p className="text-rose-500">自分自身を慈しみ、心も体も自由になるために</p>
                  <p>本当の気持ちから、もう目を逸らさないために</p>
                  <p>あなたに寄り添う、確かな居場所</p>
                </div>

                <div className="py-2">
                  <p className="text-2xl font-black text-slate-900">女性専用ウェルネスサービス</p>
                  <p className="text-xs font-black tracking-[0.3em] text-slate-400">
                    - ストロベリーボーイズ -
                  </p>
                </div>

                <div className="space-y-2 pt-4">
                  <p>ほんの少し、心を開いて</p>
                  <p>最上級の技術と優しさを持つセラピストと共に</p>
                  <p>昨日までの自分を超えて</p>
                  <p className="mt-4 text-xl font-bold text-slate-900">
                    まだ見ぬ、幸福な物語を始めませんか
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

      {/* ─── 1.4 全国から選ばれた人気者 (Marquee Version) ─── */}
      <section className="overflow-hidden bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="mb-4 text-4xl font-black tracking-tighter text-slate-900 md:text-6xl">
              全国の<span className="text-rose-500">人気セラピスト</span>たち
            </h2>
            <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-rose-500" />
            <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
              NATIONAL POPULAR THERAPISTS
            </p>
          </motion.div>
        </div>

        {/* 自動無限スクロール (Marquee) */}
        <div className="relative mt-8 flex overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-32 before:bg-gradient-to-r before:from-slate-50 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-32 after:bg-gradient-to-l after:from-slate-50 after:to-transparent">
          <div className="animate-scroll-text flex cursor-pointer space-x-12 whitespace-nowrap py-10 hover:[animation-play-state:paused]">
            {[...casts.slice(0, 10), ...casts.slice(0, 10)].map((cast, i) => {
              // 店舗スタイル (店舗名に応じてカラーリングを変更)
              const getStoreStyle = (storeName?: string) => {
                if (!storeName) return 'border-amber-400';
                if (storeName.includes('福岡')) return 'border-blue-400';
                if (storeName.includes('横浜')) return 'border-rose-400';
                if (storeName.includes('梅田')) return 'border-emerald-400';
                if (storeName.includes('渋谷')) return 'border-purple-400';
                if (storeName.includes('新宿')) return 'border-sky-400';
                return 'border-amber-400';
              };
              const storeBorder = getStoreStyle(cast.store?.name);

              return (
                <div key={`${cast.id}-${i}`} className="inline-block w-48 shrink-0 text-center">
                  <Link href={`/cast/${cast.slug || cast.id}`}>
                    <div className="group">
                      {/* 丸い画像と店舗別カラーの枠線 */}
                      <div
                        className={`relative mx-auto mb-6 h-44 w-44 overflow-hidden rounded-full border-4 border-solid ${storeBorder} bg-white p-1.5 shadow-xl transition-all duration-700 group-hover:scale-110 md:h-52 md:w-52`}
                      >
                        <div className="h-full w-full overflow-hidden rounded-full ring-2 ring-slate-50">
                          <img
                            src={cast.image_url || cast.main_image_url || FALLBACK_CAST_IMG}
                            alt={cast.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      </div>
                      <div className="px-4 text-center">
                        <h3 className="text-xl font-black tracking-tight text-slate-800 transition-colors group-hover:text-rose-500">
                          {cast.name}
                        </h3>
                        <p
                          className={`mb-2 mt-0.5 truncate text-[10px] font-black uppercase tracking-widest text-rose-400 opacity-80`}
                        >
                          {cast.catch_copy || 'THERAPIST'}
                        </p>
                        {cast.store && (
                          <p className="mt-1 text-xs font-bold italic text-slate-400">
                            @ {cast.store.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 1.5 最新の写メ日記 (Diary Section Refined) ─── */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex items-end justify-between"
          >
            <div>
              <h2 className="mb-4 text-4xl font-black tracking-tighter text-slate-900">
                最新の写メ日記
              </h2>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-rose-500/60">
                LATEST PHOTO DIARY
              </p>
            </div>
          </motion.div>

          {/* 横スクロールカード */}
          <div className="no-scrollbar flex gap-6 overflow-x-auto pb-8">
            {diaries.length > 0
              ? diaries.map((diary, i) => {
                  const isActive =
                    activeCluster === diary.id || (i === 0 && activeCluster === '中堅シングル');
                  const thumbnail = diary.images?.[0]?.image_url || FALLBACK_CAST_IMG;

                  return (
                    <motion.div
                      key={diary.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setActiveCluster(diary.id)}
                      className={`group relative min-w-[300px] max-w-[350px] cursor-pointer overflow-hidden rounded-[2.5rem] border p-10 transition-all duration-500 ${
                        isActive
                          ? 'border-rose-500 bg-rose-500 shadow-2xl shadow-rose-500/20'
                          : 'border-slate-100 bg-slate-50 hover:border-rose-200 hover:bg-white'
                      }`}
                    >
                      {/* 写メ画像サムネイル (円形) */}
                      <div
                        className={`mb-8 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-solid shadow-md transition-all duration-700 ${
                          isActive ? 'border-white/40' : 'border-rose-100 group-hover:scale-110'
                        }`}
                      >
                        <img src={thumbnail} alt="thumb" className="h-full w-full object-cover" />
                      </div>

                      <div className="relative z-10">
                        <span
                          className={`mb-2 block text-[10px] font-black uppercase tracking-[0.2em] ${
                            isActive ? 'text-white/60' : 'text-slate-400'
                          }`}
                        >
                          {diary.casts?.name || 'THERAPIST'} •{' '}
                          {new Date(diary.created_at).toLocaleDateString('ja-JP')}
                        </span>
                        <h3
                          className={`line-clamp-2 text-xl font-black leading-tight ${
                            isActive ? 'text-white' : 'text-slate-800 group-hover:text-rose-500'
                          }`}
                        >
                          {diary.title}
                        </h3>
                      </div>

                      {/* 装飾用サークル要素 */}
                      <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-transform group-hover:scale-150" />
                    </motion.div>
                  );
                })
              : // 記事がない場合のフォールバック
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="min-w-[300px] animate-pulse rounded-[2.5rem] border border-slate-100 bg-slate-50 p-10"
                  >
                    <div className="mb-8 h-16 w-16 rounded-full bg-slate-200" />
                    <div className="mb-4 h-4 w-1/4 rounded bg-slate-200" />
                    <div className="h-6 w-3/4 rounded bg-slate-200" />
                  </div>
                ))}
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

      {/* ─── 3.5 オウンドメディア連携 (各セクション化) ─── */}
      {[
        {
          title: 'イケジョラボ',
          sub: "Women's Wellness",
          color: 'rose',
          bgColor: 'bg-rose-50',
          textColor: 'text-slate-900',
          subTextColor: 'text-slate-500',
          href: '/ikejo',
          icon: '💗',
          desc: '自立した女性のライフスタイルメディア。ウェルビーイングから日常の整えまで、現代女性に寄り添うヒントを届けます。',
          articles: mediaArticles.userArticles.slice(0, 4),
        },
        {
          title: 'イケオラボ',
          sub: "Men's Wellness",
          color: 'blue',
          bgColor: 'bg-blue-900',
          textColor: 'text-white',
          subTextColor: 'text-blue-200',
          href: '/ikeo',
          icon: '⚡',
          desc: 'メンズウェルネス。選ばれる男へのナビゲート。心身のコンディショニングを通じた新しいライフスタイルを提案。',
          articles: mediaArticles.recruitArticles.slice(0, 4),
        },
        {
          title: 'スイートステイ',
          sub: 'Hotel Guide',
          color: 'amber',
          bgColor: 'bg-sky-50',
          textColor: 'text-slate-900',
          subTextColor: 'text-slate-500',
          href: '/sweetstay',
          icon: '🏨',
          desc: '大人の隠れ家ホテルガイド。AIが導く一軒。特別な夜を彩る、あなただけに最適な空間をナビゲートします。',
          articles: mediaArticles.userArticles.slice(0, 4), // 本来はフィルタリングした方が良いが一旦流用
        },
      ].map((media, idx) => (
        <section
          key={media.title}
          className={`${media.bgColor} overflow-hidden px-6 py-24 transition-colors duration-500`}
        >
          <div className="mx-auto max-w-7xl">
            {/* 1段目: メディア名と説明セクション */}
            <div className="mb-20">
              {/* レベル1: メディア名 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2
                  className={`text-5xl font-black tracking-tighter md:text-7xl ${media.textColor}`}
                >
                  {media.title}
                </h2>
              </motion.div>

              {/* レベル2: 説明文と画像の50/50分割 */}
              {/* レベル2: 説明文と画像の50/50分割 */}
              <div className="grid grid-cols-2 items-center gap-4 md:gap-12">
                <motion.div
                  initial={{ opacity: 0, x: media.title === 'イケオラボ' ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className={`${media.title === 'イケオラボ' ? 'order-2' : 'order-1'}`}
                >
                  <div
                    className={`mb-4 inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest md:mb-6 md:px-4 md:text-xs ${
                      media.title === 'イケオラボ'
                        ? 'bg-blue-800 text-blue-300'
                        : 'bg-rose-100 text-rose-500'
                    }`}
                  >
                    {media.sub}
                  </div>
                  <p
                    className={`mb-4 text-sm font-bold leading-tight md:mb-8 md:text-2xl md:leading-relaxed ${media.textColor}`}
                  >
                    私たちのミッションは、
                    <br />
                    <span className="bg-yellow-200/30 px-1 md:px-2">
                      「{media.desc.split('。')[0]}」
                    </span>
                    ことです。
                  </p>
                  <p
                    className={`line-clamp-3 text-[10px] font-medium leading-relaxed opacity-80 md:line-clamp-none md:text-lg ${media.subTextColor}`}
                  >
                    {media.desc}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: media.title === 'イケオラボ' ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className={`flex justify-center ${media.title === 'イケオラボ' ? 'order-1' : 'order-2'}`}
                >
                  <div className="relative aspect-square w-full max-w-[120px] md:max-w-md">
                    <img
                      src="/media-illustration.png"
                      alt={media.title}
                      className="relative z-10 h-full w-full object-contain"
                    />
                    <div
                      className={`absolute inset-0 -z-0 rounded-full opacity-20 blur-[40px] md:blur-[100px] ${
                        media.title === 'イケオラボ' ? 'bg-blue-400' : 'bg-rose-400'
                      }`}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* 2段目: コンテンツスライダー (画面いっぱいの枠線) */}
            <div
              className={`-mx-6 border-b-2 border-t-2 border-solid px-6 py-12 ${
                media.title === 'イケオラボ'
                  ? 'border-blue-500/40'
                  : media.title === 'イケジョラボ'
                    ? 'border-rose-200/60'
                    : 'border-sky-200/60'
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                className="relative mx-auto max-w-7xl"
              >
                <div className="no-scrollbar flex snap-x gap-6 overflow-x-auto px-4 pb-8">
                  {media.articles && media.articles.length > 0
                    ? media.articles.map((article: any, i: number) => (
                        <Link
                          key={article.id || i}
                          href={`/media/article/${article.slug}`}
                          className="group min-w-[300px] max-w-[350px] flex-shrink-0 snap-start"
                        >
                          <div className="mb-4 aspect-[4/3] overflow-hidden rounded-[2rem] bg-slate-100 shadow-lg ring-1 ring-slate-200/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-rose-500/10">
                            <img
                              src={
                                article.thumbnail_url ||
                                'https://images.unsplash.com/photo-1516589174184-c18259ec398e?auto=format&fit=crop&q=80&w=600'
                              }
                              alt={article.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <h4
                            className={`line-clamp-2 text-lg font-bold transition-colors ${media.textColor} group-hover:text-rose-400`}
                          >
                            {article.title}
                          </h4>
                          <p
                            className={`mt-2 text-xs font-medium ${media.subTextColor} opacity-60`}
                          >
                            {new Date(article.published_at || Date.now()).toLocaleDateString(
                              'ja-JP',
                            )}
                          </p>
                        </Link>
                      ))
                    : // 記事がない場合のフォールバック
                      [1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="min-w-[300px] max-w-[350px] flex-shrink-0 opacity-40"
                        >
                          <div className="mb-4 aspect-[4/3] animate-pulse rounded-[2rem] bg-slate-200" />
                          <div className="h-4 w-3/4 rounded bg-slate-200" />
                        </div>
                      ))}
                </div>
                {/* スライドアシスト用フェード */}
                <div
                  className={`pointer-events-none absolute right-0 top-0 hidden h-full w-24 bg-gradient-to-l ${media.bgColor === 'bg-blue-900' ? 'from-blue-900' : 'from-white'} to-transparent md:block`}
                />
                <div className="group absolute -right-4 top-1/2 hidden -translate-y-1/2 cursor-pointer rounded-full border border-slate-100 bg-white p-4 shadow-xl transition-colors hover:bg-rose-500 hover:text-white md:block">
                  <ChevronRight className="h-6 w-6" />
                </div>
              </motion.div>
            </div>

            {/* 3段目: ボタン */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex justify-start pl-6"
            >
              <Link
                href={media.href}
                className={`flex items-center gap-3 rounded-full border px-8 py-3 text-sm font-black shadow-sm transition-all hover:gap-5 ${
                  media.title === 'イケオラボ'
                    ? 'border-blue-700 bg-blue-800 text-white hover:border-white hover:bg-white hover:text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-rose-500 hover:bg-rose-500 hover:text-white'
                }`}
              >
                サイトを見る <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      ))}

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
