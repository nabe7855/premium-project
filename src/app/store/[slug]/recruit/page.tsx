'use client';
import { getRecruitPageConfig } from '@/actions/recruit';
import ScrollToTopButton from '@/components/common/ScrollToTopButton';
import ApplicationModal from '@/components/recruit2/ApplicationModal';
import Chatbot from '@/components/recruit2/Chatbot';
import FloatingCTA from '@/components/recruit2/FloatingCTA';
import Footer from '@/components/recruit2/Footer';
import FullForm from '@/components/recruit2/FullForm';
import Header from '@/components/recruit2/Header';
import LandingPage, { LandingPageConfig } from '@/components/recruit2/LandingPage';
import QuickForm from '@/components/recruit2/QuickForm';
import ThanksPage from '@/components/recruit2/ThanksPage';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';

import IncomeSimulation from '@/components/recruit2/IncomeSimulation';
import { STOCK_RECRUIT_CONFIG } from '@/components/recruit2/constants';
import { stores } from '@/data/stores';

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);

  const { slug } = useParams() as { slug: string };
  const [config, setConfig] = useState<LandingPageConfig | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Fetch config on mount
  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }
    const fetchConfig = async () => {
      try {
        const result = await getRecruitPageConfig(slug);
        if (result.success && result.config) {
          setConfig(result.config as LandingPageConfig);
        }
      } catch (e) {
        console.error('Failed to fetch recruit config:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, [slug]);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const openSimulation = () => setIsSimulationOpen(true);
  const closeSimulation = () => setIsSimulationOpen(false);

  const storeData = stores[slug];
  const dynamicStoreName = storeData?.displayName || '店舗名';

  // Helper to deep replace "福岡" with dynamicStoreName for default values
  const localizeDefaults = (obj: any): any => {
    if (typeof obj === 'string') {
      // Don't replace if it looks like a path or an image file
      const isPath = obj.startsWith('/');
      const isImage = /\.(png|jpe?g|webp|svg)$/i.test(obj);
      if (isPath || isImage) return obj;

      return obj.replaceAll('福岡', dynamicStoreName);
    }
    if (Array.isArray(obj)) return obj.map(localizeDefaults);
    if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, localizeDefaults(v)]));
    }
    return obj;
  };

  const localizedStock = localizeDefaults(STOCK_RECRUIT_CONFIG);

  const mergedConfig: LandingPageConfig = {
    ...(config || ({} as LandingPageConfig)),
    general: {
      ...localizedStock.general,
      ...config?.general,
      storeName:
        config?.general?.storeName && config?.general?.storeName !== '福岡店'
          ? config.general.storeName
          : dynamicStoreName,
    },
    fukuoka: {
      ...localizedStock.fukuoka,
      ...config?.fukuoka,
    },
    hero: {
      ...localizedStock.hero,
      ...config?.hero,
    },
    // Note: Other sections will still use STOCK_RECRUIT_CONFIG defaults
    // because LandingPage.tsx does its own merge.
    // To be thorough, we should pass localizedStock to LandingPage or merge all here.
  };

  // Ensure all sections are merged with localized defaults here to pass to LandingPage
  const fullMergedConfig: any = { ...localizedStock };
  for (const key in mergedConfig) {
    fullMergedConfig[key] = {
      ...(fullMergedConfig[key] || {}),
      ...(mergedConfig as any)[key],
    };
  }

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  return (
    <div
      className={`flex min-h-screen flex-col ${isChatOpen || isFormOpen || isSimulationOpen ? 'overflow-hidden' : ''}`}
    >
      <Header
        onOpenForm={openForm}
        groupName={fullMergedConfig.general?.groupName}
        storeName={fullMergedConfig.general?.storeName}
        pageTitleSuffix={fullMergedConfig.general?.pageTitleSuffix}
      />
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage onOpenChat={openChat} onOpenForm={openForm} config={fullMergedConfig} />
            }
          />
          <Route
            path="/form-quick"
            element={<QuickForm storeName={fullMergedConfig.general?.storeName} />}
          />
          <Route
            path="/form-full"
            element={<FullForm storeName={fullMergedConfig.general?.storeName} />}
          />
          <Route path="/thanks" element={<ThanksPage />} />
        </Routes>
      </main>
      <Footer />
      {location.pathname === '/' && (
        <FloatingCTA
          onOpenChat={openChat}
          onOpenForm={openForm}
          onOpenSimulation={openSimulation}
        />
      )}

      <Chatbot
        isOpen={isChatOpen}
        onClose={closeChat}
        storeName={fullMergedConfig.general?.storeName}
      />
      <ApplicationModal
        isOpen={isFormOpen}
        onClose={closeForm}
        storeName={fullMergedConfig.general?.storeName}
      />
      <IncomeSimulation isOpen={isSimulationOpen} onClose={closeSimulation} />
      <ScrollToTopButton />
    </div>
  );
};

export default function RecruitPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
