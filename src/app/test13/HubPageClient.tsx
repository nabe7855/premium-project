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
import Script from 'next/script';
import { useEffect, useState } from 'react';

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
    userArticles: any[]; // アモラボ + スイートステイ
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
  const [activeTab, setActiveTab] = useState<'news' | 'tweet' | 'video'>('news');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Twitterウィジェットの再初期化
  useEffect(() => {
    if (activeTab === 'tweet') {
      try {
        // @ts-ignore
        if (window.twttr && window.twttr.widgets) {
          // @ts-ignore
          window.twttr.widgets.load();
        }
      } catch (e) {
        console.error('Twitter widget load error:', e);
      }
    }
  }, [activeTab]);

  const filteredCasts = casts.filter(
    (c) =>
      !searchQuery ||
      c.name?.includes(searchQuery) ||
      c.catchCopy?.includes(searchQuery) ||
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
      <section className="relative flex min-h-[95vh] flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-32">
        {/* メインナビゲーションタブ (Top Nav) */}
        <div className="absolute top-0 z-50 flex w-full items-center justify-center border-b border-slate-100 bg-white/80 px-6 py-6 backdrop-blur-xl">
          <div className="flex gap-4">
            {(
              [
                { id: 'news', label: 'News', icon: <Sparkles className="h-4 w-4" /> },
                { id: 'tweet', label: 'Tweet', icon: <Users className="h-4 w-4" /> },
                { id: 'video', label: 'Video', icon: <Play className="h-4 w-4" /> },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-full px-8 py-3 text-xs font-black transition-all ${
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
        </div>

        {/* 動的コンテンツマッピング */}
        {(() => {
          const contentMap = {
            news: {
              title: '最新のトピックスを、\nこの一箇所で。',
              desc: '女性のウェルネス、ライフスタイル、そして物語。情報の「ハブ」として、最新の情報をいち早くお届けします。',
              img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=2000',
              accent: 'from-rose-500 via-rose-400 to-rose-600',
            },
            tweet: {
              title: 'キャストの「いま」、\n日常を覗く。',
              desc: 'セラピストたちが綴る、飾らない日常とリアルな声。写メ日記を通じて、もっと身近な物語に触れてください。',
              img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=2000',
              accent: 'from-blue-500 via-sky-400 to-blue-600',
            },
            video: {
              title: '躍動する物語を、\nその目で。',
              desc: '一分一秒に込められた想い。最高品質の映像コンテンツが、あなたの感性を刺激するプレミアムな体験を演出します。',
              img: 'https://images.unsplash.com/photo-1485043433441-db091ef2b141?auto=format&fit=crop&q=80&w=2000',
              accent: 'from-amber-500 via-orange-400 to-amber-600',
            },
          };
          const current = contentMap[activeTab];

          return (
            <>
              {/* 背景 (フェード切り替え) */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-white" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-cover bg-center grayscale-[0.3]"
                    style={{ backgroundImage: `url(${current.img})` }}
                  />
                </AnimatePresence>
                <div className="absolute bottom-0 h-64 w-full bg-gradient-to-t from-white to-transparent" />
                <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-rose-500/5 via-transparent to-amber-500/5" />
              </div>

              <div className="relative z-10 w-full max-w-7xl px-4 md:px-12 lg:px-24">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-left"
                  >
                    <h1 className="mb-12 font-serif text-6xl font-black leading-[1.15] tracking-tighter text-slate-900 md:text-8xl lg:text-[8rem]">
                      {current.title.split('\n').map((line, idx) => (
                        <span key={idx} className="block">
                          {line.includes('この一箇所') ||
                          line.includes('日常を覗く') ||
                          line.includes('その目で') ? (
                            <span
                              className={`bg-gradient-to-r ${current.accent} bg-clip-text text-transparent`}
                            >
                              {line}
                            </span>
                          ) : (
                            line
                          )}
                        </span>
                      ))}
                    </h1>
                    <p className="max-w-2xl text-lg font-medium leading-relaxed text-slate-500 md:text-2xl">
                      {current.desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          );
        })()}

        {/* 店舗マーキー */}
        {stores.length > 0 && (
          <div className="absolute bottom-0 z-10 w-full overflow-hidden border-t border-slate-100 bg-white/40 backdrop-blur-md">
            <div className="animate-scroll-text flex whitespace-nowrap py-5">
              {[...stores, ...stores].map((store, i) => (
                <Link
                  key={i}
                  href={
                    store.use_external_url && store.external_url
                      ? store.external_url
                      : `/store/${store.slug}`
                  }
                  target={store.use_external_url && store.external_url ? '_blank' : undefined}
                  className="group mx-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-rose-500"
                >
                  <MapPin className="h-3 w-3 text-rose-500" />
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

      {/* ─── 1.3 全国の店舗一覧 (New Section) ─── */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-black tracking-tighter text-slate-900 md:text-6xl">
              全国の<span className="text-rose-500">店舗一覧</span>
            </h2>
            <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-rose-500" />
            <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
              STORES NATIONWIDE
            </p>
          </motion.div>

          <div className="no-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto pb-12 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3">
            {stores.map((store, i) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative w-[70vw] shrink-0 snap-center overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-50 p-2 transition-all duration-500 hover:border-rose-200 hover:shadow-2xl hover:shadow-rose-500/10 md:w-auto md:shrink"
              >
                <Link
                  href={
                    store.use_external_url && store.external_url
                      ? store.external_url
                      : `/store/${store.slug}`
                  }
                  target={store.use_external_url && store.external_url ? '_blank' : undefined}
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem]">
                    <img
                      src={
                        store.image_url ||
                        'https://images.unsplash.com/photo-1544161515-4ae6b91827d1?auto=format&fit=crop&q=80&w=800'
                      }
                      alt={store.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <span className="flex items-center gap-2 text-xs font-black text-white">
                        VIEW STORE DETAIL <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-rose-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {store.address?.includes(' ') ? store.address.split(' ')[0] : 'LOCATION'}
                      </span>
                    </div>
                    <h3 className="mb-2 truncate text-2xl font-black text-slate-800 transition-colors group-hover:text-rose-500">
                      {store.name}
                    </h3>
                    <p className="line-clamp-2 text-sm font-medium text-slate-500">
                      {store.catch_copy || store.description || '至福のひとときをお約束します。'}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
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
              const firstStore = cast.stores?.[0] || cast.store;
              const storeName = firstStore?.name;

              const getStoreStyle = (name?: string) => {
                if (!name) return 'border-amber-400';
                if (name.includes('福岡')) return 'border-blue-400';
                if (name.includes('横浜')) return 'border-rose-400';
                if (name.includes('梅田')) return 'border-emerald-400';
                if (name.includes('渋谷')) return 'border-purple-400';
                if (name.includes('新宿')) return 'border-sky-400';
                return 'border-amber-400';
              };
              const storeBorder = getStoreStyle(storeName);

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
                            src={cast.imageUrl || cast.mainImageUrl || FALLBACK_CAST_IMG}
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
                          {cast.catchCopy || 'THERAPIST'}
                        </p>
                        {storeName && (
                          <p className="mt-1 text-xs font-bold italic text-slate-400">
                            @ {storeName}
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
          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-12 md:gap-8">
            {diaries.length > 0
              ? diaries.map((diary, i) => {
                  const thumbnail = diary.images?.[0]?.image_url || FALLBACK_CAST_IMG;
                  const rawCast = (diary as any).casts || (diary as any).cast;
                  const castData = Array.isArray(rawCast) ? rawCast[0] : rawCast;
                  const castImg =
                    castData?.main_image_url || castData?.image_url || FALLBACK_CAST_IMG;
                  const castName = castData?.name || 'THERAPIST';

                  return (
                    <motion.div
                      key={diary.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false, amount: 0.1 }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative w-[35vw] shrink-0 cursor-pointer snap-center md:w-auto md:min-w-[320px] md:max-w-[320px]"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-slate-100 shadow-2xl transition-all duration-700 group-hover:-translate-y-2 group-hover:shadow-rose-500/20 md:rounded-[2.5rem]">
                        {/* メインの写メ画像 */}
                        <img
                          src={thumbnail}
                          alt={diary.title}
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />

                        {/* オーバーレイグラデーション */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                        {/* 下部コンテンツ */}
                        <div className="absolute bottom-0 left-0 w-full p-4 text-white md:p-8">
                          <div className="mb-2 flex items-center gap-2 md:mb-4 md:gap-3">
                            <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-white/30 md:h-10 md:w-10">
                              <img
                                src={castImg}
                                alt={castName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-[8px] font-black tracking-wider opacity-80 md:text-xs">
                                {castName}
                              </p>
                              <p className="text-[6px] font-bold opacity-60 md:text-[10px]">
                                {new Date(diary.created_at).toLocaleDateString('ja-JP')}
                              </p>
                            </div>
                          </div>
                          <h3 className="line-clamp-2 text-xs font-black leading-tight tracking-tight md:text-xl">
                            {diary.title}
                          </h3>
                        </div>

                        {/* 日付バッジ (Top Left) */}
                        <div className="absolute left-3 top-3 rounded-full bg-white/10 px-2 py-1 backdrop-blur-md md:left-6 md:top-6 md:px-4 md:py-2">
                          <span className="text-[6px] font-black tracking-widest text-white md:text-[10px]">
                            NEW ENTRY
                          </span>
                        </div>
                      </div>
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
                { id: 'news', label: 'ニュース一覧', icon: <Sparkles className="h-4 w-4" /> },
                { id: 'tweet', label: 'ツイート一覧', icon: <Users className="h-4 w-4" /> },
                { id: 'video', label: '動画一覧', icon: <Play className="h-4 w-4" /> },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-8 py-4 text-sm font-black transition-all ${
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
            {activeTab === 'news' && (
              <motion.div
                key="news"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
              >
                {[...mediaArticles.userArticles, ...mediaArticles.recruitArticles]
                  .slice(0, 9)
                  .map((article: any) => (
                    <motion.div
                      key={article.id}
                      whileHover={{ y: -8 }}
                      className="group cursor-pointer overflow-hidden rounded-[1.2rem] bg-slate-50 p-1 md:rounded-[2.5rem] md:p-2"
                    >
                      <Link href={article.url || '#'}>
                        <div className="relative aspect-video overflow-hidden rounded-[1rem] md:rounded-[2rem]">
                          <img
                            src={article.thumbnail_url || FALLBACK_CAST_IMG}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={article.title}
                          />
                        </div>
                        <div className="p-3 md:p-6">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-[8px] font-black uppercase tracking-widest text-rose-500 md:text-[10px]">
                              NEWS
                            </span>
                            <span className="text-[8px] font-bold text-slate-400 md:text-[10px]">
                              {new Date().toLocaleDateString('ja-JP')}
                            </span>
                          </div>
                          <h3 className="line-clamp-2 text-xs font-black text-slate-800 transition-colors group-hover:text-rose-500 md:text-xl">
                            {article.title}
                          </h3>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
              </motion.div>
            )}

            {activeTab === 'tweet' && (
              <motion.div
                key="tweet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-auto max-w-2xl px-4"
              >
                <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-4 shadow-xl">
                  {/* Twitter Timeline Embed */}
                  <a
                    className="twitter-timeline"
                    data-height="800"
                    data-theme="light"
                    href="https://twitter.com/hashtag/%E3%82%B9%E3%83%88%E3%83%AD%E3%83%99%E3%83%AA%E3%83%BC%E3%83%9C%E3%83%BC%E3%82%A4%E3%82%BA?src=hash&ref_src=twsrc%5Etfw"
                  >
                    Tweets about #ストロベリーボーイズ
                  </a>
                </div>
              </motion.div>
            )}

            {activeTab === 'video' && (
              <motion.div
                key="video"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
              >
                {videos.map((video: any) => (
                  <motion.div
                    key={video.id}
                    whileHover={{ y: -8 }}
                    className="group cursor-pointer overflow-hidden rounded-[2.5rem] bg-slate-50 p-2"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-[2rem]">
                      <img
                        src={video.thumbnail_url}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={video.title}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-2xl backdrop-blur-md transition-transform group-hover:scale-110">
                          <Play className="h-8 w-8 translate-x-1 fill-white text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="line-clamp-2 text-sm font-black leading-tight text-slate-800 transition-colors group-hover:text-rose-500">
                        {video.title}
                      </h3>
                      {video.stores && (
                        <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {video.stores.name}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <Script src="https://platform.twitter.com/widgets.js" strategy="afterInteractive" />
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
              {diaries.slice(0, 6).map((d: any) => (
                <motion.div
                  key={d.id}
                  whileHover={{ y: -4 }}
                  className="flex items-center gap-4 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white p-2 md:rounded-[2rem] md:p-4"
                >
                  <div className="aspect-square w-[22vw] shrink-0 overflow-hidden rounded-xl md:w-32 md:rounded-2xl">
                    <img src={d.images?.[0]?.image_url} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 text-sm font-black text-slate-800 md:text-lg">
                      {d.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[10px] font-medium text-slate-400 md:text-sm">
                      {d.content}
                    </p>
                    <p className="mt-2 text-[8px] font-bold text-rose-300 md:hidden">
                      {new Date(d.created_at).toLocaleDateString('ja-JP')}
                    </p>
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
          title: 'アモラボ',
          sub: "Women's Wellness",
          illustration: '/ハブページメディアイラスト/イケジョ.png',
          color: 'rose',
          bgColor: 'bg-rose-50',
          textColor: 'text-slate-900',
          subTextColor: 'text-slate-500',
          href: '/ikejo',
          icon: '💗',
          desc: '自立した女性のライフスタイルメディア。ウェルビーイングから日常의整えまで、現代女性に寄り添うヒントを届けます。',
          articles: mediaArticles.userArticles.slice(0, 4),
        },
        {
          title: 'イケオラボ',
          sub: "Men's Wellness",
          illustration: '/ハブページメディアイラスト/イケオ.png',
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
          illustration: '/ハブページメディアイラスト/スイートホテル.png',
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
          className={`${media.bgColor} relative overflow-hidden px-6 py-16 transition-colors duration-500`}
        >
          <div className="relative z-10 mx-auto max-w-7xl">
            {/* 1段目: メディア名と説明セクション */}
            <div className="mb-12">
              {/* レベル1: メディア名 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                className="mb-8"
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
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ delay: 0.2 }}
                  className={`${media.title === 'イケオラボ' ? 'order-2' : 'order-1'} relative z-20`}
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`flex ${media.title === 'イケオラボ' ? 'justify-start' : 'justify-end'} ${media.title === 'イケオラボ' ? 'order-1' : 'order-2'} relative z-10`}
                >
                  <div
                    className={`relative aspect-square w-[180%] max-w-[400px] md:w-[220%] md:max-w-[1000px] ${
                      media.title === 'イケオラボ'
                        ? '-translate-x-[20%] md:-translate-x-[30%]'
                        : 'translate-x-[20%] md:translate-x-[30%]'
                    }`}
                  >
                    <img
                      src={(media as any).illustration}
                      alt={media.title}
                      className="h-full w-full object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                    />
                    <div
                      className={`absolute inset-0 -z-10 rounded-full opacity-30 blur-[60px] md:blur-[120px] ${
                        media.title === 'イケオラボ'
                          ? 'bg-blue-400'
                          : media.title === 'アモラボ'
                            ? 'bg-rose-400'
                            : 'bg-amber-400'
                      }`}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* 2段目: コンテンツスライダー (画面いっぱいの枠線) */}
            <div
              className={`-mx-6 border-b-2 border-t-2 border-solid px-6 py-10 ${
                media.title === 'イケオラボ'
                  ? 'border-blue-500/40'
                  : media.title === 'アモラボ'
                    ? 'border-rose-200/60'
                    : 'border-sky-200/60'
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
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
              viewport={{ once: false, amount: 0.1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex justify-start pl-6"
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
