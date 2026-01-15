'use client';

import { motion } from 'framer-motion';
import React from 'react';

const Trust: React.FC = () => {
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

  const systemPillars = [
    {
      title: '圧倒的なWeb集客力',
      desc: 'SEO対策に力を入れたWeb集客を行っているため、圧倒的な集客力があり、日々多くのお問い合わせが入る環境が整っています。',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    },
    {
      title: '少人数制の環境づくり',
      desc: 'あえて少人数制を採用。セラピストを無制限に増やさず、一人ひとりにお客様が入りやすい環境づくりを徹底しています。だから結果的に、自然とお問い合わせが集まります。',
      image: 'https://images.unsplash.com/photo-1519494140681-8917d16a1c23?w=800&q=80',
    },
    {
      title: '8年のデータ分析と仕組み',
      desc: '8年間にわたり蓄積したデータ分析に基づいた運営だから、“なんとなく売れる”ではなく、実際にお客様からの問い合わせが集まる仕組みができています。',
      image: 'https://images.unsplash.com/photo-1551288049-bbda3865c17d?w=800&q=80',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white py-24 sm:py-32">
      {/* Decorative Elements */}
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="mb-6 font-serif text-3xl font-bold leading-tight text-slate-900 sm:text-5xl md:text-6xl">
            なぜ、私たちは8年も
            <br />
            選ばれ続けるのか
          </h2>
          <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          <p className="mx-auto max-w-3xl font-serif text-base leading-relaxed text-slate-600 sm:text-lg">
            東京・大阪・名古屋。激戦区で培った再現性の高いノウハウ。
            <br className="hidden sm:block" />
            それは一人の人間としての成長を支援する思想の証です。
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-24 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {/* Item 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-xl sm:p-8"
          >
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-amber-50 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div className="relative">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                継続年数
              </div>
              <div className="mb-3 flex items-baseline gap-1">
                <span className="bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text font-serif text-4xl font-bold text-transparent sm:text-5xl">
                  8
                </span>
                <span className="font-serif text-lg font-semibold text-amber-600">年</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                女風業界の店舗生存率は、3年で0.8％程度です。
                <br />
                ほとんどの店が消えていく世界で、私たちは8年間、第一線に立ち続けています。
                <br />
                生き残る店には、理由がある。集まる男にも、理由がある。
              </p>
            </div>
          </motion.div>

          {/* Item 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-xl sm:p-8"
          >
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-amber-50 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div className="relative">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                育成実績
              </div>
              <div className="mb-3 flex items-baseline gap-1">
                <span className="bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text font-serif text-4xl font-bold text-transparent sm:text-5xl">
                  200
                </span>
                <span className="font-serif text-lg font-semibold text-amber-600">名以上</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                ほとんどが未経験スタート。
                <br />
                0から育てた実績は200名以上。
              </p>
            </div>
          </motion.div>

          {/* Item 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-xl sm:p-8"
          >
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-amber-50 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div className="relative">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                定着率
              </div>
              <div className="mb-3 flex items-baseline gap-1">
                <span className="bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text font-serif text-4xl font-bold text-transparent sm:text-5xl">
                  92
                </span>
                <span className="font-serif text-lg font-semibold text-amber-600">%</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                稼げるから、続く。
                <br />
                1年以上継続率92％。
              </p>
            </div>
          </motion.div>

          {/* Item 4 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-xl sm:p-8"
          >
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-amber-50 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div className="relative">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                平均月収
              </div>
              <div className="mb-3 flex items-baseline gap-1">
                <span className="bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text font-serif text-4xl font-bold text-transparent sm:text-5xl">
                  85
                </span>
                <span className="font-serif text-lg font-semibold text-amber-600">万円</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                在籍キャスト平均実績→ 平均在籍年数 ３年以上
                <br />
                多くのキャストが3年以上在籍。
                <br />
                続けられる＝稼げる証拠です。
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Locations Section - Infinite Slider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="mb-12 text-center">
            <h3 className="mb-4 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              全国主要都市を制圧した、
              <br className="sm:hidden" />
              勝ち続ける組織の布陣
            </h3>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600">
              東京・大阪・名古屋。日本の激戦区で長年戦い続けてきた実績。
              <br className="hidden sm:block" />
              三大都市を束ねるひとつの成長エンジンが、あなたの成功を支えます。
            </p>
          </div>

          {/* Infinite Slider Container */}
          <div className="relative w-full overflow-hidden py-4">
            {/* Gradient Masks for Fade Effeect */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-white to-transparent sm:w-24"></div>
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-white to-transparent sm:w-24"></div>

            {/* Slider Track */}
            <div className="animate-infinite-scroll hover:pause flex w-max">
              {/* First Set */}
              <div className="flex gap-4 px-2 sm:gap-6 sm:px-3">
                {locations.map((location, idx) => (
                  <div
                    key={`loc-1-${idx}`}
                    className="relative w-[260px] flex-shrink-0 overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all hover:border-amber-300 hover:shadow-xl sm:w-[350px]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={location.image}
                        alt={location.city}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-baseline gap-3">
                        <h4 className="font-serif text-3xl font-bold text-slate-900">
                          {location.city}
                        </h4>
                      </div>
                      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Duplicate Set for Loop */}
              <div className="flex gap-4 px-2 sm:gap-6 sm:px-3">
                {locations.map((location, idx) => (
                  <div
                    key={`loc-2-${idx}`}
                    className="relative w-[260px] flex-shrink-0 overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all hover:border-amber-300 hover:shadow-xl sm:w-[350px]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={location.image}
                        alt={location.city}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-baseline gap-3">
                        <h4 className="font-serif text-3xl font-bold text-slate-900">
                          {location.city}
                        </h4>
                      </div>
                      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 3rd Set for Loop (Ensure coverage) */}
              <div className="flex gap-4 px-2 sm:gap-6 sm:px-3">
                {locations.map((location, idx) => (
                  <div
                    key={`loc-3-${idx}`}
                    className="relative w-[260px] flex-shrink-0 overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all hover:border-amber-300 hover:shadow-xl sm:w-[350px]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={location.image}
                        alt={location.city}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-baseline gap-3">
                        <h4 className="font-serif text-3xl font-bold text-slate-900">
                          {location.city}
                        </h4>
                      </div>
                      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Styles for Animation */}
            <style jsx>{`
              @keyframes infinite-scroll {
                from {
                  transform: translateX(0);
                }
                to {
                  transform: translateX(-33.33%);
                }
              }
              .animate-infinite-scroll {
                animation: infinite-scroll 40s linear infinite;
              }
              .hover\\:pause:hover {
                animation-play-state: paused;
              }
            `}</style>
          </div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-50 px-6 py-3">
              <span className="text-amber-600">⚡</span>
              <p className="text-sm font-bold text-slate-800">
                三大都市を束ねる、ひとつの成長エンジン
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* System Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="mb-12 text-center">
            <h3 className="mb-4 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              組織の牽引力
            </h3>
            <p className="text-sm text-slate-600">
              個人の才能 × 組織の仕組み = 圧倒的な成長エンジン
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {systemPillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl shadow-xl"
              >
                {/* Background Image */}
                <div className="aspect-[4/3]">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
                </div>

                {/* Text Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  <div className="mb-4 inline-block bg-white/90 px-4 py-2 backdrop-blur-sm">
                    <h4 className="font-serif text-lg font-bold text-slate-900 sm:text-xl">
                      {pillar.title}
                    </h4>
                  </div>
                  <p className="leading-relaxed text-white/90">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Trust;
