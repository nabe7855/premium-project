'use client';

import { PageData } from '@/components/admin/news/types';
import { BannerSlideSection } from '@/components/sections/BannerSlideSection';
import Header from '@/components/sections/layout/Header';
import AIMatchingSection from '@/components/sections/store/AIMatchingSection';
import CastSliderSection, { TodayCast } from '@/components/sections/store/CastSliderSection';
import ClosingCTA from '@/components/sections/store/ClosingCTA';
import DiarySection from '@/components/sections/store/DiarySection';
import EventSection from '@/components/sections/store/EventSection';
import HeroSection from '@/components/sections/store/HeroSection';
import MediaSection from '@/components/sections/store/MediaSection';
import NewcomerSection from '@/components/sections/store/NewcomerSection';
import PlanSection from '@/components/sections/store/PlanSection';
import ReviewSection from '@/components/sections/store/ReviewSection';
import VideoSection from '@/components/sections/store/VideoSection';
import { TestimonialSection } from '@/components/sections/TestimonialSection';
import { Store } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig'; // Added import for DEFAULT_STORE_TOP_CONFIG
import Footer from '../../fukuoka/sections/Footer';

interface CommonStorePageProps {
  store: Store;
  todayCasts: TodayCast[];
  structuredData: any;
  topConfig?: StoreTopPageConfig | null;
  newsPages?: PageData[];
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

export default function CommonStorePage({
  store,
  todayCasts,
  structuredData,
  topConfig,
  newsPages,
  isEditing,
  onUpdate,
  onImageUpload,
}: CommonStorePageProps) {
  // 安全のためのnullチェック
  if (!store) {
    return null;
  }

  const safeConfig = topConfig ?? DEFAULT_STORE_TOP_CONFIG;

  return (
    <div className={`min-h-screen ${store.theme.bodyClass}`}>
      {(safeConfig.header.isVisible || isEditing) && (
        <Header
          config={safeConfig.header}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main>
        <HeroSection />
        <TestimonialSection />
        <BannerSlideSection />
        <CastSliderSection casts={todayCasts} />
        <NewcomerSection />
        <EventSection />
        <DiarySection />
        <MediaSection />
        <VideoSection />
        <ReviewSection />
        <PlanSection />
        <AIMatchingSection />
        <ClosingCTA />
      </main>
      <Footer config={topConfig?.footer} />
    </div>
  );
}
