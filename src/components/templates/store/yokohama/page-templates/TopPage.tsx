'use client';
import CampaignSection from '../sections/CampaignSection';
import CastSection from '../sections/CastSection';
import ConceptSection from '../sections/ConceptSection';
import FAQSection from '../sections/FAQSection';
import FlowSection from '../sections/FlowSection';
import Footer from '../sections/Footer';
import Header from '../sections/Header';

import ReviewSection from '@/components/sections/store/ReviewSection';
import SNSProfile from '@/components/templates/news/SNSProfile';
import BeginnerGuideBanner from '../sections/BeginnerGuideBanner';
import DiarySection from '../sections/DiarySection';
import HeroSection from '../sections/HeroSection';
import NewcomerSection from '../sections/NewcomerSection';
import PriceSection from '../sections/PriceSection';
import QuickAccessMenu from '../sections/QuickAccessMenu';
import { PageData } from '@/components/admin/news/types';
import { TodayCast } from '@/lib/getTodayCastsByStore';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';

interface YokohamaPageProps {
  config: StoreTopPageConfig | null;
  newsPages?: PageData[];
  todayCasts?: TodayCast[];
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
  hideHeader?: boolean;
  storeSlug?: string;
}

export default function YokohamaPage({
  config,
  newsPages,
  todayCasts,
  isEditing,
  onUpdate,
  onImageUpload,
  hideHeader,
  storeSlug,
}: YokohamaPageProps) {
  return (
    <div className="selection:bg-primary-100 selection:text-primary-800 relative min-h-screen font-sans text-slate-600">
      {!hideHeader && (!config || config.header.isVisible || isEditing) && (
        <Header
          config={config?.header}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      )}
      <HeroSection
        config={config?.hero}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      <>
        <h2 className="sr-only">初めての女性用風俗ガイド｜{storeSlug === 'yokohama' ? '横浜' : ''}で安心して利用するには</h2>
        <BeginnerGuideBanner
          config={config?.beginnerGuide}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      </>
      {(!config || config.quickAccess.isVisible || isEditing) && (
        <QuickAccessMenu config={config?.quickAccess} isEditing={isEditing} onUpdate={onUpdate} />
      )}
      <>
        <h2 className="sr-only">ストロベリーボーイズ{storeSlug === 'yokohama' ? '横浜' : ''}店が選ばれる5つの理由</h2>
        <ConceptSection
          config={config?.concept}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      </>
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
        storeSlug={storeSlug}
      />
      <>
        <h2 className="sr-only">在籍セラピスト一覧（{storeSlug === 'yokohama' ? '横浜店' : ''}）</h2>
        <CastSection
          config={config?.cast}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
          storeSlug={storeSlug}
        />
      </>
      <NewcomerSection
        config={config?.newcomer}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
        storeSlug={storeSlug}
      />
      <>
        <h2 className="sr-only">料金プラン｜{storeSlug === 'yokohama' ? '横浜' : ''}の女性用風俗で明朗会計</h2>
        <PriceSection
          config={config?.price}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      </>
      <>
        <h2 className="sr-only">ご利用の流れ</h2>
        <FlowSection
          config={config?.flow}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      </>
      <ReviewSection />
      <>
        <h2 className="sr-only">よくあるご質問（{storeSlug === 'yokohama' ? '横浜店FAQ' : 'FAQ'}）</h2>
        <FAQSection
          config={config?.faq}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      </>
      <SNSProfile
        config={config?.snsProfile}
        isEditing={isEditing}
        onUpdate={(key, value) => onUpdate?.('snsProfile', key, value)}
        onImageUpload={(file) => onImageUpload?.('snsProfile', file, undefined, 'iconUrl')}
      />
      <>
        <h2 className="sr-only">アクセス｜{storeSlug === 'yokohama' ? '横浜駅から即日出張' : '即日出張対応'}</h2>
        <Footer
          config={config?.footer}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      </>
    </div>
  );
}
