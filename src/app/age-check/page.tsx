'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import TinderSection from '@/components/sections/TinderSection';
import AIMatchingTeaser from '@/components/sections/AIMatchingTeaser';
import ReasonSection from '@/components/sections/ReasonSection';
import PlanSection from '@/components/sections/PlanSection';
import ReviewSection from '@/components/sections/ReviewSection';
import FAQSection from '@/components/sections/FAQSection';
import ClosingCTA from '@/components/sections/ClosingCTA';
import BottomNavigation from '@/components/ui/BottomNavigation';
import LoadingAnimation from '@/components/ui/LoadingAnimation';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 overflow-x-hidden">
        <HeroSection />
        <TinderSection />
        <AIMatchingTeaser />
        <ReasonSection />
        <PlanSection />
        <ReviewSection />
        <FAQSection />
        <ClosingCTA />
      </div>
      <BottomNavigation />
    </>
  );
}