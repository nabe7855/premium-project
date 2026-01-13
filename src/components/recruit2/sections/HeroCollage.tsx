import React, { useEffect, useState } from 'react';

// Define AnimationState locally for this component
enum AnimationState {
  IDLE = 'IDLE',
  ASSEMBLED = 'ASSEMBLED',
}

interface HeroCollageProps {
  onOpenChat: () => void;
}

const HeroCollage: React.FC<HeroCollageProps> = ({ onOpenChat }) => {
  const [timeLeft, setTimeLeft] = useState(24 * 3600);
  const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.IDLE);
  const [loaded, setLoaded] = useState(false);
  const imageUrl = '/ファーストビュー.png';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger animation after mount/load
  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setLoaded(true);
      setLoaded(true);
      // Small delay before starting animation
      // アニメーション開始までの待機時間（ミリ秒）
      // この数値を変更すると、画像が表示されてから動き出すまでの時間を調整できます
      // 例: 100 => 0.1秒待機, 500 => 0.5秒待機
      setTimeout(() => setAnimationState(AnimationState.ASSEMBLED), 500);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
  // PC用 (横長画面用) - 黒い車線に合わせた調整
  const desktopClips = {
    left: 'polygon(0 0, 32% 0, 19% 100%, 0 100%)',
    middle: 'polygon(32% 0, 66% 0, 53% 100%, 19% 100%)',
    right: 'polygon(66% 0, 100% 0, 100% 100%, 53% 100%)',
  };

  // モバイル用 (縦長画面用) - 画面幅に合わせて比率を維持しつつ調整
  // モバイルでも黒い線に合わせるため、PCと近い比率または画像を考慮した値を設定
  const mobileClips = {
    left: 'polygon(0 0, 32% 0, 19% 100%, 0 100%)',
    middle: 'polygon(32% 0, 66% 0, 53% 100%, 19% 100%)',
    right: 'polygon(66% 0, 100% 0, 100% 100%, 53% 100%)',
  };

  const clips = isMobile ? mobileClips : desktopClips;
  // duration: アニメーションにかかる時間。2000ms程度が推奨です。
  // ease: ふわっと動き出し、中間で加速し、最後にゆっくり結合するカーブ (cubic-bezier)
  const duration = '2000ms';
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

  const shardBaseClass = 'absolute inset-0 transition-all';

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-slate-950 font-sans">
      {/* Background/Collage Area - Top 60% */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        {/* Animated Split Image Container */}
        {loaded ? (
          <div className="relative h-full w-full">
            {/* Shard 1 (Left) - Slides from Top-Left */}
            <div
              className={`${shardBaseClass} ${
                isAssembled
                  ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
                  : '-translate-x-full -translate-y-1/4 scale-110 opacity-0'
              }`}
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center', // Using center as requested for general view
                clipPath: clips.left,
                zIndex: 10,
                transitionDuration: duration,
                transitionTimingFunction: ease,
              }}
            />

            {/* Shard 2 (Middle) - Slides from Bottom */}
            <div
              className={`${shardBaseClass} ${
                isAssembled
                  ? 'translate-y-0 scale-100 opacity-100'
                  : 'translate-y-full scale-95 opacity-0'
              }`}
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                clipPath: clips.middle,
                zIndex: 20,
                transitionDuration: duration,
                transitionTimingFunction: ease,
              }}
            />

            {/* Shard 3 (Right) - Slides from Top-Right */}
            <div
              className={`${shardBaseClass} ${
                isAssembled
                  ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
                  : '-translate-y-1/4 translate-x-full scale-110 opacity-0'
              }`}
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
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

        {/* Gradient Overlay for smooth transition to text area */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/90"
          style={{ zIndex: 30 }}
        ></div>
      </div>

      {/* Text Content Area - Bottom 35-40% */}
      <div className="relative z-40 -mt-12 flex flex-1 flex-col items-center justify-start px-4 pb-12 sm:-mt-20">
        {/* Gold Banner */}
        <div className="animate-fade-in-up relative mb-6">
          <div className="absolute -inset-1 rounded-full bg-amber-600/20 blur-sm"></div>
          <div className="relative inline-block rounded-full border border-amber-600/50 bg-amber-600/20 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-500 sm:text-xs">
            FUKUOKA OPENING SPECIAL
          </div>
        </div>

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
        <div className="animate-fade-in-up mx-auto mb-10 grid max-w-4xl grid-cols-2 gap-3 delay-200 sm:gap-4 md:grid-cols-4">
          {[
            { label: '未経験月収', val: '60万円〜' },
            { label: '勤務時間', val: '3h/日〜' },
            { label: 'お酒/ノルマ', val: '一切なし' },
            { label: '全額日払い', val: '当日OK' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-3 backdrop-blur-md sm:p-4"
            >
              <div className="mb-1 text-[10px] text-slate-400 sm:text-xs">{item.label}</div>
              <div className="whitespace-nowrap text-base font-bold text-amber-500 sm:text-lg md:text-xl">
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

        {/* Open Cast Recruitment Heading */}
        <div className="animate-fade-in-up delay-250 mt-10 flex flex-col items-center">
          <h2 className="mb-2 text-3xl font-black text-white sm:text-4xl md:text-5xl">
            オープンキャスト募集！！
          </h2>
          <p className="text-lg font-bold text-slate-300 sm:text-xl">
            10名限定で超好待遇であなたをプロデュースします。
          </p>
        </div>

        {/* Premium Recruitment Section - Luxury Design */}
        <div className="animate-fade-in-up mt-12 flex w-full max-w-5xl flex-col items-center px-4 delay-300">
          {/* Exclusive Offer Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-gradient-to-r from-amber-900/20 to-amber-800/10 px-6 py-2 backdrop-blur-sm">
            <span className="text-2xl">✨</span>
            <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-sm font-bold tracking-wider text-transparent sm:text-base">
              EXCLUSIVE OPPORTUNITY
            </span>
            <span className="text-2xl">✨</span>
          </div>

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
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/50"></div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                  <p className="text-lg font-medium text-slate-300 sm:text-xl">
                    残り{' '}
                    <span className="mx-1 text-4xl font-bold text-amber-400 sm:text-5xl">4</span>{' '}
                    名様限定
                  </p>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                </div>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/50"></div>
              </div>

              {/* Timer Section */}
              <div className="mb-10">
                <div className="mb-4 text-center">
                  <p className="mb-2 text-sm font-medium uppercase tracking-widest text-amber-400/80 sm:text-base">
                    Application Deadline
                  </p>
                  <div className="mx-auto mb-2 h-px w-24 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
                </div>

                {/* Timer Display */}
                <div className="relative mx-auto max-w-2xl">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400/20 via-indigo-400/20 to-amber-400/20 blur-xl"></div>
                  <div className="relative rounded-2xl border border-amber-400/30 bg-gradient-to-br from-indigo-950/60 to-slate-900/60 px-8 py-8 backdrop-blur-sm sm:px-12 sm:py-10">
                    <div className="mb-6 font-mono text-5xl font-bold tabular-nums text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)] sm:text-6xl md:text-7xl">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-sm font-medium text-indigo-200 sm:text-base">
                        本日23:59までにエントリーされた方のみ
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
                <h3 className="mb-6 text-center text-2xl font-bold text-amber-300 sm:text-3xl">
                  <span className="mr-2">👑</span>
                  オープンキャスト限定特典
                  <span className="ml-2">👑</span>
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      icon: '🎯',
                      title: '専属プロデューサー制度',
                      desc: 'あなた専任の担当者が徹底サポート',
                    },
                    {
                      icon: '⚡',
                      title: '最短1ヶ月でデビュー',
                      desc: '独自の育成プログラムで即戦力化',
                    },
                    {
                      icon: '📚',
                      title: '未経験者専用カリキュラム',
                      desc: 'ゼロからプロフェッショナルへ',
                    },
                    {
                      icon: '💎',
                      title: '3ヶ月間の最低保証',
                      desc: '収入面も安心のサポート体制',
                    },
                    {
                      icon: '🎁',
                      title: '初期費用完全無料',
                      desc: 'リスクゼロでスタート可能',
                    },
                    {
                      icon: '🏆',
                      title: 'プロフェッショナル育成',
                      desc: '業界トップクラスの教育環境',
                    },
                  ].map((benefit, idx) => (
                    <div
                      key={idx}
                      className="group rounded-xl border border-amber-400/20 bg-gradient-to-br from-indigo-900/30 to-slate-900/30 p-4 backdrop-blur-sm transition-all hover:border-amber-400/40 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                    >
                      <div className="mb-2 text-2xl">{benefit.icon}</div>
                      <h4 className="mb-1 text-sm font-bold text-amber-300 sm:text-base">
                        {benefit.title}
                      </h4>
                      <p className="text-xs text-slate-400 sm:text-sm">{benefit.desc}</p>
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
