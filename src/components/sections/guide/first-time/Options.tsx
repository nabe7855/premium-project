import React from 'react';

interface AreaItem {
  name: string;
  price: string;
}

interface OptionsProps {
  areas?: AreaItem[];
}

export const Options: React.FC<OptionsProps> = ({
  areas = [
    { name: '新宿・渋谷・池袋・上野・錦糸町', price: '4,000円〜' },
    { name: '鶯谷', price: '3,000円〜' },
  ],
}) => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">サービス・オプション詳細</h2>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Basic/Free */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 border-b pb-4 text-lg font-bold">
              <span className="h-6 w-2 rounded-full bg-[#FF4B5C]"></span>
              基本サービス・無料オプション
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-600">
              <span>・カウンセリング</span>
              <span>・指圧マッサージ</span>
              <span>・パウダー性感</span>
              <span>・オイルマッサージ</span>
              <span>・ポルチオ・クンニ</span>
              <span>・乳首舐め</span>
              <span>・Gスポット・ボルチオ</span>
              <span>・キス・ハグ・愛撫</span>
              <span>・フェラ・手コキ</span>
              <span>・ローター・バイブ等</span>
            </div>
          </div>

          {/* Paid Options */}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 border-b pb-4 text-lg font-bold">
              <span className="h-6 w-2 rounded-full bg-[#FF4B5C]"></span>
              有料オプション
            </h3>
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-gray-800">ソフトM性感オプション</h4>
                  <p className="text-xs text-gray-500">
                    目隠し、手枷などを使用し、ソフトに責める体験。
                  </p>
                </div>
                <span className="whitespace-nowrap font-bold text-[#FF4B5C]">+¥2,000</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-gray-800">洗体オプション</h4>
                  <p className="text-xs text-gray-500">
                    お風呂で丁寧に、いやらしく体を洗うサービス。
                  </p>
                </div>
                <span className="whitespace-nowrap font-bold text-[#FF4B5C]">+¥2,000</span>
              </div>
              <div className="flex items-start justify-between gap-4 rounded-xl border border-red-100 bg-red-50 p-4">
                <div>
                  <h4 className="font-bold text-[#FF4B5C]">アイラインタッチ無し</h4>
                  <p className="text-xs italic text-gray-500">
                    粘膜接触なし、服を脱がない等、不安な方向け。
                  </p>
                </div>
                <span className="whitespace-nowrap font-bold text-[#FF4B5C]">-¥1,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Areas */}
        <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">
          <h3 className="mb-6 flex items-center gap-2 border-b pb-4 text-lg font-bold">
            <span className="h-6 w-2 rounded-full bg-[#55A630]"></span>
            出張費・ホテル代目安
          </h3>
          <div className="grid gap-8 text-sm md:grid-cols-2">
            {areas.map((area, idx) => (
              <div key={idx}>
                <span className="mb-1 block font-bold">{area.name}</span>
                <span className="text-gray-600">{area.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
