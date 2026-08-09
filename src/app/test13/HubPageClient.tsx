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

import { useEffect, useState, useMemo } from 'react';
import { AREA_MAP, TARGET_AREAS } from '@/lib/area-data';
import { getOptimizedImageUrl } from '@/lib/image-url';

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
      '時間制の明確な料金システムです。表示価格以外の追加料金等は一切発生いたしません。なお、お支払いは現在【現金払い】のみ対応となっております。（クレジットカード・電子マネーはご利用いただけませんので予めご了承ください）',
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
  reviewCount?: number;
  featuredCasts?: any[];
  storePrices?: Record<string, { minutes: number; price: number }[]>;
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
  reviewCount,
  featuredCasts = [],
  storePrices,
  mediaArticles,
}: HubPageClientProps) {
  // 実データが10件以上あるときだけ表示（0件・取得失敗時は非表示。偽の固定値は使わない）
  const showReviewCount = typeof reviewCount === 'number' && reviewCount >= 10;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'news' | 'video'>('news');
  const [priceTab, setPriceTab] = useState<'fukuoka' | 'yokohama'>('fukuoka');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredCasts = casts.filter(
    (c) =>
      !searchQuery ||
      c.name?.includes(searchQuery) ||
      c.catchCopy?.includes(searchQuery) ||
      c.profile?.includes(searchQuery),
  );

  // 自社店舗（fukuoka, yokohama）に所属するキャストのみ抽出し、外部店舗および所属不明キャストを除外 (STEP 2)
  const validCasts = useMemo(() => {
    return casts.filter((c: any) => {
      const firstStore = c.stores?.[0] || c.store;
      const storeSlug = firstStore?.slug || c.storeSlug || c.store_slug;

      // 所属店舗が特定できない場合は除外（fukuokaフォールバック全廃）
      if (!storeSlug) return false;

      // 外部店舗 (use_external_url = true, tokyo, osaka, nagoya 等) のキャストは除外
      if (firstStore?.use_external_url || ['tokyo', 'osaka', 'nagoya'].includes(storeSlug)) {
        return false;
      }

      // 画像未設定のキャストは除外。
      // 除外しないとフォールバック画像(FALLBACK_CAST_IMG = 実在セラピストの写真)が
      // 割り当てられ、別人の写真が表示されてしまうため。
      if (!c.imageUrl && !c.mainImageUrl) return false;

      // fukuoka または yokohama の自社店舗所属キャストのみ合格
      return storeSlug === 'fukuoka' || storeSlug === 'yokohama';
    });
  }, [casts]);

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
      <HubHeroSection stores={stores} casts={casts} />

      {/* ─── 1.05 信頼バッジ帯 (Since 2018・実績訴求 / SSR静的表示) ─── */}
      <section aria-label="ストロベリーボーイズの信頼と実績" className="bg-white border-b border-rose-100/60 py-4">
        <div className="mx-auto max-w-5xl px-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {showReviewCount && (
            <span className="inline-flex items-center rounded-full bg-rose-50 border border-rose-100 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-rose-600">お客様の口コミ {reviewCount!.toLocaleString()}件</span>
          )}
          <span className="inline-flex items-center rounded-full bg-rose-50 border border-rose-100 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-rose-600">Since 2018・グループ運営8年</span>
          <span className="inline-flex items-center rounded-full bg-rose-50 border border-rose-100 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-rose-600">完全審査制セラピスト</span>
          <span className="inline-flex items-center rounded-full bg-rose-50 border border-rose-100 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-rose-600">明朗会計・追加料金なし</span>
          <span className="inline-flex items-center rounded-full bg-rose-50 border border-rose-100 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-rose-600">完全予約制・秘密厳守</span>
        </div>
      </section>


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
              ストロベリーボーイズは、初めての方にも安心してご利用いただける女性専用の出張サービスです。<br />
              2018年の創業以来、グループとして8年にわたり女性専用サービス一筋で運営してまいりました。積み重ねてきた信頼と経験が、わたしたちの誇りです。
              {showReviewCount && (
                <>
                  <br />
                  これまでに{reviewCount!.toLocaleString()}件のお客様の声をいただいています。
                </>
              )}
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

      {/* ─── 1.4 全国から選ばれた人気者 (手動選定 ＆ 自社・外部連携) ─── */}
      {(() => {
        // 🚀 DB上の実在アクティブキャスト（福岡店・横浜店等）のみを厳密抽出
        const filteredFeatured = (featuredCasts || []).filter((fc: any) => {
          const slug = fc.store_slug || fc.storeSlug;
          return slug === 'fukuoka' || slug === 'yokohama' || (fc.store_name && !fc.is_external && !['osaka', 'nagoya'].includes(slug));
        });

        const displayCasts = filteredFeatured.length > 0
          ? filteredFeatured
          : validCasts.map(c => ({
              id: c.id,
              name: c.name,
              store_name: c.stores?.[0]?.name || (c.storeSlug === 'yokohama' ? '横浜店' : '福岡店'),
              store_slug: c.storeSlug || c.store_slug || 'fukuoka',
              catch_copy: c.catchCopy || c.catch_copy || 'THERAPIST',
              image_url: c.imageUrl || c.mainImageUrl || '/ゆうと.png',
              link_url: `/store/${c.storeSlug || 'fukuoka'}/cast/${c.slug || c.id}`,
              is_external: false,
            }));

        if (!displayCasts || displayCasts.length === 0) return null;

        // display_order の順序をそのまま尊重
        const sortedCasts = [...displayCasts];

        // キャスト数が十分にある場合はそのまま、少ない場合のみ無限ループ用にダブらせる
        const marqueeCasts = sortedCasts.length >= 8 ? sortedCasts : [...sortedCasts, ...sortedCasts];

        return (
          <section className="overflow-hidden bg-slate-50 py-24 [content-visibility:auto] [contain-intrinsic-size:500px]">
            <div className="mx-auto max-w-7xl px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-600 mb-3">
                  ✨ 全国の人気セラピストをピックアップ
                </div>
                <h2 className="mb-4 text-3xl font-black tracking-tighter text-slate-900 md:text-5xl">
                  全国の<span className="text-rose-500">人気セラピスト</span>たち
                </h2>
                <div className="mx-auto mb-4 h-1 w-24 rounded-full bg-rose-500" />
                <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
                  NATIONAL POPULAR THERAPISTS
                </p>
              </motion.div>
            </div>

            {/* 自動無限スクロール (Marquee) */}
            <div className="relative mt-4 flex overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:from-slate-50 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:from-slate-50 after:to-transparent">
              <div className="animate-scroll-text flex cursor-pointer space-x-8 whitespace-nowrap py-6 hover:[animation-play-state:paused]">
                {marqueeCasts.map((cast: any, i: number) => {
                  const isExt = Boolean(cast.is_external || ['tokyo', 'osaka', 'nagoya'].includes(cast.store_slug));
                  const storeName = cast.store_name || (cast.store_slug === 'yokohama' ? '横浜店' : cast.store_slug === 'fukuoka' ? '福岡店' : 'グループ店');
                  const altText = `${cast.name}(${storeName})`;

                  const CardInner = (
                    <div className="group">
                      <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full border-4 border-solid border-rose-300 bg-white p-1.5 shadow-xl transition-all duration-500 group-hover:scale-105 md:h-48 md:w-48">
                        <div className="h-full w-full overflow-hidden rounded-full ring-2 ring-slate-50">
                          <img
                            src={cast.image_url}
                            alt={altText}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>
                      <div className="px-2 text-center">
                        <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                          {isExt && <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />}
                          <span>{storeName}</span>
                        </div>
                        <h3 className="text-lg font-black tracking-tight text-slate-800 transition-colors group-hover:text-rose-500">
                          {cast.name}
                        </h3>
                        <p className="mt-0.5 truncate text-[10px] font-bold text-rose-400 opacity-90 max-w-[160px] mx-auto">
                          {cast.catch_copy || 'セラピスト'}
                        </p>
                      </div>
                    </div>
                  );

                  return (
                    <div key={`${cast.id || cast.name}-${i}`} className="inline-block w-44 shrink-0 text-center">
                      {isExt ? (
                        <a href={cast.link_url} target="_blank" rel="noopener noreferrer" className="block">
                          {CardInner}
                        </a>
                      ) : (
                        <Link href={cast.link_url} className="block">
                          {CardInner}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

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

          {/* 横スクロールカード (最大4件) */}
          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 md:gap-8">
            {diaries.length > 0
              ? diaries.slice(0, 4).map((diary, i) => {
                  const rawThumbnail = diary.images?.[0]?.image_url || FALLBACK_CAST_IMG;
                  const thumbnail = getOptimizedImageUrl(rawThumbnail, 'thumb') || rawThumbnail;
                  const rawCast = (diary as any).casts || (diary as any).cast;
                  const castData = Array.isArray(rawCast) ? rawCast[0] : rawCast;
                  const rawCastImg =
                    castData?.main_image_url || castData?.image_url || FALLBACK_CAST_IMG;
                  const castImg = getOptimizedImageUrl(rawCastImg, 'icon') || rawCastImg;
                  const castName = castData?.name || 'THERAPIST';
                  const storeSlug = (diary as any).store_slug || (diary as any).storeSlug || (castData as any)?.store_slug || 'fukuoka';
                  const diaryHref = `/store/${storeSlug}/diary/post/${diary.id}`;

                  return (
                    <Link key={diary.id} href={diaryHref} className="block group shrink-0 snap-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.1 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative w-[35vw] cursor-pointer md:w-auto md:min-w-[320px] md:max-w-[320px]"
                      >
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-slate-100 shadow-2xl transition-all duration-700 group-hover:-translate-y-2 group-hover:shadow-rose-500/20 md:rounded-[2.5rem]">
                          {/* メインの写メ画像 */}
                          <img
                            src={thumbnail}
                            alt={diary.title}
                            loading="lazy"
                            decoding="async"
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
                                  loading="lazy"
                                  decoding="async"
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
                    </Link>
                  );
                })
              : [1, 2, 3, 4].map((i) => (
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

          {/* 📍 店舗別写メ日記誘導リンクボタン帯 */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 mb-3 text-center sm:text-left">
              各店舗の最新写メ日記はこちらから
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <Link
                href="/store/fukuoka/diary"
                className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-rose-600 hover:bg-rose-100 transition shadow-xs"
              >
                福岡店の写メ日記一覧 →
              </Link>
              <Link
                href="/store/yokohama/diary"
                className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-rose-600 hover:bg-rose-100 transition shadow-xs"
              >
                横浜店の写メ日記一覧 →
              </Link>
              <a
                href="https://sutoroberrys.com/main/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100 transition shadow-xs"
              >
                東京店 外部サイト ↗
              </a>
              <a
                href="https://sutoroberrys-osaka.com/main.html"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100 transition shadow-xs"
              >
                大阪店 外部サイト ↗
              </a>
              <a
                href="https://sutoroberrys-aichi.com/main.html"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100 transition shadow-xs"
              >
                名古屋店 外部サイト ↗
              </a>
            </div>
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
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                  {((newsPages && newsPages.length > 0) ? newsPages.slice(0, 4) : (diaries.length > 0 ? diaries.slice(0, 4) : [])).map((news: any, idx: number) => {
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
                          whileHover={{ y: -6 }}
                          className="overflow-hidden rounded-[1.2rem] bg-slate-50 p-1 md:rounded-[2rem] md:p-2"
                        >
                          <div className="relative aspect-video overflow-hidden rounded-[1rem] md:rounded-[1.5rem]">
                            <img
                              src={thumbnail}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              alt={title}
                              loading="lazy"
                            />
                          </div>
                          <div className="p-3 md:p-4">
                            <div className="mb-1.5 flex items-center gap-2">
                              <span className="text-[8px] font-black uppercase tracking-widest text-rose-500 md:text-[10px]">
                                NEWS
                              </span>
                              <span className="text-[8px] font-bold text-slate-400 md:text-[10px]">
                                {dateStr}
                              </span>
                            </div>
                            <h3 className="line-clamp-2 text-xs font-black text-slate-800 transition-colors group-hover:text-rose-500 md:text-base">
                              {title}
                            </h3>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>

                {/* 📍 店舗別ニュース誘導リンクボタン帯 */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 mb-3 text-center sm:text-left">
                    各店舗の最新ニュース・お知らせはこちらから
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    <Link
                      href="/store/fukuoka/news"
                      className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-rose-600 hover:bg-rose-100 transition shadow-xs"
                    >
                      福岡店のニュース一覧 →
                    </Link>
                    <Link
                      href="/store/yokohama/news"
                      className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-rose-600 hover:bg-rose-100 transition shadow-xs"
                    >
                      横浜店のニュース一覧 →
                    </Link>
                    <a
                      href="https://sutoroberrys.com/main/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100 transition shadow-xs"
                    >
                      東京店 外部サイト ↗
                    </a>
                    <a
                      href="https://sutoroberrys-osaka.com/main.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100 transition shadow-xs"
                    >
                      大阪店 外部サイト ↗
                    </a>
                    <a
                      href="https://sutoroberrys-aichi.com/main.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100 transition shadow-xs"
                    >
                      名古屋店 外部サイト ↗
                    </a>
                  </div>
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

      {/* ─── 4.4 明朗会計と料金目安 (Price & Trust Block - SSR全埋め込みタブ) ─── */}
      <section className="bg-gradient-to-b from-white to-pink-50/50 px-6 py-24 [content-visibility:auto] [contain-intrinsic-size:500px]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-1.5 text-xs font-black text-rose-600 tracking-wider">
              CLEAR PRICING & TRUST
            </span>
            <h2 className="text-3xl font-black text-slate-900 md:text-5xl">
              明朗会計・安心の料金プラン
            </h2>
            <p className="mt-4 text-sm font-bold text-slate-500 max-w-2xl mx-auto leading-relaxed">
              ストロベリーボーイズは不当な追加請求や入会金・年会費等は一切発生いたしません。事前のコース料金と出張交通費のみの明確な料金体系です。
            </p>

            {/* 店舗切替タブ (福岡店 / 横浜店) */}
            <div className="mt-8 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setPriceTab('fukuoka')}
                className={`rounded-full px-6 py-2.5 text-xs sm:text-sm font-black transition-all ${
                  priceTab === 'fukuoka'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-rose-50'
                }`}
              >
                福岡店の料金プラン
              </button>
              <button
                type="button"
                onClick={() => setPriceTab('yokohama')}
                className={`rounded-full px-6 py-2.5 text-xs sm:text-sm font-black transition-all ${
                  priceTab === 'yokohama'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-rose-50'
                }`}
              >
                横浜店の料金プラン
              </button>
            </div>
          </div>

          {/* 福岡店 料金カード (SSRテキスト埋め込み) */}
          <div className={`${priceTab === 'fukuoka' ? 'block' : 'hidden'}`}>
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-slate-500">【ストロベリーボーイズ福岡店 基本コース価格】</span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
              <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <div className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">お試しショート</div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">60分コース</h3>
                  <p className="text-xs text-slate-400 mb-6">初めての方や短時間で癒やされたい方に</p>
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-rose-500">¥{(storePrices?.fukuoka?.[0]?.price || 12000).toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-400">〜（税込）</span>
                  </div>
                </div>
                <ul className="space-y-2.5 border-t border-slate-100 pt-6 text-xs font-bold text-slate-600">
                  <li className="flex items-center gap-2"><span className="text-rose-500">✓</span> 初回お試しカウンセリング付き</li>
                  <li className="flex items-center gap-2"><span className="text-rose-500">✓</span> 福岡市内・博多・天神エリア対応</li>
                </ul>
              </div>

              <div className="rounded-[2.5rem] border-2 border-rose-400 bg-white p-8 shadow-2xl transition-all flex flex-col justify-between transform md:-translate-y-2">
                <div>
                  <div className="mb-4 inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-600">人気No.1 標準プラン</div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">90分コース</h3>
                  <p className="text-xs text-slate-400 mb-6">じっくり全身の施術と会話を満喫</p>
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-rose-500">¥{(storePrices?.fukuoka?.[1]?.price || 16000).toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-400">〜（税込）</span>
                  </div>
                </div>
                <ul className="space-y-2.5 border-t border-slate-100 pt-6 text-xs font-bold text-slate-600">
                  <li className="flex items-center gap-2"><span className="text-rose-500">✓</span> 人気No.1の満足コース</li>
                  <li className="flex items-center gap-2"><span className="text-rose-500">✓</span> フルボディオイルトリートメント</li>
                </ul>
              </div>

              <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <div className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">極上ディープ</div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">120分コース</h3>
                  <p className="text-xs text-slate-400 mb-6">時間を忘れて最高峰の癒やしを体験</p>
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-rose-500">¥{(storePrices?.fukuoka?.[2]?.price || 20000).toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-400">〜（税込）</span>
                  </div>
                </div>
                <ul className="space-y-2.5 border-t border-slate-100 pt-6 text-xs font-bold text-slate-600">
                  <li className="flex items-center gap-2"><span className="text-rose-500">✓</span> 特別な夜のためのロングコース</li>
                  <li className="flex items-center gap-2"><span className="text-rose-500">✓</span> ご要望に応じたオーダーメイド施術</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/store/fukuoka/price"
                className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg hover:bg-rose-600 transition"
              >
                <span>福岡店の詳細料金表（オプション・交通費）を見る</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* 横浜店 料金カード (SSRテキスト埋め込み) */}
          <div className={`${priceTab === 'yokohama' ? 'block' : 'hidden'}`}>
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-slate-500">【ストロベリーボーイズ横浜店 基本コース価格】</span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
              <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <div className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">お試しショート</div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">60分コース</h3>
                  <p className="text-xs text-slate-400 mb-6">初めての方や短時間で癒やされたい方に</p>
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-rose-500">¥{(storePrices?.yokohama?.[0]?.price || 12000).toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-400">〜（税込）</span>
                  </div>
                </div>
                <ul className="space-y-2.5 border-t border-slate-100 pt-6 text-xs font-bold text-slate-600">
                  <li className="flex items-center gap-2"><span className="text-rose-500">✓</span> 初回お試しカウンセリング付き</li>
                  <li className="flex items-center gap-2"><span className="text-rose-500">✓</span> 横浜・関内・みなとみらいエリア対応</li>
                </ul>
              </div>

              <div className="rounded-[2.5rem] border-2 border-rose-400 bg-white p-8 shadow-2xl transition-all flex flex-col justify-between transform md:-translate-y-2">
                <div>
                  <div className="mb-4 inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-600">人気No.1 標準プラン</div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">90分コース</h3>
                  <p className="text-xs text-slate-400 mb-6">じっくり全身の施術と会話を満喫</p>
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-rose-500">¥{(storePrices?.yokohama?.[1]?.price || 16000).toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-400">〜（税込）</span>
                  </div>
                </div>
                <ul className="space-y-2.5 border-t border-slate-100 pt-6 text-xs font-bold text-slate-600">
                  <li className="flex items-center gap-2"><span className="text-rose-500">✓</span> 人気No.1の満足コース</li>
                  <li className="flex items-center gap-2"><span className="text-rose-500">✓</span> フルボディオイルトリートメント</li>
                </ul>
              </div>

              <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <div className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">極上ディープ</div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">120分コース</h3>
                  <p className="text-xs text-slate-400 mb-6">時間を忘れて最高峰の癒やしを体験</p>
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-rose-500">¥{(storePrices?.yokohama?.[2]?.price || 20000).toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-400">〜（税込）</span>
                  </div>
                </div>
                <ul className="space-y-2.5 border-t border-slate-100 pt-6 text-xs font-bold text-slate-600">
                  <li className="flex items-center gap-2"><span className="text-rose-500">✓</span> 特別な夜のためのロングコース</li>
                  <li className="flex items-center gap-2"><span className="text-rose-500">✓</span> ご要望に応じたオーダーメイド施術</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/store/yokohama/price"
                className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg hover:bg-rose-600 transition"
              >
                <span>横浜店の詳細料金表（オプション・交通費）を見る</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* 外部系列店舗の案内リンク行 */}
          <div className="mt-12 text-center text-xs font-bold text-slate-500 border-t border-rose-100/60 pt-6">
            <span>※東京・大阪・名古屋など系列他店舗の料金につきましては、各店舗の公式サイトをご確認ください:</span>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <a href="https://sutoroberrys.com/main/" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline">
                東京店 料金 ↗
              </a>
              <a href="https://sutoroberrys-osaka.com/main.html" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline">
                大阪店 料金 ↗
              </a>
              <a href="https://sutoroberrys-aichi.com/main.html" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline">
                名古屋店 料金 ↗
              </a>
            </div>
          </div>
          {/* 信頼バッジ ＆ 料金ページへの導線 */}
          <div className="mt-12 rounded-3xl bg-white border border-rose-100 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
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
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/store/fukuoka/price"
                className="rounded-full bg-rose-500 px-6 py-3.5 text-xs font-black text-white transition-all hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 flex items-center gap-1.5"
              >
                <span>福岡店の料金表を見る</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/store/yokohama/price"
                className="rounded-full bg-slate-800 px-6 py-3.5 text-xs font-black text-white transition-all hover:bg-slate-900 hover:shadow-lg flex items-center gap-1.5"
              >
                <span>横浜店の料金表を見る</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
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
