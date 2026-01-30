import React from 'react';

export const CTA: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <span className="inline-block animate-bounce text-6xl">🍓</span>
            <div className="absolute -right-4 -top-4 rounded-lg border bg-white px-2 py-1 text-[10px] font-bold shadow-sm">
              ご相談ください!
            </div>
          </div>
        </div>

        <h2 className="mb-6 text-2xl font-black leading-tight md:text-4xl">
          まずは相談だけ、という方もお気軽に。
          <br />
          私たちが貴女のデビューを
          <br className="md:hidden" />
          大切にサポートします。
        </h2>

        <div className="flex flex-col items-center gap-6">
          <a
            href="https://line.me"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full max-w-lg"
          >
            <div className="absolute inset-0 bg-[#06C755] opacity-20 blur-xl transition-opacity group-hover:opacity-40"></div>
            <div className="relative flex flex-col items-center justify-center gap-4 rounded-[40px] bg-[#06C755] py-6 text-white shadow-2xl transition-all group-hover:-translate-y-1 md:flex-row md:py-8">
              <div className="rounded-2xl bg-white p-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/124/124034.png"
                  alt="LINE"
                  className="h-10 w-10"
                />
              </div>
              <div className="text-center md:text-left">
                <div className="text-xl font-black md:text-2xl">LINEで簡単予約・お問い合わせ</div>
                <div className="text-sm opacity-90">
                  <span className="mr-2 rounded bg-white/20 px-2 py-0.5">スタンプ1つでもOK</span>
                  こちらをクリックして友達登録
                </div>
              </div>
            </div>
          </a>

          <div className="text-sm font-medium text-gray-500">
            LINE ID: <span className="font-bold text-gray-800">@204ynfuu</span>
          </div>

          <p className="text-xs text-gray-400">24時間受付中 / 相談だけでもOKです</p>
        </div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute left-0 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFF0F3] opacity-50 blur-3xl"></div>
      <div className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-red-50 opacity-50 blur-3xl"></div>
    </section>
  );
};
