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
          ここは、<span className="text-amber-500">「稼ぐ場所」</span>ではなく
          <br className="hidden sm:block" />
          <span className="italic text-white underline decoration-amber-500 decoration-2 underline-offset-4">
            “必要とされる自分”
          </span>
          に
          <br className="sm:hidden" />
          なれる場所。
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

        {/* Countdown */}
        <div className="animate-fade-in-up mt-8 flex flex-col items-center delay-300">
          <div className="mb-2 text-xs text-slate-400 sm:text-sm">
            残り <span className="font-bold text-white">4</span> 名で募集終了
          </div>
          <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 font-mono text-[10px] text-amber-500/80 sm:text-sm">
            タイムリミット: {formatTime(timeLeft)}
          </div>
        </div>

        {/* Bottom Brand */}
        <div className="mt-12 opacity-60">
          <p className="font-serif text-xl italic tracking-widest text-amber-600/50 sm:text-2xl">
            Un moment pour toi
          </p>
          <p className="mt-1 text-center text-[10px] text-slate-600">アン モモン プートア</p>
        </div>
      </div>
    </section>
  );
};

export default HeroCollage;
