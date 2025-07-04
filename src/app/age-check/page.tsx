'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AnimatePresence } from 'framer-motion';

import HeroSection from '@/components/sections/age-verification/AgeVerificationHero';
import TinderSection from '@/components/sections/age-verification/TinderSection';
import AIMatchingTeaser from '@/components/sections/age-verification/AIMatchingTeaser';
import ReasonTrustSection from '@/components/sections/age-verification/ReasonTrustSection';
import PlanSection from '@/components/sections/age-verification/PlanSection';
import ReviewSection from '@/components/sections/age-verification/ReviewSection';
import FAQSection from '@/components/sections/age-verification/AgeVerificationFAQ';
import ClosingCTA from '@/components/sections/age-verification/ClosingCTA';
import BottomNavigation from '@/components/sections/age-verification/BottomNavigation';
import AgeVerificationModal from '@/components/sections/age-verification/AgeVerificationModal';
import LoadingAnimation from '@/components/sections/age-verification/LoadingAnimation';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const router = useRouter();

  // ✅ クッキー確認 → 既に年齢確認済みならリダイレクト
  useEffect(() => {
    const isVerified = Cookies.get('isAgeVerified');
    if (isVerified === 'true') {
      router.push('/store-select');
    }
  }, [router]);

  // ✅ 読み込みアニメーション解除
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ モーダル開く
  const handleAgeVerificationTrigger = () => {
    console.log('🟢 年齢確認モーダルを開きます');
    setShowAgeModal(true);
  };

  // ✅ 「はい」→ クッキー保存＆遷移
  const handleConfirm = () => {
    console.log('✅ 年齢確認 → /store-select に遷移');
    Cookies.set('isAgeVerified', 'true', { expires: 7 }); // 7日間有効
    router.push('/store-select');
  };

  // ✅ モーダル閉じる
  const handleClose = () => {
    console.log('🟡 年齢確認モーダルを閉じます');
    setShowAgeModal(false);
  };

  // ✅ ローディング中
  if (isLoading) {
    return <LoadingAnimation />;
  }

  // ✅ 通常ページ描画
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white font-serif">
      {/* Polka dot 背景 */}
      <div
        className="pointer-events-none fixed inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, #DC143C 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <main className="relative z-10">
        <HeroSection onAgeVerification={handleAgeVerificationTrigger} />
        <TinderSection onAgeVerification={handleAgeVerificationTrigger} />
        <AIMatchingTeaser onAgeVerification={handleAgeVerificationTrigger} />
        <ReasonTrustSection />
        <PlanSection />
        <ReviewSection />
        <FAQSection />
        <ClosingCTA onAgeVerification={handleAgeVerificationTrigger} />
      </main>

      <BottomNavigation onAgeVerification={handleAgeVerificationTrigger} />

      <AnimatePresence>
        {showAgeModal && (
          <AgeVerificationModal
            isOpen={showAgeModal}
            onConfirm={handleConfirm}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
