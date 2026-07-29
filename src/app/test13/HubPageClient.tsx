'use client';

import HubHeroSection from '@/components/home/HubHeroSection';
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
import { useEffect, useState, useMemo } from 'react';
import { AREA_MAP, TARGET_AREAS } from '@/lib/area-data';

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
  newsPages?: any[];
  mediaArticles: {
    amolabArticles: any[];
    sweetStayArticles: any[];
    ikeoArticles: any[];
  };
}

/* ─── 🚀 店舗 ✕ 代表キャスト動的連動プレミアムスライダー ───────────────────────── */

function HeroStoreCastSlider({ stores, casts }: { stores: any[]; casts: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 店舗ごとに代表キャストをバインドする動的スライドデータ作成
  const slides = useMemo(() => {
    if (!stores || stores.length === 0) {
      return [
        {
          storeName: '福岡店',
          storeSlug: 'fukuoka',
          areaName: '博多・天神・中洲',
          castName: '優斗',
          castAge: '24',
          castCatch: '甘く優しい言葉と至福のオイルトリートメント',
          castImage: '/ゆうと.png',
          badgeText: '✨ 福岡店 人気看板キャスト',
        },
        {
          storeName: '横浜店',
          storeSlug: 'yokohama',
          areaName: '関内・みなとみらい・桜木町',
          castName: '蓮',
          castAge: '26',
          castCatch: '極上の癒やしと大人のプライベートサロンタイム',
          castImage: '/シュン.png',
          badgeText: '👑 横浜店 人気看板キャスト',
        },
      ];
    }

    return stores.map((store) => {
      // 店舗に紐づくキャストを抽出（または全キャストから検索）
      const storeCasts = casts.filter(
        (c) => c.store_id === store.id || c.storeSlug === store.slug || c.store_slug === store.slug,
      );
      const topCast = storeCasts.length > 0 ? storeCasts[0] : (casts.length > 0 ? casts[0] : null);

      return {
        storeName: store.name || `${store.slug === 'fukuoka' ? '福岡店' : '横浜店'}`,
        storeSlug: store.slug,
        areaName: store.slug === 'fukuoka' ? '博多・天神・中洲対応' : '関内・みなとみらい・桜木町対応',
        castName: topCast?.name || '人気イケメンセラピスト',
        castAge: topCast?.age ? `${topCast.age}歳` : '20代',
        castCatch: topCast?.catchCopy || topCast?.catch_copy || store.catch_copy || '極上の癒やしをお届けいたします',
        castImage:
          topCast?.imageUrl ||
          topCast?.image_url ||
          topCast?.image ||
          (store.slug === 'fukuoka'
            ? '/ゆうと.png'
            : '/シュン.png'),
        badgeText: `✨ ${store.name || store.slug}店 代表キャスト`,
      };
    });
  }, [stores, casts]);

  // 3.5秒ごとの自動スライド切替
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="lg:col-span-6 relative flex justify-center lg:justify-end"
    >
      <div className="relative w-full max-w-lg aspect-[4/5] sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-rose-900/15 border-4 border-white bg-slate-900 group">
        
        {/* 背景画像 ＆ スライドトランジション */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <img
              src={currentSlide.castImage}
              alt={`${currentSlide.storeName} - ${currentSlide.castName}`}
              className="h-full w-full object-cover object-top"
            />
            {/* シネマティックグラデーションオーバーレイ */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* 🚀 店舗名 ＆ キャスト名連動ダイナミックバッジ */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/20 shadow-lg">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span>{currentSlide.badgeText}</span>
          </div>
          <div className="rounded-full bg-rose-500/90 text-white font-serif text-[11px] font-bold px-3 py-1 backdrop-blur-sm shadow-md">
            {currentSlide.areaName}
          </div>
        </div>

        {/* 🚀 キャスト詳細 ＆ 店舗案内オーバーレイ (タップで店舗へ) */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 space-y-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-1.5"
            >
              {/* 店舗とキャストの関係一目判定表記 */}
              <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                <MapPin className="h-3.5 w-3.5 text-rose-400" />
                <span>【{currentSlide.storeName} 在籍セラピスト】</span>
              </div>

              {/* キャスト名 ＆ 年齢 */}
              <div className="flex items-baseline gap-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-black text-white drop-shadow-md">
                  {currentSlide.castName}
                </h3>
                <span className="text-xs font-bold text-slate-300">({currentSlide.castAge})</span>
              </div>

              {/* キャッチコピー */}
              <p className="text-xs sm:text-sm text-slate-200 font-medium line-clamp-2 drop-shadow">
                「{currentSlide.castCatch}」
              </p>
            </motion.div>
          </AnimatePresence>

          {/* アクションボタン ＆ ナビゲーションインジケーター */}
          <div className="pt-2 flex items-center justify-between border-t border-white/15">
            <Link
              href={`/store/${currentSlide.storeSlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 hover:text-white transition group/btn"
            >
              <span>{currentSlide.storeName}の出勤スケジュールを見る</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition" />
            </Link>

            {/* スライドドットインジケーター */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-5 bg-rose-500' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`スライド ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

/* ─── メインコンポーネント ─────────────────────────────── */

export default function HubPageClient({
  casts,
  stores,
  videos,
  diaries,
  newsPages,
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

  const FALLBACK_CAST_IMG = '/ゆうと.png';

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-slate-50 text-slate-900 selection:bg-rose-500/30">
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

      {/* ─── 1. HERO (ワイヤーフレーム忠実再現の新HubHeroSection) ─── */}
      <HubHeroSection stores={stores} />


      {/* ─── 2. 「わたしたちについて」セクション ─── */}
      <section id="about" className="relative overflow-hidden bg-white py-16 sm:py-24 border-t border-rose-100/60">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6 flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-1.5 text-xs font-bold text-rose-600 border border-rose-100">
              <Crown className="h-3.5 w-3.5 text-rose-500" />
              ABOUT STRAWBERRY BOYS わたしたちについて
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              安心できるから、<br />
              <span className="text-rose-500">ときめき</span>に素直になれる。
            </h3>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              仕事も、日常も、いつも頑張っているあなたへ。<br className="hidden sm:inline" />
              癒やされたい夜も、誰かに甘えたい夜も、ここでは、あなたの気持ちとペースを大切にします。<br />
              ストロベリーボーイズは、初めての方にも安心してご利用いただける女性専用の出張サービスです。
            </p>

            {/* 4つの安心カード */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 w-full max-w-3xl text-left">
              <div className="flex items-start gap-3.5 rounded-2xl bg-[#FAF6F3] p-4 sm:p-5 border border-rose-100/80 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 shadow-xs">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">全国主要エリアに対応</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">東京・横浜・名古屋・大阪・福岡など</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl bg-[#FAF6F3] p-4 sm:p-5 border border-rose-100/80 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 shadow-xs">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">分かりやすい料金体系</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">ご利用前に料金をご確認いただけます</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl bg-[#FAF6F3] p-4 sm:p-5 border border-rose-100/80 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 shadow-xs">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">プライバシーへの配慮</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">ご相談・ご利用内容を慎重に取り扱います</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl bg-[#FAF6F3] p-4 sm:p-5 border border-rose-100/80 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 shadow-xs">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">独自基準による採用</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">接客・清潔感・マナーを重視しています</p>
                </div>
              </div>
            </div>

            {/* ボタン2種 */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link
                href="/store/fukuoka/first-time"
                className="flex items-center justify-center gap-2 rounded-full bg-rose-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition w-full sm:w-auto"
              >
                <Sparkles className="h-4 w-4" />
                <span>初めての方へ</span>
                <ChevronRight className="h-4 w-4" />
              </Link>

              <a
                href="#faq"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-rose-500 underline underline-offset-4 transition py-2"
              >
                安心への取り組みを見る <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 1.4 全国から選ばれた人気者 (Marquee Version) ─── */}
      <section className="overflow-hidden bg-slate-50 py-24 [content-visibility:auto] [contain-intrinsic-size:500px]">
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

              const castStoreSlug = firstStore?.slug || cast.storeSlug || cast.store_slug || 'fukuoka';

              return (
                <div key={`${cast.id}-${i}`} className="inline-block w-48 shrink-0 text-center">
                  <Link href={`/store/${castStoreSlug}/cast/${cast.slug || cast.id}`}>
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
      <section className="bg-white px-6 py-24 [content-visibility:auto] [contain-intrinsic-size:500px]">
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
              ? diaries.slice(0, 6).map((diary, i) => {
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
      <section className="bg-white px-6 py-20 [content-visibility:auto] [contain-intrinsic-size:500px]">
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
                {((newsPages && newsPages.length > 0) ? newsPages : (diaries.length > 0 ? diaries.slice(0, 6) : [])).map((news: any, idx: number) => {
                  const title = news.title || '最新のおしらせ・トピックス';
                  const thumbnail = news.thumbnailUrl || news.thumbnail_url || news.images?.[0]?.image_url || FALLBACK_CAST_IMG;
                  const dateRaw = news.createdAt || news.created_at || news.publishedAt || news.published_at;
                  const dateStr = dateRaw
                    ? new Date(dateRaw).toLocaleDateString('ja-JP')
                    : new Date().toLocaleDateString('ja-JP');
                  const storeSlug = news.store_slug || news.storeSlug || (news.store_id === 'yokohama' ? 'yokohama' : 'fukuoka');
                  const newsHref = news.slug ? `/store/${storeSlug}/news/${news.slug}` : `/store/${storeSlug}/news`;

                  return (
                    <Link href={newsHref} key={news.id || idx} className="block group">
                      <motion.div
                        whileHover={{ y: -8 }}
                        className="overflow-hidden rounded-[1.2rem] bg-slate-50 p-1 md:rounded-[2.5rem] md:p-2"
                      >
                        <div className="relative aspect-video overflow-hidden rounded-[1rem] md:rounded-[2rem]">
                          <img
                            src={thumbnail}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={title}
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3 md:p-6">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-[8px] font-black uppercase tracking-widest text-rose-500 md:text-[10px]">
                              NEWS
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
                    </Link>
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



      {/* ─── 3.5 オウンドメディア連携（非表示化） ─── */}


      {/* ─── 4. Knowledge Hub ─── */}
      <section className="bg-slate-50 px-6 py-24 [content-visibility:auto] [contain-intrinsic-size:500px]">
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
              <Link key={article.title} href={article.href} className="block group">
                <motion.div
                  whileHover={{ y: -6 }}
                  className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm group-hover:shadow-md group-hover:border-rose-200 transition-all h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-6 text-4xl">{article.icon}</div>
                    <h3 className="mb-2 text-lg font-black text-slate-800 group-hover:text-rose-500 transition-colors">{article.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{article.desc}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 text-xs font-bold text-rose-500 flex items-center justify-between">
                    <span>詳しく読む</span>
                    <span>→</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4.4 明朗会計と料金目安 (Price & Trust Block) ─── */}
      <section className="bg-gradient-to-b from-white to-pink-50/50 px-6 py-24 [content-visibility:auto] [contain-intrinsic-size:500px]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <span className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-1.5 text-xs font-black text-rose-600 tracking-wider">
              CLEAR PRICING & TRUST
            </span>
            <h2 className="text-3xl font-black text-slate-900 md:text-5xl">
              明朗会計・安心の料金プラン
            </h2>
            <p className="mt-4 text-sm font-bold text-slate-500 max-w-2xl mx-auto leading-relaxed">
              ストロベリーボーイズは不当な追加請求や入会金・年会費等は一切発生いたしません。事前のコース料金と出張交通費のみの明確な料金体系です。
            </p>
          </div>

          {/* 3つのコース料金カード */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-16">
            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-lg hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                  お試しショート
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">60分コース</h3>
                <p className="text-xs text-slate-400 mb-6">初めての方や短時間で癒やされたい方に</p>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-rose-500">¥12,000</span>
                  <span className="text-sm font-bold text-slate-400">〜（税込）</span>
                </div>
              </div>
              <ul className="space-y-3 border-t border-slate-100 pt-6 text-xs font-bold text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-rose-500">✓</span> 初回お試しカウンセリング付き
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500">✓</span> 指名料・出張費別途明記
                </li>
              </ul>
            </div>

            <div className="rounded-[2.5rem] border-2 border-rose-400 bg-white p-8 shadow-2xl transition-all relative overflow-hidden flex flex-col justify-between transform md:-translate-y-2">
              <div className="absolute top-0 right-0 rounded-bl-2xl bg-rose-500 px-4 py-1 text-[10px] font-black text-white uppercase tracking-wider">
                1番人気コース
              </div>
              <div>
                <div className="mb-4 inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-600">
                  人気No.1 標準プラン
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">90分コース</h3>
                <p className="text-xs text-slate-400 mb-6">じっくり全身の施術と会話を満喫</p>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-rose-500">¥18,000</span>
                  <span className="text-sm font-bold text-slate-400">〜（税込）</span>
                </div>
              </div>
              <ul className="space-y-3 border-t border-slate-100 pt-6 text-xs font-bold text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-rose-500">✓</span> 人気No.1の贅沢満足コース
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500">✓</span> フルボディオイルトリートメント
                </li>
              </ul>
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-lg hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                  極上ディープ
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">120分コース</h3>
                <p className="text-xs text-slate-400 mb-6">時間を忘れて最高峰の癒やしを体験</p>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-rose-500">¥24,000</span>
                  <span className="text-sm font-bold text-slate-400">〜（税込）</span>
                </div>
              </div>
              <ul className="space-y-3 border-t border-slate-100 pt-6 text-xs font-bold text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-rose-500">✓</span> 心身をリセットする特別コース
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500">✓</span> お好みのご要望に合わせた施術
                </li>
              </ul>
            </div>
          </div>

          {/* 信頼バッジ ＆ 料金ページへの導線 */}
          <div className="rounded-3xl bg-white border border-rose-100 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-6 text-center md:text-left">
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-rose-500 shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-slate-800">入会金・年会費 0円</h4>
                  <p className="text-xs text-slate-400">不要な費用は一切かかりません</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calculator className="h-6 w-6 text-rose-500 shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-slate-800">事前見積もり徹底</h4>
                  <p className="text-xs text-slate-400">予約時に確定金額をご案内</p>
                </div>
              </div>
            </div>
            <Link
              href="/plan"
              className="shrink-0 rounded-full bg-rose-500 px-8 py-4 text-xs font-black text-white transition-all hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 flex items-center gap-2"
            >
              <span>料金・プランの完全解説をみる</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 4.5 出張対応エリアから探す (SEO & Area LP Hub) ─── */}
      <section className="bg-slate-900 px-6 py-24 text-white [content-visibility:auto] [contain-intrinsic-size:500px]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.3em] text-rose-400">
                SEARCH BY AREA
              </span>
              <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                出張対応エリアから探す
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-slate-400 md:text-sm">
              博多・天神・中洲・薬院・関内・みなとみらい・桜木町など主要エリアの指定ホテルやご自宅へセラピストが出張いたします。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* 福岡エリア */}
            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 font-black text-sm">
                  博多
                </span>
                <div>
                  <h3 className="text-xl font-black text-white">福岡エリア</h3>
                  <p className="text-xs text-slate-400">博多駅周辺・天神・大名・中洲川端・薬院</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {TARGET_AREAS.filter((a) => a.slug === 'fukuoka').map((area) => (
                  <Link
                    key={area.areaSlug}
                    href={`/store/fukuoka/area/${area.areaSlug}`}
                    className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-xs font-black text-white transition-all hover:border-rose-400 hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-500/30 md:text-sm"
                  >
                    <MapPin className="h-4 w-4 text-rose-400 group-hover:text-white" />
                    <span>{area.name}エリアガイド</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                  </Link>
                ))}
              </div>
            </div>

            {/* 横浜エリア */}
            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 font-black text-sm">
                  横浜
                </span>
                <div>
                  <h3 className="text-xl font-black text-white">横浜エリア</h3>
                  <p className="text-xs text-slate-400">関内・伊勢佐木町・みなとみらい・桜木町・野毛</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {TARGET_AREAS.filter((a) => a.slug === 'yokohama').map((area) => (
                  <Link
                    key={area.areaSlug}
                    href={`/store/yokohama/area/${area.areaSlug}`}
                    className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-xs font-black text-white transition-all hover:border-rose-400 hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-500/30 md:text-sm"
                  >
                    <MapPin className="h-4 w-4 text-rose-400 group-hover:text-white" />
                    <span>{area.name}エリアガイド</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. FAQ ─── */}
      <section className="bg-white px-6 py-24 [content-visibility:auto] [contain-intrinsic-size:500px]">
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
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-5">
          <div className="col-span-2">
            <div className="mb-6 font-serif text-3xl font-black text-rose-500">
              PLATFORM<span className="text-slate-900">.HUB</span>
            </div>
            <p className="max-w-sm leading-loose text-slate-400">
              女性専用の出張リラクゼーション・ウェルネスサロン「ストロベリーボーイズ」。福岡・横浜の各指定ホテルやご自宅へ厳選セラピストを出張派遣いたします。
            </p>
          </div>
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-slate-300">
              SERVICES
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="/store/fukuoka" className="hover:text-rose-500 transition-colors">福岡店（博多・天神）</Link></li>
              <li><Link href="/store/yokohama" className="hover:text-rose-500 transition-colors">横浜店（関内・桜木町）</Link></li>
              <li><Link href="/guide" className="hover:text-rose-500 transition-colors">初めての方へ</Link></li>
              <li><Link href="/plan" className="hover:text-rose-500 transition-colors">料金・プラン解説</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-slate-300">
              AREA GUIDE
            </h4>
            <ul className="space-y-3 text-xs font-bold text-slate-500">
              {TARGET_AREAS.map((area) => (
                <li key={area.areaSlug}>
                  <Link
                    href={`/store/${area.slug}/area/${area.areaSlug}`}
                    className="hover:text-rose-500 transition-colors"
                  >
                    {area.cityName}・{area.name}エリアガイド
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-slate-300">
              SUPPORT
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="/guide/cast-select" className="hover:text-rose-500 transition-colors">キャストの選び方</Link></li>
              <li><Link href="/guide/nomination" className="hover:text-rose-500 transition-colors">指名のご案内</Link></li>
              <li><Link href="/store/fukuoka/contact" className="hover:text-rose-500 transition-colors">お問い合わせ</Link></li>
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
