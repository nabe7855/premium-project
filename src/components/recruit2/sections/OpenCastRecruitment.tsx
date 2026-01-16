'use client';

import { EditableImage } from '@/components/admin/EditableImage';
import { motion, Variants } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface OpenCastRecruitmentProps {
  onOpenChat: () => void;
  isEditing?: boolean;
  onUpdate?: (key: string, value: string) => void;
  openCastImage?: string;
}

const OpenCastRecruitment: React.FC<OpenCastRecruitmentProps> = ({
  onOpenChat,
  isEditing = false,
  onUpdate,
  openCastImage,
}) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Target date: February 1st
    const now = new Date();
    const currentYear = now.getFullYear();
    let targetYear = currentYear;
    const testDate = new Date(currentYear, 1, 1);
    if (now > testDate) {
      targetYear = currentYear + 1;
    }
    const targetDate = new Date(targetYear, 1, 1);

    const updateTimer = () => {
      const currentTime = new Date();
      const difference = targetDate.getTime() - currentTime.getTime();

      if (difference > 0) {
        setTimeLeft(Math.floor(difference / 1000));
      } else {
        setTimeLeft(0);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}日 ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="w-full bg-slate-950 py-12 font-sans">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="relative z-10 flex w-full flex-col items-center justify-start px-4"
      >
        {/* Open Cast Recruitment Heading Image */}
        <motion.div
          variants={itemVariants}
          className="flex w-full max-w-5xl flex-col items-center px-4"
        >
          <div className="w-full overflow-hidden rounded-2xl border border-amber-500/30 shadow-2xl">
            <EditableImage
              src={openCastImage || '/オープンキャスト募集.png'}
              alt="オープンキャスト募集 - 10名限定超好待遇"
              className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
              isEditing={isEditing}
              onUpload={(file) => {
                const url = URL.createObjectURL(file);
                if (onUpdate) onUpdate('openCastImage', url);
              }}
            />
          </div>
        </motion.div>

        {/* Premium Recruitment Section - Luxury Design */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex w-full max-w-5xl flex-col items-center px-4"
        >
          {/* Main Card Container */}
          <div className="relative w-full overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 p-1 shadow-2xl">
            {/* Gold accent corners */}
            <div className="absolute left-0 top-0 h-20 w-20 border-l-2 border-t-2 border-amber-400/40"></div>
            <div className="absolute right-0 top-0 h-20 w-20 border-r-2 border-t-2 border-amber-400/40"></div>
            <div className="absolute bottom-0 left-0 h-20 w-20 border-b-2 border-l-2 border-amber-400/40"></div>
            <div className="absolute bottom-0 right-0 h-20 w-20 border-b-2 border-r-2 border-amber-400/40"></div>

            {/* Inner content */}
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/95 via-indigo-950/80 to-slate-900/95 p-8 backdrop-blur-xl sm:p-12">
              {/* Limited Slots Indicator */}
              <div className="mb-8 flex items-center justify-center gap-4">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/50 sm:w-12"></div>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                  <p className="text-center text-lg font-medium text-amber-200 sm:text-2xl">
                    超好待遇残り{' '}
                    <span className="mx-1 text-4xl font-bold text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] sm:text-6xl">
                      4
                    </span>{' '}
                    名様限定
                  </p>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                </div>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/50 sm:w-12"></div>
              </div>

              {/* Timer Section */}
              <div className="mb-10">
                <div className="mb-4 text-center">
                  <p className="mb-2 text-base font-bold tracking-widest text-amber-100 sm:text-lg">
                    2月1日 グランドオープンまで
                  </p>
                  <div className="mx-auto mb-2 h-px w-24 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
                </div>

                {/* Timer Display */}
                <div className="relative mx-auto max-w-3xl">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400/20 via-indigo-400/20 to-amber-400/20 blur-xl"></div>
                  <div className="relative rounded-2xl border border-amber-400/30 bg-gradient-to-br from-indigo-950/60 to-slate-900/60 px-4 py-8 backdrop-blur-sm sm:px-12 sm:py-10">
                    <div className="mb-2 text-center font-mono text-4xl font-bold tabular-nums tracking-tight text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)] sm:text-6xl md:text-7xl">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-sm font-medium text-indigo-200 sm:text-base">
                        2月1日 23:59までにエントリーされた方のみ
                      </p>
                      <p className="text-sm font-medium text-indigo-200 sm:text-base">
                        オープンキャスト枠として選考対象となります
                      </p>
                      <p className="mt-3 text-xs text-slate-400 sm:text-sm">
                        育成体制の都合上、今回の採用は10名様までとさせていただいております
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="mb-10">
                <h3 className="mb-6 whitespace-nowrap text-center text-2xl font-bold text-amber-300 sm:text-3xl">
                  オープンキャスト限定特典
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: '専属プロデューサー制度',
                      desc: '業界経験豊富な専任担当者が、あなたの個性を見極め、最短ルートでの成功をマンツーマンで徹底サポートします。',
                    },
                    {
                      title: '最短1ヶ月でデビュー',
                      desc: '実践重視の独自プログラムにより、未経験からでも短期間でプロとしての自信と実力を身につけられます。',
                    },
                    {
                      title: '未経験者専用カリキュラム',
                      desc: '接客の基礎から心理学まで、ゼロからプロフェッショナルを目指すための体系化された研修をご用意しています。',
                    },
                    {
                      title: '3ヶ月間の最低保証',
                      desc: 'デビュー直後でも安心して働けるよう、安定した収入を保証。焦らずじっくりと実力を磨ける環境です。',
                    },
                    {
                      title: '初期費用完全無料',
                      desc: '宣材写真撮影やレッスン費用など、スタートにかかる費用はすべて店舗が負担。リスクゼロで挑戦できます。',
                    },
                    {
                      title: 'プロフェッショナル育成',
                      desc: '業界トップクラスの教育環境で、一流のホストとして必要なマインドとスキルを余すことなく伝授します。',
                    },
                  ].map((benefit, idx) => (
                    <div
                      key={idx}
                      className="group rounded-xl border border-amber-400/20 bg-gradient-to-br from-indigo-900/30 to-slate-900/30 p-4 backdrop-blur-sm transition-all hover:border-amber-400/40 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                    >
                      <h4 className="mb-2 text-base font-bold text-amber-300 sm:text-lg">
                        {benefit.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
                        {benefit.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <button
                    onClick={onOpenChat}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-10 py-5 text-lg font-bold text-slate-900 shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(251,191,36,0.5)] active:scale-95"
                  >
                    <span className="relative z-10">オープンキャストに応募する</span>
                    <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/30 to-transparent duration-700 ease-in-out group-hover:translate-x-full"></div>
                  </button>
                  <button
                    onClick={onOpenChat}
                    className="rounded-2xl border-2 border-amber-400/40 bg-slate-900/50 px-10 py-5 text-lg font-bold text-amber-300 backdrop-blur-sm transition-all hover:border-amber-400/60 hover:bg-slate-900/70 active:scale-95"
                  >
                    詳しい話を聞いてみる
                  </button>
                </div>

                {/* Reassurance */}
                <div className="text-center text-sm text-slate-400">
                  <p>✓ 応募は30秒で完了します</p>
                  <p>✓ 面接ではありません。まずはお気軽にご相談ください</p>
                </div>

                {/* Final Notice */}
                <div className="mx-auto max-w-2xl rounded-xl border border-indigo-400/20 bg-gradient-to-r from-indigo-950/40 to-slate-900/40 px-6 py-4 text-center backdrop-blur-sm">
                  <p className="mb-2 text-sm font-medium text-indigo-200 sm:text-base">
                    研修リソースの関係上、定員に達し次第、次回募集は未定となります
                  </p>
                  <p className="text-xs text-slate-400">
                    ※定員に達した場合、タイマー終了前でも受付終了となります
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default OpenCastRecruitment;
