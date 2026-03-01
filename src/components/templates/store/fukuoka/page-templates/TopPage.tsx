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
import { TodayCast } from '@/lib/getTodayCastsByStore';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';

interface FukuokaPageProps {
  config: StoreTopPageConfig | null;
  newsPages?: PageData[];
  todayCasts?: TodayCast[];
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
  hideHeader?: boolean;
  storeSlug?: string;
}

export default function FukuokaPage({
  config,
  newsPages,
  todayCasts,
  isEditing,
  onUpdate,
  onImageUpload,
  hideHeader,
  storeSlug,
}: FukuokaPageProps) {
  // 設定がない場合はデフォルト値を使用
  const safeConfig = config || undefined;

  return (
    <div className="selection:bg-primary-100 selection:text-primary-800 relative min-h-screen font-sans text-slate-600">
      {!hideHeader && (!safeConfig || safeConfig.header.isVisible || isEditing) && (
        <Header
          config={safeConfig?.header}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      )}
      {(!safeConfig || safeConfig.hero.isVisible || isEditing) && (
        <HeroSection
          config={safeConfig?.hero}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      )}
      <BeginnerGuideBanner />
      {(!safeConfig || safeConfig.quickAccess.isVisible || isEditing) && (
        <QuickAccessMenu
          config={safeConfig?.quickAccess}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      )}
      {(!safeConfig || safeConfig.concept.isVisible || isEditing) && (
        <ConceptSection
          config={safeConfig?.concept}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      )}
      {(!safeConfig || safeConfig.campaign.isVisible || isEditing) && (
        <CampaignSection
          config={safeConfig?.campaign}
          newsPages={newsPages}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      )}
      {(!safeConfig || safeConfig.diary.isVisible || isEditing) && (
        <DiarySection
          config={safeConfig?.diary}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      )}
      {(!safeConfig || safeConfig.cast.isVisible || isEditing) && (
        <CastSection
          config={safeConfig?.cast}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
          storeSlug={storeSlug}
          todayCasts={todayCasts}
        />
      )}
      {(!safeConfig || safeConfig.newcomer.isVisible || isEditing) && (
        <NewcomerSection
          config={safeConfig?.newcomer}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      )}
      {(!safeConfig || safeConfig.price.isVisible || isEditing) && (
        <PriceSection config={safeConfig?.price} isEditing={isEditing} onUpdate={onUpdate} />
      )}
      {(!safeConfig || safeConfig.flow.isVisible || isEditing) && (
        <FlowSection config={safeConfig?.flow} isEditing={isEditing} onUpdate={onUpdate} />
      )}
      {(!safeConfig || safeConfig.faq.isVisible || isEditing) && (
        <FAQSection config={safeConfig?.faq} isEditing={isEditing} onUpdate={onUpdate} />
      )}
      <Footer
        config={safeConfig?.footer}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      {!isEditing && <MobileStickyButton />}
    </div>
  );
}
