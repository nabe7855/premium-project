'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface AgeVerificationGuardProps {
  children: React.ReactNode;
}

const AgeVerificationGuard: React.FC<AgeVerificationGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  // 除外対象のパス判定
  const isExcluded = () => {
    const excludedPrefixes = ['/admin', '/cast', '/age-check', '/login', '/api', '/amolab', '/ikeo'];
    // 保護中ルートの一部も除外
    const protectedExcluded = ['/counseling', '/survey', '/reflection', '/consent'];

    // PageSpeed計測用バイパス（?pagespeed=true で年齢認証をスキップ）
    const hasBypass =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('pagespeed') === 'true';

    return (
      hasBypass ||
      excludedPrefixes.some((prefix) => pathname.startsWith(prefix)) ||
      protectedExcluded.some((path) => pathname.includes(path))
    );
  };

  useEffect(() => {
    if (isExcluded()) {
      setIsVerified(true);
      return;
    }

    // ローカルストレージキー: パスごとに個別のキーを使用
    const storageKey = `age_verified_${pathname}`;
    const value = localStorage.getItem(storageKey);

    if (value === 'true') {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, [pathname]);

  const handleVerify = () => {
    const storageKey = `age_verified_${pathname}`;
    localStorage.setItem(storageKey, 'true');
    setIsVerified(true);
  };

  const handleDeny = () => {
    // 18歳未満の場合は Google 等へリダイレクト
    window.location.href = 'https://www.google.com';
  };

  // 状態取得中
  if (isVerified === null) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <>
      {children}
      <AnimatePresence>
        {!isVerified && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/40 p-4 backdrop-blur-xl"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255, 192, 203, 0.2) 0%, transparent 40%),
                                radial-gradient(circle at 80% 80%, rgba(255, 182, 193, 0.2) 0%, transparent 40%)`,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[3rem] border-4 border-rose-100 bg-white/95 p-8 text-center shadow-[0_20px_50px_rgba(255,182,193,0.3)] backdrop-blur-md md:p-12"
            >
              {/* 装飾用イチゴアイコンイメージ */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <span className="text-6xl">🍓</span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -right-2 -top-2 text-2xl"
                  >
                    ✨
                  </motion.span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="mb-2 font-serif text-xl font-bold tracking-widest text-rose-500 md:text-2xl">
                  女性用風俗
                </h2>
                <p className="mb-6 text-sm font-bold tracking-[0.2em] text-rose-300">
                  《 ストロベリーボーイズ 》
                </p>

                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-rose-100 bg-rose-50 shadow-inner">
                  <div className="text-center">
                    <p className="font-serif text-3xl font-black text-rose-500">R18</p>
                    <p className="text-[10px] font-bold text-rose-300">ADULT ONLY</p>
                  </div>
                </div>

                <p className="mb-2 text-xs font-bold leading-relaxed text-slate-500 md:text-sm">
                  当サイトはアダルトコンテンツを含みます。
                  <br />
                  18歳未満の方はご利用いただけません。
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={handleVerify}
                  className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-rose-400 to-rose-500 py-4 text-sm font-black tracking-widest text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-rose-200 active:scale-95"
                >
                  私は18歳以上です
                  <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity hover:opacity-100" />
                </button>
                <button
                  onClick={handleDeny}
                  className="flex-1 rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 text-sm font-black tracking-widest text-slate-400 transition-all hover:bg-slate-100 active:scale-95"
                >
                  私は18歳未満です
                </button>
              </div>

              <p className="mt-8 text-[10px] font-medium text-rose-200">
                Strawberry Boys - Premium Healing Service
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AgeVerificationGuard;
