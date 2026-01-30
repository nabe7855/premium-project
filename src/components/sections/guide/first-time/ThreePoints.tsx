import React from 'react';

export const ThreePoints: React.FC = () => {
  const points = [
    {
      step: 'point 1',
      title: '初めての方限定！120分16,000円！',
      description:
        '本物のサービスをご体験頂けるよう、トップセラピストを含む全セラピストが対象の特別な価格にて初回コースをご案内致します！追加料金なしの明朗会計です。',
      icon: '🍓',
    },
    {
      step: 'point 2',
      title: '女風デビューを失敗させません！',
      description:
        '事前カウンセリングで不安を解消！お店に何度でも無料相談可能です。セラピストとの事前連絡・カウンセリングで当日の不安を解消し、安心して素敵な体験をお楽しみください。',
      icon: '✨',
    },
    {
      step: 'point 3',
      title: 'ゆったり過ごせるボリュームの120分！',
      description:
        '対面カウンセリング＆シャワー後にコーススタート！入室後のカウンセリングとシャワーを浴び終えた後からお時間のカウントを開始。無料時間の長さに驚きと喜びの声を多数頂いております！',
      icon: '⏰',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-pink-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-2xl font-black leading-tight text-gray-800 md:text-4xl">
          ストロベリーボーイズが選ばれる
          <br />
          <span className="text-[#FF4B5C] underline decoration-[#FF4B5C]/30 underline-offset-8">
            3つの安心ポイント
          </span>
        </h2>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {points.map((p, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-red-50 bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl"
            >
              <div className="mb-4 text-sm font-black uppercase tracking-widest text-[#FF4B5C]">
                {p.step}
              </div>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold leading-tight text-gray-800">
                <span className="text-2xl">{p.icon}</span>
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 md:text-base">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
