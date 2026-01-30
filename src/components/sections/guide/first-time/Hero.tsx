import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-red-50 pb-20 pt-8 md:pb-32 md:pt-12">
      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 inline-block rounded-full bg-[#FF4B5C] px-4 py-1 text-sm font-bold tracking-wider text-white">
            🍓 STRAWBERRY BOYS
          </div>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
            全ての女性が、
            <br />
            <span className="text-[#FF4B5C]">安心して楽しめる場所へ!!</span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg font-medium text-gray-600 md:text-xl">
            ストロベリーボーイズは、新宿・渋谷・池袋といった都心を中心に、貴女の「女風デビュー」を徹底支援します。
            <br />
            業界最安値かつ最高レベルのセラピストが、日常を忘れる最高の癒やしと潤いをお約束します。
          </p>

          <div className="group relative cursor-pointer transition-transform duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-[#FF4B5C] opacity-20 blur-xl transition-opacity group-hover:opacity-40"></div>
            <div className="relative flex flex-col items-center gap-6 rounded-3xl border-4 border-[#FF4B5C] bg-white p-6 shadow-2xl md:flex-row md:p-8">
              <div className="text-left">
                <span className="text-lg font-bold text-[#FF4B5C]">＼ 初回限定特典 ／</span>
                <h2 className="text-2xl font-black text-gray-800 md:text-3xl">120分コース</h2>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg text-gray-400 line-through">¥20,000</span>
                  <span className="text-4xl font-black text-[#FF4B5C] md:text-5xl">¥16,000</span>
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 md:h-20 md:w-px"></div>
              <div className="text-center md:text-left">
                <p className="text-sm leading-relaxed text-gray-600">
                  一番人気の満足プラン。
                  <br />
                  技術もマインドも超一流な
                  <br />
                  セラピストにお任せください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Strawberries */}
      <div className="animate-float absolute right-[10%] top-10 hidden opacity-20 md:block">
        <span className="text-8xl">🍓</span>
      </div>
      <div className="animate-float absolute bottom-20 left-[5%] hidden opacity-10 delay-700 md:block">
        <span className="text-9xl">🍓</span>
      </div>
    </section>
  );
};
