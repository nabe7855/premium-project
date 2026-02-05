'use client';

import { EditableImage } from '@/components/admin/EditableImage';
import { motion } from 'framer-motion';
import NextImage from 'next/image';
import React, { useState } from 'react';

interface RoutineSegment {
  start: number; // 0-24
  end: number;
  label: string;
  color: string;
  type: 'work' | 'break' | 'sleep' | 'personal';
}

interface CastProfile {
  id: string;
  name: string;
  image: string;
  income: string;
  monthlyEarnings: number;
  workPattern: {
    frequency: string;
    hours: string;
    rate: string;
  };
  lifestyle: string;
  routine: RoutineSegment[];
  label: string;
}

const PROFILES: CastProfile[] = [
  {
    id: 'side',
    name: 'Kさん',
    image: '/キャストモデル１.png',
    income: '月収 13.5万円',
    monthlyEarnings: 135000,
    workPattern: {
      frequency: '月に5回',
      hours: '19:00〜26:00迄の勤務',
      rate: '日当27,000円×5日',
    },
    lifestyle: '平日の夜や休日を有効活用。本業の収入にプラスして、ゆとりのある生活を。',
    routine: [
      { start: 0, end: 8, label: '睡眠', color: '#1e293b', type: 'sleep' },
      { start: 8, end: 18, label: '本業勤務', color: '#334155', type: 'personal' },
      { start: 18, end: 19, label: '移動・準備', color: '#475569', type: 'break' },
      { start: 19, end: 23, label: '施術（2件）', color: '#d97706', type: 'work' },
      { start: 23, end: 24, label: '帰宅・リラックス', color: '#1e293b', type: 'personal' },
    ],
    label: 'Salary',
  },
  {
    id: 'novice',
    name: 'Tさん',
    image: '/キャストモデル２.png',
    income: '月収 24万円',
    monthlyEarnings: 240000,
    workPattern: {
      frequency: '月に12回',
      hours: '20:00〜24:00迄の勤務',
      rate: '時給5,000円×4時間×12日',
    },
    lifestyle: 'まずは研修を兼ねて無理のないシフトから。3ヶ月で一生モノのスキルを習得。',
    routine: [
      { start: 0, end: 9, label: '睡眠', color: '#1e293b', type: 'sleep' },
      { start: 9, end: 11, label: '自己研鑽', color: '#475569', type: 'personal' },
      { start: 11, end: 12, label: '出勤準備', color: '#475569', type: 'break' },
      { start: 12, end: 18, label: '施術・講習', color: '#b45309', type: 'work' },
      { start: 18, end: 24, label: 'プライベート', color: '#1e293b', type: 'personal' },
    ],
    label: 'Earnings',
  },
  {
    id: 'regular',
    name: 'Sさん',
    image: '/キャストモデル３.png',
    income: '月収 36万円',
    monthlyEarnings: 360000,
    workPattern: {
      frequency: '月に8回',
      hours: '15:00〜23:00迄の勤務',
      rate: '日当45,000円×8日',
    },
    lifestyle: 'リピーター様も増え、安定した高収入。趣味や自己投資にも時間を割ける。',
    routine: [
      { start: 0, end: 9, label: '睡眠', color: '#1e293b', type: 'sleep' },
      { start: 9, end: 12, label: '趣味・ジム', color: '#334155', type: 'personal' },
      { start: 12, end: 13, label: '出勤準備', color: '#475569', type: 'break' },
      { start: 13, end: 20, label: '施術（3~4件）', color: '#92400e', type: 'work' },
      { start: 20, end: 24, label: 'ゆとりの時間', color: '#1e293b', type: 'personal' },
    ],
    label: 'Income',
  },
  {
    id: 'top',
    name: 'トップセラピスト',
    image: '/キャストモデル１.png',
    income: '月収 300万円超',
    monthlyEarnings: 3000000,
    workPattern: {
      frequency: '月に20回以上',
      hours: '10:00〜21:00迄の勤務',
      rate: '日当150,000円×20日',
    },
    lifestyle: 'プロとしての誇りを持ち、圧倒的な支持を獲得。人生を劇的に変えるステージ。',
    routine: [
      { start: 0, end: 6, label: '睡眠・泊まり', color: '#1e293b', type: 'sleep' },
      { start: 6, end: 10, label: '朝のルーティン', color: '#334155', type: 'personal' },
      { start: 10, end: 13, label: '1件目施術', color: '#d97706', type: 'work' },
      { start: 13, end: 14, label: '休憩・SNS更新', color: '#475569', type: 'break' },
      { start: 14, end: 17, label: '2件目施術', color: '#b45309', type: 'work' },
      { start: 17, end: 18, label: '休憩・ブログ', color: '#475569', type: 'break' },
      { start: 18, end: 21, label: '3件目施術', color: '#92400e', type: 'work' },
      { start: 21, end: 24, label: 'リラックス', color: '#1e293b', type: 'personal' },
    ],
    label: 'Success',
  },
];

interface AchievementsAndLifestyleProps {
  isEditing?: boolean;
  onUpdate?: (key: string, value: any) => void;
  castImages?: Record<string, string>;
}

const AchievementsAndLifestyle: React.FC<AchievementsAndLifestyleProps> = ({
  isEditing = false,
  onUpdate,
  castImages,
}) => {
  const [activeProfile, setActiveProfile] = useState<CastProfile>(PROFILES[0]);

  const handleUpload = (id: string) => (file: File) => {
    if (onUpdate) onUpdate(id, file);
  };

  const currentImage = castImages?.[activeProfile.id] || activeProfile.image;

  const describeArc = (startHour: number, endHour: number) => {
    const startAngle = (startHour / 24) * 360 - 90;
    const endAngle = (endHour / 24) * 360 - 90;

    const startRad = (Math.PI * startAngle) / 180;
    const endRad = (Math.PI * endAngle) / 180;

    const x1 = 150 + 100 * Math.cos(startRad);
    const y1 = 150 + 100 * Math.sin(startRad);
    const x2 = 150 + 100 * Math.cos(endRad);
    const y2 = 150 + 100 * Math.sin(endRad);

    const largeArcFlag = endHour - startHour <= 12 ? '0' : '1';

    return `M 150 150 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <section className="overflow-hidden bg-slate-950 py-24 text-white md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mb-12 text-center md:mb-20"
        >
          <h1 className="mb-4 font-serif text-3xl font-bold leading-tight tracking-wide text-white md:text-5xl md:tracking-wider">
            理想を形にする、実績のカタチ。
          </h1>
          <p className="mb-2 text-lg font-bold text-amber-500 md:text-2xl">
            「なりたい自分」を叶える1日
          </p>
          <p className="mx-auto max-w-2xl text-sm text-slate-400 md:text-base">
            単なる仕事ではありません。理想のライフスタイルを実現するためのルーティン。
            <br className="hidden md:block" />
            あなたのステージに合わせた、リアルなシミュレーションをご覧ください。
          </p>

          <div className="mt-8 flex justify-center md:mt-12">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              transition={{ delay: 0.8, duration: 1 }}
              viewport={{ once: true }}
              className="h-px bg-amber-500"
            ></motion.div>
          </div>
        </motion.div>

        {/* Profile Tabs */}
        <div className="mb-12 overflow-x-auto md:mb-16">
          <div className="flex justify-center gap-3 px-4 md:flex-wrap md:px-0">
            {PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveProfile(p)}
                className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-bold transition-all md:px-6 md:py-3 md:text-base ${
                  activeProfile.id === p.id
                    ? 'border-amber-600 bg-amber-600 text-white shadow-lg shadow-amber-900/40'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl">
          {/* Mobile: 2-row layout, Desktop: 2-column layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
            {/* Mobile Top Row: Image + Chart (side by side) */}
            <div className="grid grid-cols-2 gap-3 lg:block lg:space-y-8">
              {/* Cast Image */}
              <motion.div
                key={`image-${activeProfile.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="group relative aspect-[3/4] w-full overflow-hidden rounded-sm shadow-2xl"
              >
                <div className="h-full w-full">
                  {isEditing ? (
                    <EditableImage
                      src={currentImage}
                      alt={activeProfile.name}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      isEditing={isEditing}
                      onUpload={handleUpload(activeProfile.id)}
                    />
                  ) : (
                    <NextImage
                      src={currentImage}
                      alt={activeProfile.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  )}
                </div>
                <div className="pointer-events-none absolute inset-0 bg-slate-900/10 transition-colors duration-500 group-hover:bg-transparent"></div>

                {/* Label Overlay */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 lg:p-6">
                  <div className="font-serif text-3xl italic text-amber-600/80 drop-shadow-md md:text-6xl lg:text-5xl">
                    {activeProfile.label}
                  </div>
                </div>
              </motion.div>

              {/* 24-Hour Chart */}
              <motion.div
                key={`chart-${activeProfile.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group relative flex items-center"
              >
                <div className="pointer-events-none absolute inset-0 rounded-full bg-amber-500/10 blur-[100px]"></div>

                <svg
                  viewBox="0 0 300 300"
                  className="mx-auto w-full brightness-110 drop-shadow-2xl filter"
                >
                  {/* Outer Ring */}
                  <circle
                    cx="150"
                    cy="150"
                    r="110"
                    fill="transparent"
                    stroke="#1e293b"
                    strokeWidth="1"
                  />

                  {/* Routine Segments */}
                  {activeProfile.routine.map((segment, idx) => (
                    <path
                      key={`${activeProfile.id}-${idx}`}
                      d={describeArc(segment.start, segment.end)}
                      fill={segment.color}
                      className="origin-center transition-all duration-1000 ease-in-out hover:scale-[1.02] hover:brightness-125"
                      stroke="#020617"
                      strokeWidth="0.5"
                    />
                  ))}

                  {/* Hour Labels */}
                  {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => {
                    const angle = (hour / 24) * 360 - 90;
                    const rad = (Math.PI * angle) / 180;
                    const tx = 150 + 125 * Math.cos(rad);
                    const ty = 150 + 125 * Math.sin(rad);
                    return (
                      <text
                        key={hour}
                        x={tx}
                        y={ty}
                        fill="#64748b"
                        fontSize="10"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="font-mono"
                      >
                        {hour}
                      </text>
                    );
                  })}

                  {/* Center Logo */}
                  <circle
                    cx="150"
                    cy="150"
                    r="35"
                    fill="#0f172a"
                    stroke="#d97706"
                    strokeWidth="2"
                  />
                  <g transform="translate(132, 132) scale(1.5)">
                    <path
                      d="M12 2C10 2 8 3.5 8 5.5C8 6.1 8.2 6.6 8.5 7.1C6.2 8.3 4 10.9 4 14C4 18.4 7.6 22 12 22C16.4 22 20 18.4 20 14C20 10.9 17.8 8.3 15.5 7.1C15.8 6.6 16 6.1 16 5.5C16 3.5 14 2 12 2Z"
                      fill="#d97706"
                      opacity="0.8"
                    />
                  </g>
                </svg>

                {/* Work Labels Overlay */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative h-full w-full">
                    {activeProfile.routine
                      .filter((s) => s.type === 'work')
                      .map((s, i) => {
                        const mid = (s.start + s.end) / 2;
                        const angle = (mid / 24) * 360 - 90;
                        const rad = (Math.PI * angle) / 180;
                        const lx = 50 + 35 * Math.cos(rad);
                        const ly = 50 + 35 * Math.sin(rad);
                        return (
                          <div
                            key={i}
                            className="absolute whitespace-nowrap text-center text-[8px] font-bold text-amber-200 md:text-xs lg:text-[10px]"
                            style={{
                              left: `${lx}%`,
                              top: `${ly}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            {s.label}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Mobile Bottom Row / Desktop Right Column: Earnings + Schedule */}
            <motion.div
              key={`details-${activeProfile.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3 md:space-y-6"
            >
              {/* Earnings Card */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-xl md:rounded-3xl md:p-10">
                <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl"></div>

                <div className="mb-4 inline-block rounded-full border border-amber-600/30 bg-amber-600/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-500 md:mb-6 md:px-4 md:text-xs">
                  {activeProfile.workPattern.frequency}
                </div>

                <div className="mb-4 md:mb-8">
                  <div className="mb-1 text-xs font-bold text-slate-400 md:mb-2 md:text-sm">
                    想定報酬
                  </div>
                  <div className="flex flex-wrap items-baseline gap-1 md:gap-2">
                    <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text font-serif text-3xl font-bold leading-none text-transparent md:text-6xl">
                      {activeProfile.monthlyEarnings.toLocaleString()}
                    </span>
                    <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text font-serif text-sm font-bold text-transparent md:text-3xl">
                      円
                    </span>
                  </div>
                </div>

                <div className="mb-4 space-y-2 border-t border-slate-800 pt-4 md:mb-8 md:space-y-3 md:pt-6">
                  <div className="flex flex-col justify-between gap-1 text-[10px] md:flex-row md:items-center md:gap-0 md:text-sm">
                    <span className="text-slate-400">勤務時間</span>
                    <span className="font-bold text-slate-200">
                      {activeProfile.workPattern.hours}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between gap-1 text-[10px] md:flex-row md:items-center md:gap-0 md:text-sm">
                    <span className="text-slate-400">報酬単価</span>
                    <span className="font-bold text-slate-200">
                      {activeProfile.workPattern.rate}
                    </span>
                  </div>
                </div>

                <div className="mb-0 md:mb-6">
                  <div className="mb-2 text-xs font-bold text-slate-400 md:mb-3 md:text-sm">
                    ライフスタイル
                  </div>
                  <p className="text-xs italic leading-relaxed text-slate-200 md:text-base">
                    「{activeProfile.lifestyle}」
                  </p>
                </div>
              </div>

              {/* Schedule Breakdown */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4 backdrop-blur-sm md:rounded-3xl md:p-6">
                <div className="mb-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 md:mb-6 md:text-xs">
                  Daily Routine Breakdown
                </div>
                <div className="space-y-4">
                  {activeProfile.routine.map((s, idx) => (
                    <div key={idx} className="group flex items-center gap-2 md:gap-4">
                      <div className="w-10 flex-shrink-0 font-mono text-[clamp(0.6rem,2.5vw,0.75rem)] text-slate-500 md:w-14 md:text-xs">
                        {s.start}:00
                      </div>
                      <div className="min-w-0 flex-grow">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span
                            className={`whitespace-nowrap text-[clamp(0.7rem,3vw,0.875rem)] font-bold md:text-sm ${s.type === 'work' ? 'text-amber-500' : 'text-slate-300'}`}
                          >
                            {s.label}
                          </span>
                          <span className="flex-shrink-0 text-[clamp(0.5rem,2vw,0.625rem)] text-slate-500 md:text-[10px]">
                            {s.end - s.start}h
                          </span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${((s.end - s.start) / 24) * 100}%`,
                              backgroundColor: s.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 md:p-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-600/20 text-xl md:h-12 md:w-12 md:text-2xl">
                  💡
                </div>
                <p className="text-xs leading-relaxed text-slate-400 md:text-sm">
                  ※これらは実際のキャストの実績に基づくモデルケースです。ご自身の体調やライフスタイルに合わせて、自由にシフトを調整いただけます。
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsAndLifestyle;
