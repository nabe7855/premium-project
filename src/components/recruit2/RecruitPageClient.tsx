'use client';

import ScrollToTopButton from '@/components/common/ScrollToTopButton';
import ApplicationModal from '@/components/recruit2/ApplicationModal';
import Chatbot from '@/components/recruit2/Chatbot';
import DiagnosticModal from '@/components/recruit2/DiagnosticModal';
import FloatingCTA from '@/components/recruit2/FloatingCTA';
import Footer from '@/components/recruit2/Footer';
import FullForm from '@/components/recruit2/FullForm';
import Header from '@/components/recruit2/Header';
import IncomeSimulation from '@/components/recruit2/IncomeSimulation';
import LandingPage, { LandingPageConfig } from '@/components/recruit2/LandingPage';
import QuickForm from '@/components/recruit2/QuickForm';
import ThanksPage from '@/components/recruit2/ThanksPage';
import { STOCK_RECRUIT_CONFIG } from '@/components/recruit2/constants';
import { stores } from '@/data/stores';
import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';

interface RecruitPageClientProps {
  initialData: {
    config: LandingPageConfig | undefined;
    storeInfo: any;
    topConfig: any;
  };
  slug: string;
}

const AppContent: React.FC<RecruitPageClientProps> = ({ initialData, slug }) => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  const [config, setConfig] = useState<LandingPageConfig | undefined>(initialData.config);
  const [storeInfo, setStoreInfo] = useState<any>(initialData.storeInfo);
  const [topConfig, setTopConfig] = useState<any>(initialData.topConfig);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);
  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);
  const openSimulation = () => setIsSimulationOpen(true);
  const closeSimulation = () => setIsSimulationOpen(false);
  const openDiagnostic = () => setIsDiagnosticOpen(true);
  const closeDiagnostic = () => setIsDiagnosticOpen(false);

  const storeData = stores[slug];
  const dynamicStoreName = storeInfo?.name || storeData?.displayName || '店舗名';

  const localizeDefaults = (obj: any): any => {
    if (typeof obj === 'string') {
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

  const fullMergedConfig: LandingPageConfig = {
    ...localizedStock,
    ...config,
    general: {
      ...localizedStock.general,
      ...config?.general,
      storeName:
        config?.general?.storeName && config?.general?.storeName !== '福岡店'
          ? config.general.storeName
          : dynamicStoreName,
    },
    hero: { ...localizedStock.hero, ...config?.hero },
    fukuoka: { ...localizedStock.fukuoka, ...config?.fukuoka },
    trust: { ...localizedStock.trust, ...config?.trust },
    openCast: { ...localizedStock.openCast, ...config?.openCast },
    benefits: { ...localizedStock.benefits, ...config?.benefits },
    flow: { ...localizedStock.flow, ...config?.flow },
    faq: { ...localizedStock.faq, ...config?.faq },
    income: { ...localizedStock.income, ...config?.income },
  };

  return (
    <div
      className={`flex min-h-screen flex-col ${isChatOpen || isFormOpen || isSimulationOpen || isDiagnosticOpen ? 'overflow-hidden' : ''}`}
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
      <Footer
        storeName={storeInfo?.name || fullMergedConfig.general?.storeName}
        phone={storeInfo?.phone || topConfig?.header?.phoneNumber}
        receptionHours={topConfig?.header?.receptionHours}
        address={storeInfo?.address}
      />
      {location.pathname === '/' && (
        <FloatingCTA
          onOpenChat={openChat}
          onOpenForm={openForm}
          onOpenDiagnostic={openDiagnostic}
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
      <DiagnosticModal isOpen={isDiagnosticOpen} onClose={closeDiagnostic} />
      <ScrollToTopButton />
    </div>
  );
};

export default function RecruitPageClient(props: RecruitPageClientProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return <div className="min-h-screen bg-slate-950" />;
  return (
    <HashRouter>
      <AppContent {...props} />
    </HashRouter>
  );
}
