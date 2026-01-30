import React from 'react';

export const Welcome: React.FC = () => {
  return (
    <section className="overflow-hidden bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="relative">
          <div className="absolute inset-0 translate-x-2 translate-y-2 transform rounded-lg bg-stone-100 opacity-50"></div>

          <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-[#FFFEFA] p-8 leading-relaxed text-gray-800 shadow-2xl md:p-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'linear-gradient(#000 1px, transparent 1px)',
                backgroundSize: '100% 3rem',
                marginTop: '5rem',
              }}
            ></div>

            <div className="relative z-10 mb-12 inline-block border-b-2 border-[#FF4B5C]/20 pb-4">
              <h2 className="text-xl font-bold tracking-widest text-gray-700 md:text-3xl">
                初めてのご利用のお客様へ
              </h2>
            </div>

            <div className="relative z-10 space-y-8 text-base md:text-lg">
              <p className="text-lg font-bold text-[#FF4B5C] md:text-xl">
                「全ての女性が安心安全にご利用できる女風店」
                <br />
                をコンセプトに運営しています☆
              </p>

              <div className="space-y-6 text-gray-600">
                <p>
                  女風を初めてご利用されるにあたり、不安や懸念をお持ちのお客様も多くいらっしゃると思います。
                  <br />
                  特によくいただくご相談内容として...
                </p>

                <div className="space-y-2 rounded-xl border-l-4 border-[#FF4B5C] bg-red-50/70 p-6 text-sm italic md:text-base">
                  <p>・密室で初めて会う男性から施術を受ける怖さ</p>
                  <p>・ご自身の年齢や容姿などを気にされて一歩踏み出せない</p>
                  <p>・女風店が多すぎてどこを選べばいいか分からない</p>
                  <p>・思い描いたサービスが受けられるか、安心して利用できるお店なのか...</p>
                </div>

                <p>
                  こうした懸念を払拭し、リラックスして素晴らしい時間をお過ごしいただけるよう、様々な対策を講じ、7年にわたってお客様と共に歩んで参りました。
                  <br />
                  1人ひとりの女性に深く寄り添い、その笑顔を増やすことに全力を尽くしてまいります。
                </p>

                <p>
                  そして、ご興味はあるけれどもまだ一歩を踏み出せていない全ての女性に我々の理念をお届けしたく、当店では初回ご利用時の割引をさらに充実させ、新初回料金としてこの度ご用意をさせていただきました。
                  <br />
                  ぜひこの機会に女風デビューのお手伝いをさせていただければ幸いです♪
                </p>
              </div>

              <div className="flex flex-col items-end pt-12">
                <div className="text-right">
                  <p className="mb-2 text-sm text-gray-400">貴女に寄り添うパートナーとして</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-gray-800 md:text-2xl">
                      ストロベリーボーイズ 一同
                    </span>
                    <div className="flex h-12 w-12 rotate-12 transform items-center justify-center rounded-full border-2 border-white bg-[#FF4B5C] text-white shadow-lg">
                      <span className="text-2xl">🍓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
