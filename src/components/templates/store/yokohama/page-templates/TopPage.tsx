'use client';
import CampaignSection from '../sections/CampaignSection';
import CastSection from '../sections/CastSection';
import ConceptSection from '../sections/ConceptSection';
import FlowSection from '../sections/FlowSection';
import Footer from '../sections/Footer';

import HeroSection from '../sections/HeroSection';
import MobileStickyButton from '../sections/MobileStickyButton';
import PriceSection from '../sections/PriceSection';

export default function YokohamaPage() {
  return (
    <div className="selection:bg-primary-100 selection:text-primary-800 relative min-h-screen font-sans text-slate-600">
      <HeroSection />
      <ConceptSection />
      <CampaignSection />
      <CastSection />
      <PriceSection />
      <FlowSection />
      <Footer />
      <MobileStickyButton />
    </div>
  );
}
