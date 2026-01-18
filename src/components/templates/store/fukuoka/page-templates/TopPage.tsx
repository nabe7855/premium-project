'use client';
import CampaignSection from '../sections/CampaignSection';
import CastSection from '../sections/CastSection';
import ConceptSection from '../sections/ConceptSection';
import FlowSection from '../sections/FlowSection';
import Footer from '../sections/Footer';

import DiarySection from '../sections/DiarySection';
import HeroSection from '../sections/HeroSection';
import MobileStickyButton from '../sections/MobileStickyButton';
import NewcomerSection from '../sections/NewcomerSection';
import PriceSection from '../sections/PriceSection';

import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';

interface FukuokaPageProps {
  config: StoreTopPageConfig | null;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

export default function FukuokaPage({
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}: FukuokaPageProps) {
  // 設定がない場合はデフォルト値を使用
  const safeConfig = config || undefined;

  return (
    <div className="selection:bg-primary-100 selection:text-primary-800 relative min-h-screen font-sans text-slate-600">
      {(!safeConfig || safeConfig.hero.isVisible || isEditing) && (
        <HeroSection
          config={safeConfig?.hero}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
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
