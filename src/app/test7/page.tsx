export default function Page() {
  return (
    <div className="min-h-screen bg-[#020617] font-sans text-white selection:bg-amber-500/30">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-24 text-center md:py-32">
        {/* Ambient Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-900/20 blur-[120px]" />

        {/* Catchphrase */}
        <div className="z-10 mx-auto max-w-5xl space-y-6">
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            ただ<span className="text-amber-500">「稼ぐ場所」</span>ではなく
            <br className="md:hidden" />
            <span className="relative inline-block md:ml-4">
              <span className="relative z-10 italic">“価値ある男”</span>
              <span className="absolute bottom-0 left-0 h-[0.2em] w-full -skew-x-12 bg-amber-600/60"></span>
            </span>
            にして
            <br className="lg:hidden" />
            <span className="lg:ml-4">ゼロから稼げる場所。</span>
          </h1>

          {/* Subtext */}
          <p className="mt-8 text-sm leading-relaxed tracking-wide text-slate-300 md:text-base">
            今日からでも、人生は変えられる。
            <br className="md:hidden" />
            数多くの未経験者をプロに導いた、創業8年の信頼と実績。
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mx-auto mt-16 grid w-full max-w-4xl grid-cols-1 gap-4 px-4 md:grid-cols-3">
          {/* Card 1: Expenses */}
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-sm transition-colors hover:border-amber-900/50">
            <div className="text-xs font-medium text-slate-400">雑費・講習費</div>
            <div className="text-2xl font-bold text-amber-500">全額店舗負担</div>
          </div>

          {/* Card 2: Shifts */}
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-sm transition-colors hover:border-amber-900/50">
            <div className="text-xs font-medium text-slate-400">勤務時間</div>
            <div className="text-2xl font-bold text-amber-500">自由出勤</div>
          </div>

          {/* Card 3: Quotas */}
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-sm transition-colors hover:border-amber-900/50">
            <div className="text-xs font-medium text-slate-400">お酒/ノルマ</div>
            <div className="text-2xl font-bold text-amber-500">一切なし</div>
          </div>
        </div>
      </section>
    </div>
  );
}
