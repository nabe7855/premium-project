'use client';

import { motion } from 'framer-motion';
import React from 'react';

const Trust: React.FC = () => {
  const locations = [
    {
      city: '東京',
      stores: 3,
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    },
    {
      city: '大阪',
      stores: 2,
      image: 'https://images.unsplash.com/photo-1589452271712-64b8a66c7b71?w=800&h=600&fit=crop',
    },
    {
      city: '名古屋',
      stores: 1,
      image: 'https://images.unsplash.com/photo-1555633514-abcee6ab92e1?w=800&h=600&fit=crop',
    },
  ];

  const metrics = [
    { label: '継続年数', value: '8', unit: 'YEARS', desc: '創業から選ばれ続ける信頼' },
    { label: '育成実績', value: '200', unit: '+', desc: '未経験から成功へ導いた人数' },
    { label: '平均月収', value: '85', unit: '万円', desc: '在籍キャスト平均実績' },
    { label: '定着率', value: '92', unit: '%', desc: '1年以上継続率' },
  ];

  const systemPillars = [
    {
      icon: '🎯',
      title: '専属プロデューサー制度',
      desc: 'あなた専任の担当者が、デビューから成功まで徹底的にサポート。個人の特性を見極め、最適な戦略を立案します。',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    },
    {
      icon: '📊',
      title: 'データドリブン育成',
      desc: '8年間で蓄積された成功パターンをデータ化。あなたの成長を可視化し、最短ルートで結果を出せる環境を提供します。',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    },
    {
      icon: '🤝',
      title: 'チーム連携体制',
      desc: '個人プレーではなく、組織全体であなたをバックアップ。マーケティング、ブランディング、運営が一体となって支援します。',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
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

        {/* Locations Section - Strategic Positioning */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-6 inline-block"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-2xl"></div>

              </div>
            </motion.div>
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

          {/* Strategic Triangle Layout */}
          <div className="relative mx-auto max-w-5xl">
            {/* Connecting Lines */}
            <svg
              className="absolute inset-0 h-full w-full"
              style={{ zIndex: 0 }}
              viewBox="0 0 1000 800"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#d97706" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {/* Tokyo to Osaka */}
              <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                viewport={{ once: true }}
                x1="250"
                y1="200"
                x2="750"
                y2="200"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              {/* Osaka to Nagoya */}
              <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.7 }}
                viewport={{ once: true }}
                x1="750"
                y1="200"
                x2="500"
                y2="600"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              {/* Nagoya to Tokyo */}
              <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.9 }}
                viewport={{ once: true }}
                x1="500"
                y1="600"
                x2="250"
                y2="200"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>

            {/* City Cards in Triangle Formation */}
            <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Tokyo - Top Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="group relative z-10 md:col-span-1"
              >
                <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-2xl transition-all hover:border-amber-300 hover:shadow-amber-500/20">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={locations[0].image}
                      alt="東京"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
                    {/* City Badge */}
                    <div className="absolute left-6 top-6">
                      <div className="rounded-full border border-amber-400/50 bg-slate-900/80 px-4 py-1 backdrop-blur-sm">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          Capital
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-baseline gap-3">
                      <h4 className="font-serif text-3xl font-bold text-slate-900">東京</h4>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                        {locations[0].stores}店舗
                      </span>
                    </div>
                    <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600"></div>
                  </div>
                </div>
              </motion.div>

              {/* Osaka - Top Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="group relative z-10 md:col-span-1"
              >
                <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-2xl transition-all hover:border-amber-300 hover:shadow-amber-500/20">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={locations[1].image}
                      alt="大阪"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
                    {/* City Badge */}
                    <div className="absolute left-6 top-6">
                      <div className="rounded-full border border-amber-400/50 bg-slate-900/80 px-4 py-1 backdrop-blur-sm">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          West Hub
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-baseline gap-3">
                      <h4 className="font-serif text-3xl font-bold text-slate-900">大阪</h4>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                        {locations[1].stores}店舗
                      </span>
                    </div>
                    <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600"></div>
                  </div>
                </div>
              </motion.div>

              {/* Nagoya - Bottom Center */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                viewport={{ once: true }}
                className="group relative z-10 md:col-span-2 md:mx-auto md:w-1/2"
              >
                <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-2xl transition-all hover:border-amber-300 hover:shadow-amber-500/20">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={locations[2].image}
                      alt="名古屋"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
                    {/* City Badge */}
                    <div className="absolute left-6 top-6">
                      <div className="rounded-full border border-amber-400/50 bg-slate-900/80 px-4 py-1 backdrop-blur-sm">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          Central
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-baseline gap-3">
                      <h4 className="font-serif text-3xl font-bold text-slate-900">名古屋</h4>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                        {locations[2].stores}店舗
                      </span>
                    </div>
                    <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600"></div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Central Brand Symbol */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              viewport={{ once: true }}
              className="absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block"
            >
              <div className="relative">
                <div className="absolute -inset-8 animate-pulse rounded-full bg-amber-500/20 blur-2xl"></div>
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-500/50 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 shadow-2xl">
                  <div className="text-center">
                    <div className="font-serif text-xs font-bold text-amber-400">Un moment</div>
                    <div className="text-[10px] text-slate-400">pour toi</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
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
                  <div className="mb-3 text-3xl">{pillar.icon}</div>
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

        {/* Philosophy Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-12 shadow-2xl sm:p-16"
        >
          {/* Decorative Elements */}
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-32 translate-x-32 rounded-full bg-amber-500/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-32 translate-y-32 rounded-full bg-indigo-500/10 blur-3xl"></div>

          <div className="relative z-10">
            <div className="mb-12 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="mb-6 font-serif text-5xl font-bold text-amber-400 sm:text-7xl"
              >
                8 YEARS
              </motion.div>
              <h4 className="mb-6 font-serif text-xl font-bold leading-tight text-slate-100 sm:text-2xl">
                私たちは「刹那的な稼ぎ」を提供しません。
                <br className="hidden sm:block" />
                「一生モノの価値」を共に創るパートナーです。
              </h4>
              <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              <p className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base">
                単に高収入を得るだけの場所なら、他にもあるかもしれません。
                しかし、私たちが8年間一貫して追求してきたのは、未経験の方がここで得た経験を
                その後の人生を支える「確かなスキルと自信」に変えていただくことです。
              </p>
            </div>

            {/* Growth Steps */}
            <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="absolute left-0 top-12 z-0 hidden h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent md:block"></div>

              {[
                {
                  icon: '🛡️',
                  title: '盤石な土台',
                  subtitle: '創業8年の信頼',
                  desc: '刹那的な稼ぎではなく、一生モノの自信を得るための環境を8年かけて磨き上げました。',
                },
                {
                  icon: '💡',
                  title: '能力の開花',
                  subtitle: '徹底した教育サポート',
                  desc: '未経験からでもプロになれる独自の育成プログラム。あなたの得意をプロのスキルへ。',
                },
                {
                  icon: '💎',
                  title: '継続的な成功',
                  subtitle: '個人の価値を資産へ',
                  desc: '単なる労働ではなく、あなた自身のブランドを確立。どこへ行っても通用する人間力を養います。',
                },
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  className="group relative z-10 flex flex-col items-center text-center"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/50 text-4xl backdrop-blur-sm transition-all group-hover:border-amber-500/50 group-hover:bg-slate-700/50">
                    {step.icon}
                  </div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                    {step.subtitle}
                  </div>
                  <h5 className="mb-3 font-serif text-lg font-bold text-white">{step.title}</h5>
                  <p className="px-4 text-xs leading-relaxed text-slate-400">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 border-t border-slate-800 pt-8 text-center"
            >
              <div className="inline-flex items-center gap-3 rounded-2xl border border-amber-600/30 bg-amber-600/10 px-6 py-3 backdrop-blur-sm">
                <span className="text-amber-400">✨</span>
                <p className="text-sm font-medium text-slate-200">
                  新人育成実績No.1の自負。未経験のあなたが輝ける土台は、ここにあります。
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Trust;
