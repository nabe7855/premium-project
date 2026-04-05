'use client';
import dynamic from 'next/dynamic';
import Header from '../sections/Header';
import HeroSection from '../sections/HeroSection';
import BeginnerGuideBanner from '../sections/BeginnerGuideBanner';

const QuickAccessMenu = dynamic(() => import('../sections/QuickAccessMenu'));
const ConceptSection = dynamic(() => import('../sections/ConceptSection'));
const CampaignSection = dynamic(() => import('../sections/CampaignSection'));
const DiarySection = dynamic(() => import('../sections/DiarySection'));
const CastSection = dynamic(() => import('../sections/CastSection'));
const NewcomerSection = dynamic(() => import('../sections/NewcomerSection'));
const PriceSection = dynamic(() => import('../sections/PriceSection'));
const FlowSection = dynamic(() => import('../sections/FlowSection'));
const ReviewSection = dynamic(() => import('@/components/sections/store/ReviewSection'));
const FAQSection = dynamic(() => import('../sections/FAQSection'));
const SNSProfile = dynamic(() => import('@/components/templates/news/SNSProfile'));
const Footer = dynamic(() => import('../sections/Footer'));
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
        <>
          <Header
            config={safeConfig?.header}
            isEditing={isEditing}
            onUpdate={onUpdate}
            onImageUpload={onImageUpload}
          />
          {/* Header Spacer - Match the actual header height (48px + py-2*2 = 64px) */}
          <div className="h-[64px] md:h-[65px]" />
        </>
      )}
      {(!safeConfig || safeConfig.hero.isVisible || isEditing) && (
        <HeroSection
          config={safeConfig?.hero}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
          storeSlug={storeSlug}
        />
      )}
      <BeginnerGuideBanner
        config={safeConfig?.beginnerGuide}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
        sectionName="beginnerGuide"
      />
      <BeginnerGuideBanner
        config={safeConfig?.beginnerGuide2}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
        sectionName="beginnerGuide2"
      />
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
          storeSlug={storeSlug}
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
          storeSlug={storeSlug}
        />
      )}
      {(!safeConfig || safeConfig.price.isVisible || isEditing) && (
        <PriceSection
          config={safeConfig?.price}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      )}
      {(!safeConfig || safeConfig.flow.isVisible || isEditing) && (
        <FlowSection
          config={safeConfig?.flow}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      )}
      <ReviewSection />
      {(!safeConfig || safeConfig.faq.isVisible || isEditing) && (
        <FAQSection
          config={safeConfig?.faq}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      )}
      <SNSProfile
        config={safeConfig?.snsProfile}
        isEditing={isEditing}
        onUpdate={(key, value) => onUpdate?.('snsProfile', key, value)}
        onImageUpload={(file) => onImageUpload?.('snsProfile', file, undefined, 'iconUrl')}
      />
      <Footer
        config={safeConfig?.footer}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
    </div>
  );
}
