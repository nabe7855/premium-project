'use client';

import React, { useState } from 'react';
import { SectionTitle } from './Common';

const MangaSlide: React.FC<{ index: number; title: string; desc: string }> = ({
  index,
  title,
  desc,
}) => (
  <div className="flex h-full flex-col overflow-hidden rounded-xl border border-stone-100 bg-white shadow-lg">
    <div className="relative aspect-[3/4] bg-stone-200">
      <img
        src={`https://picsum.photos/seed/manga-${index}/600/800`}
        alt={title}
        className="h-full w-full object-cover"
      />
      <div className="bg-strawberry absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-bold text-white">
        Episode {index + 1}
      </div>
    </div>
    <div className="flex-grow p-4">
      <h3 className="mb-2 text-lg font-bold text-stone-900">{title}</h3>
      <p className="text-sm leading-relaxed text-stone-600">{desc}</p>
    </div>
  </div>
);

const MangaSection: React.FC = () => {
  const [activeManga] = useState(0);
  const mangaData = [
    {
      title: '現状の不満',
      desc: '「給料が上がらない…」「毎日同じことの繰り返し…」そんな不安な日々。',
    },
    { title: 'お店を発見', desc: '創業8周年の信頼。福岡待望のNEW OPEN募集を見つけて一念発起！' },
    {
      title: '丁寧な研修',
      desc: '未経験でも安心。専属講師によるマンツーマン指導で、プロの技術が身につく。',
    },
    { title: '初仕事へ', desc: '緊張のデビュー日。お客様からの『ありがとう』で自信が湧いてきた！' },
    {
      title: '自由な待機',
      desc: '待機時間は自宅やカフェで自由に。自分のペースで働けるのが嬉しい。',
    },
    {
      title: '即日お給料',
      desc: '仕事終わりはその場で全額日払い。頑張った分だけすぐ手に入る喜び。',
    },
    { title: '理想の毎日', desc: '美容にもお金をかけられるようになり、心も生活も驚くほど豊かに！' },
    {
      title: 'あなたも共に',
      desc: '新しい一歩を踏み出す勇気が、人生を変える。まずは気軽に応募を。',
    },
  ];

  return (
    <section id="manga" className="overflow-hidden bg-stone-100 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionTitle title="ストーリーで知る、私たちの働き方" subtitle="SUCCESS STORY" />
        <div className="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-8">
          {mangaData.map((manga, i) => (
            <div key={i} className="w-[280px] flex-shrink-0 snap-center md:w-[320px]">
              <MangaSlide index={i} title={manga.title} desc={manga.desc} />
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {mangaData.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${activeManga === i ? 'bg-strawberry w-8' : 'w-2 bg-stone-300'}`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MangaSection;
