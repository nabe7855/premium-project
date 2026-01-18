'use client';

import { BannerSlideSection } from '@/components/sections/BannerSlideSection';
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
import { StoreProvider } from '@/contexts/StoreContext';
import { Store } from '@/lib/store/store-data';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import Footer from '../../fukuoka/sections/Footer';

interface CommonStorePageProps {
  store: Store;
  todayCasts: TodayCast[];
  structuredData: any;
  topConfig?: StoreTopPageConfig | null;
}

export default function CommonStorePage({
  store,
  todayCasts,
  structuredData,
  topConfig,
}: CommonStorePageProps) {
  // 安全のためのnullチェック
  if (!store) {
    return null;
  }

  return (
    <StoreProvider store={store}>
      <div className={`min-h-screen ${store.theme.bodyClass}`}>
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
    </StoreProvider>
  );
}
