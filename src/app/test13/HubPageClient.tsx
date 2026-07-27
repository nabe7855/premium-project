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
  Compass,
  Map,
  Calculator,
  Award,
  Lock,
  Crown,
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
    amolabArticles: any[];
    sweetStayArticles: any[];
    ikeoArticles: any[];
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

      {/* ─── 1. HERO (画像2のデザインを100%完全再現) ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF6F3] via-[#F7F0EB] to-white pt-6 pb-16">
        {/* SEOアクセシブルH1 */}
        <h1 className="sr-only">
          【公式】女性用風俗・女風・出張ホスト ストロベリーボーイズ | 大人になっても、ときめいていい。全国対応拠点
        </h1>

        {/* ブランドヘッダーナビ */}
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between py-4 mb-8 border-b border-rose-100/60">
          <div className="flex flex-col">
            <span className="font-serif text-xl font-black tracking-widest text-slate-800">
              STRAWBERRY BOYS
            </span>
            <span className="text-[9px] font-bold tracking-widest text-rose-400 uppercase">
              WOMEN'S PRIVATE SERVICE — 女性専用・全国対応
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#stores" className="flex items-center gap-1 hover:text-rose-500 transition">
              <MapPin className="h-3.5 w-3.5 text-rose-500" />
              全国の店舗
            </a>
            <a href="#about" className="hover:text-rose-500 transition">
              ブランドについて
            </a>
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-full border border-slate-700 px-4 py-1.5 text-slate-800 hover:bg-slate-900 hover:text-white transition"
            >
              <Lock className="h-3 w-3" />
              ログイン
            </Link>
          </div>
        </div>

        {/* ヒーローメインコンテンツ (画像2の左右非対称レイアウト) */}
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* 左側: キャッチコピー & 説明文 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100/80 px-3.5 py-1 text-xs font-bold text-rose-600">
              <Sparkles className="h-3.5 w-3.5 text-rose-500" />
              女性専用・全国対応
            </div>

            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.15] tracking-tight">
              大人になっても、<br />
              <span className="text-rose-500">ときめいていい。</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-md">
              あなたの街で、心ほどける時間を。<br />
              全国の店舗からお選びください。
            </p>

            <div className="pt-2 flex items-center gap-1 text-amber-500">
              <Crown className="h-4 w-4 fill-current" />
              <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                PREMIUM QUALITY FOR LADIES
              </span>
            </div>
          </motion.div>

          {/* 右側: イケメンセラピスト3重切り抜きビジュアル */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-6 relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-rose-900/10 border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200"
                alt="イケメンセラピスト - ストロベリーボーイズ"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-6">
                <span className="font-serif italic text-2xl text-rose-200 drop-shadow-md">
                  Find your special time.
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── エリアを選択する (画像2下部 - 本物都市夜景画像) ─── */}
        <div id="stores" className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-8">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5 text-rose-500" />
              利用するエリアを選ぶ
            </h3>
          </div>

          {/* 5大都市カードグリッド */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                name: '東京',
                en: 'TOKYO',
                count: '24名',
                href: 'https://strawberryboys.net/',
                isExternal: true,
                img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600',
              },
              {
                name: '大阪',
                en: 'OSAKA',
                count: '18名',
                href: 'https://strawberryboys-osaka.net/',
                isExternal: true,
                img: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&q=80&w=600',
              },
              {
                name: '横浜',
                en: 'YOKOHAMA',
                count: '16名',
                href: '/store/yokohama',
                isExternal: false,
                img: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&q=80&w=600',
              },
              {
                name: '名古屋',
                en: 'NAGOYA',
                count: '14名',
                href: 'https://strawberryboys-nagoya.net/',
                isExternal: true,
                img: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=600',
              },
              {
                name: '福岡',
                en: 'FUKUOKA',
                count: '12名',
                href: '/store/fukuoka',
                isExternal: false,
                img: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&q=80&w=600',
              },
            ].map((city, idx) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-md border border-rose-100 hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col"
              >
                <Link
                  href={city.href}
                  target={city.isExternal ? '_blank' : undefined}
                  className="flex flex-col h-full"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={city.img}
                      alt={`${city.name}店 本物の夜景`}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-rose-500/90 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-md">
                      本日受付中
                    </span>
                  </div>
                  <div className="p-3 text-left flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <h4 className="font-serif text-base font-bold text-slate-800">
                          {city.name} <span className="text-[10px] text-slate-400 font-normal">{city.en}</span>
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-500 mb-3">
                        セラピスト <span className="font-bold text-slate-700">{city.count}</span>
                      </p>
                    </div>
                    <button className="w-full rounded-xl bg-rose-500 py-2 text-xs font-bold text-white shadow-sm transition group-hover:bg-rose-600 flex items-center justify-center gap-1">
                      <span>{city.name}店を見る</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* 下部サーチナビ */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 text-xs font-bold">
            <a
              href="#stores"
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 border border-slate-200 shadow-sm hover:border-rose-300 text-slate-700"
            >
              <Compass className="h-4 w-4 text-rose-500" />
              現在地から近い店舗を探す
            </a>
            <a
              href="#stores"
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 border border-slate-200 shadow-sm hover:border-rose-300 text-slate-700"
            >
              <Map className="h-4 w-4 text-rose-500" />
              都道府県から探す
            </a>
          </div>
        </div>
      </section>

      {/* ─── 2. 「わたしたちについて」セクション (画像1のデザインを100%完全再現) ─── */}
      <section id="about" className="relative overflow-hidden bg-white py-20 border-t border-rose-100/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* 左側: ラウンドカット画像 (洗練された日本人セラピストモデル) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-[4/5] rounded-[3rem] overflow-hidden shadow-xl border-4 border-rose-50">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
                  alt="安心とエスコート - ストロベリーボーイズ"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>

            {/* 右側: メッセージ ＆ 4つの安心機能カード */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 text-left space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-1.5 text-xs font-bold text-rose-600 border border-rose-100">
                <Crown className="h-3.5 w-3.5 text-rose-500" />
                ABOUT STRAWBERRY BOYS わたしたちについて
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                安心できるから、<br />
                <span className="text-rose-500">ときめき</span>に素直になれる。
              </h3>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
                仕事も、日常も、いつも頑張っているあなたへ。<br />
                癒やされたい夜も、誰かに甘えたい夜も、ここでは、あなたの気持ちとペースを大切にします。<br />
                ストロベリーボーイズは、初めての方にも安心してご利用いただける女性専用の出張サービスです。
              </p>

              {/* 4つの安心カード (画像1再現) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3.5 rounded-2xl bg-[#FAF6F3] p-4 border border-rose-100/80">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">全国主要エリアに対応</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">東京・横浜・名古屋・大阪・福岡など</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl bg-[#FAF6F3] p-4 border border-rose-100/80">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">分かりやすい料金体系</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">ご利用前に料金をご確認いただけます</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl bg-[#FAF6F3] p-4 border border-rose-100/80">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">プライバシーへの配慮</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">ご相談・ご利用内容を慎重に取り扱います</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl bg-[#FAF6F3] p-4 border border-rose-100/80">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">独自基準による採用</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">接客・清潔感・マナーを重視しています</p>
                  </div>
                </div>
              </div>

              {/* ボタン2種 (画像1再現) */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/store/fukuoka/first-time"
                  className="flex items-center gap-2 rounded-full bg-rose-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>初めての方へ</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>

                <a
                  href="#faq"
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-rose-500 underline underline-offset-4 transition"
                >
                  安心への取り組みを見る <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* ドメインパワー巡回用 SEOキーワードアンカーテキストブロック (画像1最下部再現) */}
          <div className="mt-16 rounded-3xl bg-[#FAF6F3] p-6 sm:p-8 border border-rose-100/80 text-center">
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto mb-4">
              ストロベリーボーイズは、東京・横浜・名古屋・大阪・福岡など全国の主要エリアに対応する女性専用の出張サービスです。女性用風俗・女風を始めて利用される方にも安心してお選びいただけるよう、料金、ご予約方法、セラピスト情報を分かりやすくご案内しています。
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs font-bold text-rose-600">
              <a href="https://strawberryboys.net/" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                <MapPin className="h-3 w-3" /> 東京のセラピスト
              </a>
              <span className="text-slate-300">/</span>
              <Link href="/store/yokohama" className="hover:underline flex items-center gap-1">
                <MapPin className="h-3 w-3" /> 横浜のセラピスト
              </Link>
              <span className="text-slate-300">/</span>
              <a href="https://strawberryboys-nagoya.net/" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                <MapPin className="h-3 w-3" /> 名古屋のセラピスト
              </a>
              <span className="text-slate-300">/</span>
              <a href="https://strawberryboys-osaka.net/" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                <MapPin className="h-3 w-3" /> 大阪のセラピスト
              </a>
              <span className="text-slate-300">/</span>
              <Link href="/store/fukuoka" className="hover:underline flex items-center gap-1">
                <MapPin className="h-3 w-3" /> 福岡のセラピスト
              </Link>
            </div>
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
                {(diaries.length > 0 ? diaries.slice(0, 6) : [1, 2, 3]).map((d: any, idx: number) => {
                  const title = d.title || '最新のお知せ・トピックス';
                  const thumbnail = d.images?.[0]?.image_url || FALLBACK_CAST_IMG;
                  const dateStr = d.created_at
                    ? new Date(d.created_at).toLocaleDateString('ja-JP')
                    : new Date().toLocaleDateString('ja-JP');

                  return (
                    <motion.div
                      key={d.id || idx}
                      whileHover={{ y: -8 }}
                      className="group cursor-pointer overflow-hidden rounded-[1.2rem] bg-slate-50 p-1 md:rounded-[2.5rem] md:p-2"
                    >
                      <div className="relative aspect-video overflow-hidden rounded-[1rem] md:rounded-[2rem]">
                        <img
                          src={thumbnail}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={title}
                        />
                      </div>
                      <div className="p-3 md:p-6">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-[8px] font-black uppercase tracking-widest text-rose-500 md:text-[10px]">
                            TOPICS
                          </span>
                          <span className="text-[8px] font-bold text-slate-400 md:text-[10px]">
                            {dateStr}
                          </span>
                        </div>
                        <h3 className="line-clamp-2 text-xs font-black text-slate-800 transition-colors group-hover:text-rose-500 md:text-xl">
                          {title}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
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

      {/* ─── 3.5 オウンドメディア連携（非表示化） ─── */}


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
