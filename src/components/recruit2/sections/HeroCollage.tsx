import React, { useEffect, useState } from 'react';

// Define AnimationState locally for this component
enum AnimationState {
  IDLE = 'IDLE',
  ASSEMBLED = 'ASSEMBLED',
}

interface HeroCollageProps {
  onOpenChat: () => void;
}

// ==========================================
// 【設定】テキストの重なり具合の調整
// ==========================================
// マイナスの数値を大きくすると（例: -10vh → -15vh）、
// テキストがより上に（画像に重なるように）移動します。
const LAYOUT_CONFIG = {
  // スマホ用（画像高さ50vhに対する重なり）
  // 例: -7.5vh = 15%の重なり
  MOBILE_OVERLAP: '-3.5vh',

  // PC用（画像高さ65vhに対する重なり）
  // 例: -9.75vh = 15%の重なり
  DESKTOP_OVERLAP: '-2.75vh',
};

const HeroCollage: React.FC<HeroCollageProps> = ({ onOpenChat }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.IDLE);
  const [loaded, setLoaded] = useState(false);
  const imageUrl = '/バナーデザインLP用.png';

  useEffect(() => {
    // Target date: February 1st
    const now = new Date();
    const currentYear = now.getFullYear();
    // If current date is after Feb 1st, target next year's Feb 1st
    // Note: Month is 0-indexed (1 is Feb)
    let targetYear = currentYear;
    const testDate = new Date(currentYear, 1, 1);
    if (now > testDate) {
      targetYear = currentYear + 1;
    }

    // Set target to Feb 1st 00:00:00
    const targetDate = new Date(targetYear, 1, 1);

    const updateTimer = () => {
      const currentTime = new Date();
      const difference = targetDate.getTime() - currentTime.getTime();

      if (difference > 0) {
        setTimeLeft(Math.floor(difference / 1000));
      } else {
        setTimeLeft(0);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger animation after mount/load
  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setLoaded(true);
      // Small delay before starting animation
      setTimeout(() => setAnimationState(AnimationState.ASSEMBLED), 500);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}日 ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isAssembled = animationState === AnimationState.ASSEMBLED;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 画像の分割位置（クリップパス）の設定
  const desktopClips = {
    left: 'polygon(0 0, 32% 0, 19% 100%, 0 100%)',
    middle: 'polygon(32% 0, 66% 0, 53% 100%, 19% 100%)',
    right: 'polygon(66% 0, 100% 0, 100% 100%, 53% 100%)',
  };

  const mobileClips = {
    left: 'polygon(0 0, 32% 0, 19% 100%, 0 100%)',
    middle: 'polygon(32% 0, 66% 0, 53% 100%, 19% 100%)',
    right: 'polygon(66% 0, 100% 0, 100% 100%, 53% 100%)',
  };

  const clips = isMobile ? mobileClips : desktopClips;
  const duration = '2000ms';
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const shardBaseClass = 'absolute inset-0 transition-all';

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-slate-950 pt-20 font-sans md:pt-0">
      {/* Background/Collage Area - Top 60% */}
      <div className="relative h-[50vh] w-full overflow-hidden md:h-[65vh]">
        {/* Animated Split Image Container */}
        {loaded ? (
          <div className="relative h-full w-full">
            {/* Shard 1 (Left) */}
            <div
              className={`${shardBaseClass} ${
                isAssembled
                  ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
                  : '-translate-x-full -translate-y-1/4 scale-110 opacity-0'
              }`}
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
                clipPath: clips.left,
                zIndex: 10,
                transitionDuration: duration,
                transitionTimingFunction: ease,
              }}
            />

            {/* Shard 2 (Middle) */}
            <div
              className={`${shardBaseClass} ${
                isAssembled
                  ? 'translate-y-0 scale-100 opacity-100'
                  : 'translate-y-full scale-95 opacity-0'
              }`}
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
                clipPath: clips.middle,
                zIndex: 20,
                transitionDuration: duration,
                transitionTimingFunction: ease,
              }}
            />

            {/* Shard 3 (Right) */}
            <div
              className={`${shardBaseClass} ${
                isAssembled
                  ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
                  : '-translate-y-1/4 translate-x-full scale-110 opacity-0'
              }`}
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
                clipPath: clips.right,
                zIndex: 10,
                transitionDuration: duration,
                transitionTimingFunction: ease,
              }}
            />

            {/* Subtle separator lines when assembled */}
            {isAssembled && (
              <div className="pointer-events-none absolute inset-0 opacity-20 transition-opacity delay-1000 duration-1000">
                <div className="absolute left-[37.5%] top-0 h-full w-[2px] -translate-x-1/2 rotate-[8deg] bg-white/50 blur-[1px]" />
                <div className="absolute left-[67.5%] top-0 h-full w-[2px] -translate-x-1/2 rotate-[8deg] bg-white/50 blur-[1px]" />
              </div>
            )}
          </div>
        ) : (
          <div className="h-full w-full animate-pulse bg-slate-900" />
        )}

        {/* Gradient Overlay */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/90"
          style={{ zIndex: 30 }}
        ></div>
      </div>

      {/* Text Content Area */}
      <div
        className="relative z-40 mt-[var(--mobile-margin)] flex flex-1 flex-col items-center justify-start px-4 pb-12 md:mt-[var(--desktop-margin)]"
        style={
          {
            '--mobile-margin': LAYOUT_CONFIG.MOBILE_OVERLAP,
            '--desktop-margin': LAYOUT_CONFIG.DESKTOP_OVERLAP,
          } as React.CSSProperties
        }
      >
        {/* Main Heading */}
        <h1 className="animate-fade-in-up mb-6 text-center font-serif text-3xl font-bold leading-[1.2] tracking-tight text-white drop-shadow-2xl delay-100 sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl">
          ただ<span className="text-amber-500">「稼ぐ場所」</span>ではなく
          <br className="hidden sm:block" />
          <span className="italic text-white underline decoration-amber-500 decoration-2 underline-offset-4">
            “価値ある男”
          </span>
          に
          <br className="sm:hidden" />
          としてゼロから稼げる場所。
        </h1>

        {/* Subtext */}
        <p className="animate-fade-in-up mx-auto mb-10 max-w-3xl px-2 text-center text-base leading-relaxed text-slate-300 delay-200 sm:text-xl md:text-2xl">
          今日からでも、人生は変えられる。
          <br className="hidden sm:block" />
          数多くの未経験者をプロに導いた、創業8年の信頼と実績。
        </p>

        {/* Stats Grid */}
        <div className="animate-fade-in-up mx-auto mb-10 grid max-w-5xl grid-cols-2 gap-4 delay-200 sm:gap-6 md:grid-cols-3">
          {[
            { label: '割引', val: '全て店舗負担' },
            { label: '勤務時間', val: '自由出勤' },
            { label: 'お酒/ノルマ', val: '一切なし' },
            { label: '全額日払い', val: '当日OK' },
            { label: '副業・兼業', val: '大歓迎' },
            { label: '移籍・掛け持ちOK', val: '経験者優遇' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 backdrop-blur-md sm:p-6"
            >
              <div className="mb-2 text-xs text-slate-400 sm:text-sm">{item.label}</div>
              <div className="whitespace-nowrap text-xl font-bold text-amber-500 sm:text-2xl md:text-3xl">
                {item.val}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up flex flex-col items-center justify-center gap-4 delay-300 sm:flex-row">
          <button
            onClick={onOpenChat}
            className="group relative w-full overflow-hidden rounded-2xl bg-amber-600 px-8 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(217,119,6,0.3)] transition-all hover:scale-105 active:scale-95 sm:w-auto sm:px-10 sm:py-5 sm:text-xl"
          >
            <span className="relative z-10">今すぐ人生を変える応募</span>
            <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/20 to-transparent duration-1000 ease-in-out group-hover:translate-x-full"></div>
          </button>
          <a
            href="#qa"
            className="w-full rounded-2xl bg-slate-800/80 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-slate-700 active:scale-95 sm:w-auto sm:px-10 sm:py-5 sm:text-xl"
          >
            Q&Aを先に見る
          </a>
        </div>

        {/* Open Cast Recruitment Heading Image */}
        <div className="animate-fade-in-up delay-250 mt-10 flex w-full max-w-5xl flex-col items-center px-4">
          <div className="w-full overflow-hidden rounded-2xl border border-amber-500/30 shadow-2xl">
            <img
              src="/オープンキャスト募集.png"
              alt="オープンキャスト募集 - 10名限定超好待遇"
              className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* Premium Recruitment Section - Luxury Design */}
        <div className="animate-fade-in-up mt-8 flex w-full max-w-5xl flex-col items-center px-4 delay-300">
          {/* Main Card Container */}
          <div className="relative w-full overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 p-1 shadow-2xl">
            {/* Gold accent corners */}
            <div className="absolute left-0 top-0 h-20 w-20 border-l-2 border-t-2 border-amber-400/40"></div>
            <div className="absolute right-0 top-0 h-20 w-20 border-r-2 border-t-2 border-amber-400/40"></div>
            <div className="absolute bottom-0 left-0 h-20 w-20 border-b-2 border-l-2 border-amber-400/40"></div>
            <div className="absolute bottom-0 right-0 h-20 w-20 border-b-2 border-r-2 border-amber-400/40"></div>

            {/* Inner content */}
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/95 via-indigo-950/80 to-slate-900/95 p-8 backdrop-blur-xl sm:p-12">
              {/* Limited Slots Indicator */}
              <div className="mb-8 flex items-center justify-center gap-4">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/50 sm:w-12"></div>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                  <p className="text-center text-lg font-medium text-amber-200 sm:text-2xl">
                    超好待遇残り{' '}
                    <span className="mx-1 text-4xl font-bold text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] sm:text-6xl">
                      4
                    </span>{' '}
                    名様限定
                  </p>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                </div>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/50 sm:w-12"></div>
              </div>

              {/* Timer Section */}
              <div className="mb-10">
                <div className="mb-4 text-center">
                  <p className="mb-2 text-base font-bold tracking-widest text-amber-100 sm:text-lg">
                    2月1日 グランドオープンまで
                  </p>
                  <div className="mx-auto mb-2 h-px w-24 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
                </div>

                {/* Timer Display */}
                <div className="relative mx-auto max-w-3xl">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400/20 via-indigo-400/20 to-amber-400/20 blur-xl"></div>
                  <div className="relative rounded-2xl border border-amber-400/30 bg-gradient-to-br from-indigo-950/60 to-slate-900/60 px-4 py-8 backdrop-blur-sm sm:px-12 sm:py-10">
                    <div className="mb-2 text-center font-mono text-4xl font-bold tabular-nums tracking-tight text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)] sm:text-6xl md:text-7xl">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-sm font-medium text-indigo-200 sm:text-base">
                        2月1日 23:59までにエントリーされた方のみ
                      </p>
                      <p className="text-sm font-medium text-indigo-200 sm:text-base">
                        オープンキャスト枠として選考対象となります
                      </p>
                      <p className="mt-3 text-xs text-slate-400 sm:text-sm">
                        育成体制の都合上、今回の採用は10名様までとさせていただいております
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="mb-10">
                <h3 className="mb-6 whitespace-nowrap text-center text-2xl font-bold text-amber-300 sm:text-3xl">
                  オープンキャスト限定特典
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: '専属プロデューサー制度',
                      desc: '業界経験豊富な専任担当者が、あなたの個性を見極め、最短ルートでの成功をマンツーマンで徹底サポートします。',
                    },
                    {
                      title: '最短1ヶ月でデビュー',
                      desc: '実践重視の独自プログラムにより、未経験からでも短期間でプロとしての自信と実力を身につけられます。',
                    },
                    {
                      title: '未経験者専用カリキュラム',
                      desc: '接客の基礎から心理学まで、ゼロからプロフェッショナルを目指すための体系化された研修をご用意しています。',
                    },
                    {
                      title: '3ヶ月間の最低保証',
                      desc: 'デビュー直後でも安心して働けるよう、安定した収入を保証。焦らずじっくりと実力を磨ける環境です。',
                    },
                    {
                      title: '初期費用完全無料',
                      desc: '宣材写真撮影やレッスン費用など、スタートにかかる費用はすべて店舗が負担。リスクゼロで挑戦できます。',
                    },
                    {
                      title: 'プロフェッショナル育成',
                      desc: '業界トップクラスの教育環境で、一流のホストとして必要なマインドとスキルを余すことなく伝授します。',
                    },
                  ].map((benefit, idx) => (
                    <div
                      key={idx}
                      className="group rounded-xl border border-amber-400/20 bg-gradient-to-br from-indigo-900/30 to-slate-900/30 p-4 backdrop-blur-sm transition-all hover:border-amber-400/40 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                    >
                      <h4 className="mb-2 text-base font-bold text-amber-300 sm:text-lg">
                        {benefit.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
                        {benefit.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <button
                    onClick={onOpenChat}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-10 py-5 text-lg font-bold text-slate-900 shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(251,191,36,0.5)] active:scale-95"
                  >
                    <span className="relative z-10">オープンキャストに応募する</span>
                    <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/30 to-transparent duration-700 ease-in-out group-hover:translate-x-full"></div>
                  </button>
                  <button
                    onClick={onOpenChat}
                    className="rounded-2xl border-2 border-amber-400/40 bg-slate-900/50 px-10 py-5 text-lg font-bold text-amber-300 backdrop-blur-sm transition-all hover:border-amber-400/60 hover:bg-slate-900/70 active:scale-95"
                  >
                    詳しい話を聞いてみる
                  </button>
                </div>

                {/* Reassurance */}
                <div className="text-center text-sm text-slate-400">
                  <p>✓ 応募は30秒で完了します</p>
                  <p>✓ 面接ではありません。まずはお気軽にご相談ください</p>
                </div>

                {/* Final Notice */}
                <div className="mx-auto max-w-2xl rounded-xl border border-indigo-400/20 bg-gradient-to-r from-indigo-950/40 to-slate-900/40 px-6 py-4 text-center backdrop-blur-sm">
                  <p className="mb-2 text-sm font-medium text-indigo-200 sm:text-base">
                    研修リソースの関係上、定員に達し次第、次回募集は未定となります
                  </p>
                  <p className="text-xs text-slate-400">
                    ※定員に達した場合、タイマー終了前でも受付終了となります
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCollage;
