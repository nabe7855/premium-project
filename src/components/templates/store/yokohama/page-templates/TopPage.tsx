'use client';
import CampaignSection from '../sections/CampaignSection';
import CastSection from '../sections/CastSection';
import ConceptSection from '../sections/ConceptSection';
import FAQSection from '../sections/FAQSection';
import FlowSection from '../sections/FlowSection';
import Footer from '../sections/Footer';
import Header from '../sections/Header';

import BeginnerGuideBanner from '../sections/BeginnerGuideBanner';
import DiarySection from '../sections/DiarySection';
import HeroSection from '../sections/HeroSection';
import MobileStickyButton from '../sections/MobileStickyButton';
import NewcomerSection from '../sections/NewcomerSection';
import PriceSection from '../sections/PriceSection';
import QuickAccessMenu from '../sections/QuickAccessMenu';

import { PageData } from '@/components/admin/news/types';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';

interface YokohamaPageProps {
  config: StoreTopPageConfig | null;
  newsPages?: PageData[];
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

export default function YokohamaPage({
  config,
  newsPages,
  isEditing,
  onUpdate,
  onImageUpload,
}: YokohamaPageProps) {
  return (
    <div className="selection:bg-primary-100 selection:text-primary-800 relative min-h-screen font-sans text-slate-600">
      <Header
        config={config?.header}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      <HeroSection
        config={config?.hero}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      <BeginnerGuideBanner />
      <QuickAccessMenu />
      <ConceptSection
        config={config?.concept}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      <CampaignSection
        config={config?.campaign}
        newsPages={newsPages}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      <DiarySection
        config={config?.diary}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      <CastSection
        config={config?.cast}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      <NewcomerSection
        config={config?.newcomer}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      <PriceSection isEditing={isEditing} />
      <FlowSection isEditing={isEditing} />
      <FAQSection config={config?.faq} isEditing={isEditing} />
      <Footer
        config={config?.footer}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      {!isEditing && <MobileStickyButton />}
    </div>
  );
}
