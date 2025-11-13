// pages/index.tsx
import React from 'react';
import { Header } from '@/components/sections/policy/Header';
import { TrustPromises } from '@/components/sections/policy/TrustPromises';
import { SecurityBadges } from '@/components/sections/policy/SecurityBadges';
import { MainContent } from '@/components/sections/policy/MainContent';
import { ContactInfo } from '@/components/sections/policy/ContactInfo';
import { FAQ } from '@/components/sections/policy/FAQ';
import { SBGuidance } from '@/components/sections/policy/SBGuidance';
import { FeedbackSection } from '@/components/sections/policy/FeedbackSection';
import { ProgressIndicator } from '@/components/sections/policy/ProgressIndicator';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <ProgressIndicator />
      <Header />
      <TrustPromises />
      <SecurityBadges />
      <MainContent />
      <ContactInfo />
      <FAQ />
      <SBGuidance />
      <FeedbackSection />

      <footer className="bg-gray-800 px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm opacity-80">© 2024 ストロベリーボーイズ. All rights reserved.</p>
          <p className="mt-2 text-xs opacity-60">最終更新日: 2024年1月1日</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
