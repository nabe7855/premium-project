'use client';

import { EditableImage } from '@/components/admin/EditableImage';
import { motion, Variants } from 'framer-motion';
import NextImage from 'next/image';
import React, { useEffect, useState } from 'react';

interface OpenCastRecruitmentProps {
  onOpenChat: () => void;
  isEditing?: boolean;
  onUpdate?: (key: string, value: any) => void;
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
          <div className="group relative w-full overflow-hidden rounded-2xl border border-amber-500/30 shadow-2xl">
            {isEditing ? (
              <EditableImage
                src={openCastImage || '/オープンキャスト募集.png'}
                alt="オープンキャスト募集 - 10名限定超好待遇"
                className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
                isEditing={isEditing}
                onUpload={(file) => {
                  console.log('📸 OpenCastRecruitment: Image selected', file.name);
                  if (onUpdate) onUpdate('openCastImage', file);
                }}
              />
            ) : (
              <NextImage
                src={openCastImage || '/オープンキャスト募集.png'}
                alt="オープンキャスト募集 - 10名限定超好待遇"
                width={0}
                height={0}
                sizes="(max-width: 768px) 100vw, 1024px"
                className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            )}
            {isEditing && (
              <label className="absolute right-4 top-4 z-50 cursor-pointer rounded bg-black/60 px-4 py-2 text-white hover:bg-black/80">
                <span className="text-sm font-bold text-white">画像を変更</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && onUpdate) {
                      console.log('📸 OpenCastRecruitment manual: Image selected', file.name);
                      onUpdate('openCastImage', file);
                    }
                  }}
                />
              </label>
            )}
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
              {/* Grand Opening Message - Moved and Prominent */}
              <div className="mb-8 text-center">
                <p className="mb-3 text-2xl font-black tracking-[0.1em] text-white drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] sm:text-4xl">
                  2月1日 <span className="text-amber-300">グランドオープン</span>まで
                </p>
                <div className="mx-auto h-0.5 w-32 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
              </div>

              {/* Limited Slots Indicator */}
              <div className="mb-10 flex items-center justify-center gap-4">
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
                <h3 className="mb-6 whitespace-nowrap text-center text-2xl font-bold text-orange-500 sm:text-3xl">
                  オープンキャスト限定特典
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                  {[
                    {
                      title: (
                        <>
                          <span className="inline-block">専属プロデューサー</span>
                          <span className="inline-block">制度</span>
                        </>
                      ),
                      desc: (
                        <>
                          <span className="inline-block">業界経験豊富な</span>
                          <span className="inline-block">専任担当者が、</span>
                          <span className="inline-block">あなたの個性を</span>
                          <span className="inline-block">見極め、</span>
                          <span className="inline-block">最短ルートでの</span>
                          <span className="inline-block">成功を</span>
                          <span className="inline-block">マンツーマンで</span>
                          <span className="inline-block">徹底サポート</span>
                          <span className="inline-block">します。</span>
                        </>
                      ),
                    },
                    {
                      title: (
                        <>
                          <span className="inline-block">最短1ヶ月で</span>
                          <span className="inline-block">デビュー</span>
                        </>
                      ),
                      desc: (
                        <>
                          <span className="inline-block">実践重視の</span>
                          <span className="inline-block">独自プログラム</span>
                          <span className="inline-block">により、</span>
                          <span className="inline-block">未経験からでも</span>
                          <span className="inline-block">短期間で</span>
                          <span className="inline-block">プロとしての</span>
                          <span className="inline-block">自信と実力を</span>
                          <span className="inline-block">身につけられます。</span>
                        </>
                      ),
                    },
                    {
                      title: (
                        <>
                          <span className="inline-block">未経験者</span>
                          <span className="inline-block">専用カリキュラム</span>
                        </>
                      ),
                      desc: (
                        <>
                          <span className="inline-block">接客の基礎から</span>
                          <span className="inline-block">心理学まで、</span>
                          <span className="inline-block">ゼロから</span>
                          <span className="inline-block">プロフェッショナルを</span>
                          <span className="inline-block">目指すための</span>
                          <span className="inline-block">体系化された研修を</span>
                          <span className="inline-block">ご用意しています。</span>
                        </>
                      ),
                    },
                    {
                      title: (
                        <>
                          <span className="inline-block">3ヶ月間の</span>
                          <span className="inline-block">最低保証</span>
                        </>
                      ),
                      desc: (
                        <>
                          <span className="inline-block">デビュー直後でも</span>
                          <span className="inline-block">安心して</span>
                          <span className="inline-block">働けるよう、</span>
                          <span className="inline-block">安定した</span>
                          <span className="inline-block">収入を保証。</span>
                          <span className="inline-block">焦らずじっくりと</span>
                          <span className="inline-block">実力を磨ける</span>
                          <span className="inline-block">環境です。</span>
                        </>
                      ),
                    },
                    {
                      title: (
                        <>
                          <span className="inline-block">初期費用</span>
                          <span className="inline-block">完全無料</span>
                        </>
                      ),
                      desc: (
                        <>
                          <span className="inline-block">宣材写真撮影や</span>
                          <span className="inline-block">レッスン費用など、</span>
                          <span className="inline-block">スタートに</span>
                          <span className="inline-block">かかる費用は</span>
                          <span className="inline-block">すべて店舗が負担。</span>
                          <span className="inline-block">リスクゼロで</span>
                          <span className="inline-block">挑戦できます。</span>
                        </>
                      ),
                    },
                    {
                      title: (
                        <>
                          <span className="inline-block">プロフェッショナル</span>
                          <span className="inline-block">育成</span>
                        </>
                      ),
                      desc: (
                        <>
                          <span className="inline-block">業界トップクラスの</span>
                          <span className="inline-block">教育環境で、</span>
                          <span className="inline-block">一流のホストとして</span>
                          <span className="inline-block">必要なマインドと</span>
                          <span className="inline-block">スキルを</span>
                          <span className="inline-block">余すことなく</span>
                          <span className="inline-block">伝授します。</span>
                        </>
                      ),
                    },
                  ].map((benefit, idx) => (
                    <div
                      key={idx}
                      className="group flex flex-col items-center justify-start rounded-xl border border-orange-500/20 bg-gradient-to-br from-indigo-900/30 to-slate-900/30 p-3 text-center backdrop-blur-sm transition-all hover:border-orange-500/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] sm:p-4"
                    >
                      <h4 className="mb-2 break-words text-sm font-bold text-orange-500 sm:text-lg">
                        {benefit.title}
                      </h4>
                      <p className="break-words text-[10px] leading-relaxed text-orange-300/80 sm:text-sm">
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
                    className="group relative overflow-hidden rounded-2xl bg-yellow-400 px-10 py-5 text-lg font-bold text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.3)] transition-all hover:scale-105 hover:bg-yellow-500 hover:shadow-[0_0_50px_rgba(250,204,21,0.5)] active:scale-95"
                  >
                    <span className="relative z-10">簡単相談してみる</span>
                    <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/40 to-transparent duration-700 ease-in-out group-hover:translate-x-full"></div>
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
                  <p>✓ 相談は30秒で完了します</p>
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
