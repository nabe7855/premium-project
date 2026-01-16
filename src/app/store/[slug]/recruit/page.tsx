'use client';
import { getRecruitPageConfig } from '@/actions/recruit';
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

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);

  const { slug } = useParams() as { slug: string };
  const [config, setConfig] = useState<LandingPageConfig | undefined>();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Fetch config on mount
  useEffect(() => {
    if (!slug) return;
    const fetchConfig = async () => {
      try {
        const result = await getRecruitPageConfig(slug);
        if (result.success && result.config) {
          setConfig(result.config as LandingPageConfig);
        }
      } catch (e) {
        console.error('Failed to fetch recruit config:', e);
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

  return (
    <div
      className={`flex min-h-screen flex-col ${isChatOpen || isFormOpen || isSimulationOpen ? 'overflow-hidden' : ''}`}
    >
      <Header onOpenForm={openForm} />
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={<LandingPage onOpenChat={openChat} onOpenForm={openForm} config={config} />}
          />
          <Route path="/form-quick" element={<QuickForm />} />
          <Route path="/form-full" element={<FullForm />} />
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

      <Chatbot isOpen={isChatOpen} onClose={closeChat} />
      <ApplicationModal isOpen={isFormOpen} onClose={closeForm} />
      <IncomeSimulation isOpen={isSimulationOpen} onClose={closeSimulation} />
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
