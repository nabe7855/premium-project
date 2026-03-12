'use client';

import { PageData } from '@/components/admin/news/types';
import CommonHeader from '@/components/sections/layout/Header';
import NewsNavigation from '@/components/templates/news/NewsNavigation';
import NewsPageRenderer from '@/components/templates/news/NewsPageRenderer';
import SNSProfile from '@/components/templates/news/SNSProfile';
import {
  default as CommonFooter,
  default as FukuokaFooter,
} from '@/components/templates/store/fukuoka/sections/Footer';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import MobileStickyButton from '@/components/templates/store/fukuoka/sections/MobileStickyButton';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import YokohamaMobileStickyButton from '@/components/templates/store/yokohama/sections/MobileStickyButton';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import React from 'react';

interface NewsDetailClientProps {
  page: PageData;
  storeSlug: string;
  template: string;
  config: StoreTopPageConfig;
  prevPage?: PageData;
  nextPage?: PageData;
  relatedPages: PageData[];
  recommendedPages: PageData[];
}

const NewsDetailClient: React.FC<NewsDetailClientProps> = ({
  page,
  storeSlug,
  template,
  config,
  prevPage,
  nextPage,
  relatedPages,
  recommendedPages,
}) => {
  const renderHeader = () => {
    switch (template) {
      case 'fukuoka':
        return <FukuokaHeader config={config.header} />;
      case 'yokohama':
        return <YokohamaHeader config={config.header} />;
      default:
        return <CommonHeader config={config.header} />;
    }
  };

  const renderFooter = () => {
    switch (template) {
      case 'fukuoka':
        return <FukuokaFooter config={config.footer} />;
      case 'yokohama':
        return <YokohamaFooter config={config.footer} />;
      default:
        return <CommonFooter config={config.footer} />;
    }
  };

  const renderMobileStickyButton = () => {
    switch (template) {
      case 'fukuoka':
        return <MobileStickyButton />;
      case 'yokohama':
        return <YokohamaMobileStickyButton />;
      default:
        return <MobileStickyButton />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderHeader()}

      {/* Spacer for fixed header */}
      <div className="h-[70px] md:h-[81px]" />

      <main className="min-h-screen">
        <NewsPageRenderer page={page} />
        <NewsNavigation
          currentPage={page}
          prevPage={prevPage}
          nextPage={nextPage}
          relatedPages={relatedPages}
          recommendedPages={recommendedPages}
          storeSlug={storeSlug}
        />
        <SNSProfile config={config.snsProfile} />
      </main>

      {renderFooter()}
      {renderMobileStickyButton()}
    </div>
  );
};

export default NewsDetailClient;
