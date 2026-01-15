'use client';
import ApplicationModal from '@/components/recruit2/ApplicationModal';
import Chatbot from '@/components/recruit2/Chatbot';
import FloatingCTA from '@/components/recruit2/FloatingCTA';
import Footer from '@/components/recruit2/Footer';
import FullForm from '@/components/recruit2/FullForm';
import Header from '@/components/recruit2/Header';
import LandingPage from '@/components/recruit2/LandingPage';
import QuickForm from '@/components/recruit2/QuickForm';
import ThanksPage from '@/components/recruit2/ThanksPage';
import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  return (
    <div
      className={`flex min-h-screen flex-col ${isChatOpen || isFormOpen ? 'overflow-hidden' : ''}`}
    >
      <Header onOpenForm={openForm} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage onOpenChat={openChat} onOpenForm={openForm} />} />
          <Route path="/form-quick" element={<QuickForm />} />
          <Route path="/form-full" element={<FullForm />} />
          <Route path="/thanks" element={<ThanksPage />} />
        </Routes>
      </main>
      <Footer />
      {location.pathname === '/' && <FloatingCTA onOpenChat={openChat} onOpenForm={openForm} />}

      <Chatbot isOpen={isChatOpen} onClose={closeChat} />
      <ApplicationModal isOpen={isFormOpen} onClose={closeForm} />
    </div>
  );
};

const App: React.FC = () => {
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
};

export default App;
