import React from 'react';

const castSamples = [
  {
    id: 1,
    name: 'ハル',
    age: '24歳',
    height: '178cm',
    type: '癒やし系',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 2,
    name: 'レン',
    age: '26歳',
    height: '182cm',
    type: 'クール系',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 3,
    name: 'タクミ',
    age: '23歳',
    height: '175cm',
    type: '王子様系',
    image:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
  },
];

export const CastSampler: React.FC = () => {
  return (
    <section className="overflow-hidden bg-stone-50 py-20">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-black md:text-4xl">
            貴女を待つ、
            <br className="md:hidden" />
            <span className="text-[#FF4B5C]">自慢のセラピストたち</span>
          </h2>
          <p className="font-medium text-gray-500">
            厳選されたキャストが、最高のおもてなしをお約束します。
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {castSamples.map((cast) => (
            <div
              key={cast.id}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl transition-all hover:-translate-y-2"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={cast.image}
                  alt={cast.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-2xl font-black text-gray-800">{cast.name}</span>
                  <span className="text-sm font-bold text-gray-400">
                    {cast.age} / {cast.height}
                  </span>
                </div>
                <div className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#FF4B5C]">
                  {cast.type}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-[#FF4B5C] px-10 py-4 font-bold text-white shadow-lg transition-all hover:bg-[#ff3548] hover:shadow-xl active:scale-95"
          >
            すべてのセラピストを見る
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
          <p className="mt-4 text-xs font-medium text-gray-300">
            ※写真はイメージです。実際とは異なる場合があります。
          </p>
        </div>
      </div>
    </section>
  );
};
