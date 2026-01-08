
import React from 'react';
import HeroSection from '@/components/recruit/HeroSection';
import QuickNav from '@/components/recruit/QuickNav';
import BrandStrength from '@/components/recruit/BrandStrength';
import MangaSection from '@/components/recruit/MangaSection';
import TargetSection from '@/components/recruit/TargetSection';
import SalarySection from '@/components/recruit/SalarySection';
import QASection from '@/components/recruit/QASection';
import RequirementSection from '@/components/recruit/RequirementSection';
import EntryForm from '@/components/recruit/EntryForm';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Quick Navigation */}
      <QuickNav />

      {/* 3. Brand Strength (Trust & Logic) */}
      <BrandStrength />

      {/* 4. Manga Story Section */}
      <MangaSection />

      {/* 5. Target & Audience */}
      <TargetSection />

      {/* 6. Salary & Income Models */}
      <SalarySection />

      {/* 7. Detailed Q&A */}
      <QASection />

      {/* 8. Recruitment Requirements Table */}
      <RequirementSection />

      {/* 9. Final CTA & Entry Form */}
      <EntryForm />
    </div>
  );
};

export default App;
