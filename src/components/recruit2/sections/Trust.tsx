'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface TrustProps {
  config?: {
    isVisible?: boolean;
    sectionTitle?: string;
    mainHeading?: string;
    description?: string;
    pillars?: Array<{ title: string; sub: string; desc: string }>;
    statsHeaderTitle?: string;
    statsHeaderDesc?: string;
    stats?: Array<{ label: string; value: string; unit: string; desc: string }>;
  };
  isEditing?: boolean;
  onUpdate?: (key: string, value: any) => void;
}

const Trust: React.FC<TrustProps> = ({ config, isEditing, onUpdate }) => {
  const locations = [
    {
      city: '東京本店',
      stores: 3,
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    },
    {
      city: '大阪店',
      stores: 2,
      image: 'https://images.unsplash.com/photo-1589452271712-64b8a66c7b71?w=800&h=600&fit=crop',
    },
    {
      city: '名古屋店',
      stores: 1,
      image: 'https://images.unsplash.com/photo-1555633514-abcee6ab92e1?w=800&h=600&fit=crop',
    },
  ];

  const pillarIcons = [
    <svg className="h-8 w-8 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>,
    <svg className="h-8 w-8 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 21c0 .5.5 1 1 1h4c.55 0 1-.5 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
    </svg>,
    <svg className="h-8 w-8 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm6 10H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V17z" />
    </svg>,
  ];

  const pillars = config?.pillars || [
    {
      title: '盤石な土台',
      sub: '創業8年の信頼',
      desc: '刹那的な稼ぎではなく、一生モノの自信を得るための環境を8年かけて磨き上げました。',
    },
    {
      title: '能力の開花',
      sub: '徹底した教育サポート',
      desc: '未経験からでもプロになれる独自の育成プログラム。あなたの得意をプロのスキルへ。',
    },
    {
      title: '継続的な成功',
      sub: '個人の価値を資産へ',
      desc: '単なる労働ではなく、あなた自身のブランドを確立。どこへ行っても通用する人間力を養います。',
    },
  ];

  const stats = config?.stats || [
    {
      label: '継続年数',
      value: '8',
      unit: '年',
      desc: '店舗生存率は3年で0.8%。私たちは8年間選ばれ続けています。',
    },
    {
      label: '育成実績',
      value: '200',
      unit: '名以上',
      desc: 'ほとんどが未経験スタート。0から育てた確かな実績。',
    },
    {
      label: '定着率',
      value: '92',
      unit: '%',
      desc: '稼げるから、続く。1年以上継続率92％。',
    },
    {
      label: '平均月収',
      value: '85',
      unit: '万円',
      desc: '多くのキャストが3年以上在籍。続けられる＝稼げる証拠です。',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#111827] py-24 sm:py-32">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl"></div>
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl"></div>

      <div className="container relative z-10 mx-auto px-4">
        {/* 1. Brand Concept Header (8 YEARS) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 font-serif text-6xl font-black tracking-widest text-amber-400 outline-none drop-shadow-lg sm:text-8xl md:text-9xl"
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => onUpdate?.('sectionTitle', e.currentTarget.innerText)}
          >
            {config?.sectionTitle || '8 YEARS'}
          </motion.h2>
          <h3
            className="mb-8 whitespace-pre-wrap font-serif text-xl font-bold leading-relaxed text-white outline-none sm:text-3xl md:text-4xl"
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => onUpdate?.('mainHeading', e.currentTarget.innerText)}
          >
            {config?.mainHeading ||
              '私たちは「刹那的な稼ぎ」を提供しません。\n「一生モノの価値」を共に創るパートナーです。'}
          </h3>
          <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          <p
            className="mx-auto max-w-3xl whitespace-pre-wrap text-base leading-loose text-slate-300 outline-none sm:text-lg"
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => onUpdate?.('description', e.currentTarget.innerText)}
          >
            {config?.description ||
              '単に高収入を得るだけの場所なら、他にあるかもしれません。\nしかし、私たちが8年間一貫して追求してきたのは、\n未経験の方がここで得た経験をその後の人生を支える\n「確かなスキルと自信」に変えていただくことです。'}
          </p>
        </motion.div>

        {/* 2. Three Pillars (Concept) */}
        <div className="mb-32 grid gap-8 md:grid-cols-3">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="group relative flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:border-amber-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-amber-900/20"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:ring-amber-500/50">
                {pillarIcons[idx % pillarIcons.length]}
              </div>
              <div
                className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-400 outline-none"
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => {
                  const newPillars = [...pillars];
                  newPillars[idx].sub = e.currentTarget.innerText;
                  onUpdate?.('pillars', newPillars);
                }}
              >
                {pillar.sub}
              </div>
              <h4
                className="mb-4 font-serif text-2xl font-bold text-white outline-none"
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => {
                  const newPillars = [...pillars];
                  newPillars[idx].title = e.currentTarget.innerText;
                  onUpdate?.('pillars', newPillars);
                }}
              >
                {pillar.title}
              </h4>
              <p
                className="text-sm leading-relaxed text-slate-400 outline-none group-hover:text-slate-200"
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => {
                  const newPillars = [...pillars];
                  newPillars[idx].desc = e.currentTarget.innerText;
                  onUpdate?.('pillars', newPillars);
                }}
              >
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 3. Evidence Data Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h3
            className="mb-4 font-serif text-3xl font-bold text-white outline-none sm:text-5xl"
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => onUpdate?.('statsHeaderTitle', e.currentTarget.innerText)}
          >
            {config?.statsHeaderTitle || 'なぜ、8年も選ばれ続けるのか'}
          </h3>
          <p
            className="text-slate-400 outline-none"
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => onUpdate?.('statsHeaderDesc', e.currentTarget.innerText)}
          >
            {config?.statsHeaderDesc || '数字が証明する、私たちの実績。'}
          </p>
        </motion.div>

        {/* 4. Evidence Data Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-32 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-white p-6 shadow-lg sm:p-8"
            >
              <div
                className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 outline-none"
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => {
                  const newStats = [...stats];
                  newStats[idx].label = e.currentTarget.innerText;
                  onUpdate?.('stats', newStats);
                }}
              >
                {stat.label}
              </div>
              <div className="mb-3 flex items-baseline gap-1">
                <span
                  className="bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text font-serif text-4xl font-black text-transparent outline-none md:text-5xl"
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => {
                    const newStats = [...stats];
                    newStats[idx].value = e.currentTarget.innerText;
                    onUpdate?.('stats', newStats);
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-serif text-sm font-bold text-amber-600 outline-none md:text-lg"
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => {
                    const newStats = [...stats];
                    newStats[idx].unit = e.currentTarget.innerText;
                    onUpdate?.('stats', newStats);
                  }}
                >
                  {stat.unit}
                </span>
              </div>
              <p
                className="text-xs font-medium leading-relaxed text-slate-600 outline-none md:text-sm"
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => {
                  const newStats = [...stats];
                  newStats[idx].desc = e.currentTarget.innerText;
                  onUpdate?.('stats', newStats);
                }}
              >
                {stat.desc}
              </p>
              {/* Highlight Deco */}
              <div className="absolute right-0 top-0 -mr-4 -mt-4 h-20 w-20 rounded-full bg-amber-100/50 blur-2xl transition-opacity group-hover:opacity-100"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* 5. Locations Slider Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md">
            <span className="animate-pulse text-amber-400">●</span>
            <span className="text-xs font-bold text-amber-200 sm:text-sm">
              三大都市を制圧する組織力
            </span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            全国主要都市を網羅する、確かな基盤
          </h3>
        </motion.div>

        {/* 6. Locations Infinite Slider (Dark Theme Adjusted) */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Gradient Masks */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-[#111827] to-transparent sm:w-24"></div>
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-[#111827] to-transparent sm:w-24"></div>

          <div className="animate-infinite-scroll hover:pause flex w-max">
            {[...locations, ...locations, ...locations, ...locations].map((location, idx) => (
              <div
                key={`loc-${idx}`}
                className="relative mx-3 w-[240px] flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-800 shadow-xl transition-all hover:scale-105 hover:border-amber-500/50 sm:w-[320px]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.city}
                    className="h-full w-full object-cover opacity-80 transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <h4 className="font-serif text-2xl font-bold text-white drop-shadow-md">
                      {location.city}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Styles for Slider Animation */}
        <style jsx>{`
          @keyframes infinite-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
          .animate-infinite-scroll {
            animation: infinite-scroll 60s linear infinite;
          }
          .hover\\:pause:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </section>
  );
};

export default Trust;
