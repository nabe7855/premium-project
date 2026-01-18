'use client';
import CampaignSection from '../sections/CampaignSection';
import CastSection from '../sections/CastSection';
import ConceptSection from '../sections/ConceptSection';
import FAQSection from '../sections/FAQSection';
import FlowSection from '../sections/FlowSection';
import Footer from '../sections/Footer';

import DiarySection from '../sections/DiarySection';
import HeroSection from '../sections/HeroSection';
import MobileStickyButton from '../sections/MobileStickyButton';
import NewcomerSection from '../sections/NewcomerSection';
import PriceSection from '../sections/PriceSection';

import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';

interface YokohamaPageProps {
  config: StoreTopPageConfig | null;
}

export default function YokohamaPage({ config }: YokohamaPageProps) {
  return (
    <div className="selection:bg-primary-100 selection:text-primary-800 relative min-h-screen font-sans text-slate-600">
      <HeroSection config={config?.hero} />
      <ConceptSection config={config?.concept} />
      <CampaignSection config={config?.campaign} />
      <DiarySection config={config?.diary} />
      <CastSection config={config?.cast} />
      <NewcomerSection config={config?.newcomer} />
      <PriceSection config={config?.price} />
      <FlowSection config={config?.flow} />
      <FAQSection config={config?.faq} />
      <Footer config={config?.footer} />
      <MobileStickyButton />
    </div>
  );
}
