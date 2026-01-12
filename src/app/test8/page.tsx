'use client';
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from '@/components/recruit2/LandingPage';
import QuickForm from '@/components/recruit2/QuickForm';
import FullForm from '@/components/recruit2/FullForm';
import ThanksPage from '@/components/recruit2/ThanksPage';
import Header from '@/components/recruit2/Header';
import Footer from '@/components/recruit2/Footer';
import FloatingCTA from '@/components/recruit2/FloatingCTA';
import Chatbot from '@/components/recruit2/Chatbot';

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <div className={`flex flex-col min-h-screen ${isChatOpen ? 'overflow-hidden' : ''}`}>
      <Header onOpenChat={openChat} />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<LandingPage onOpenChat={openChat} />} />
          <Route path="/form-quick" element={<QuickForm />} />
          <Route path="/form-full" element={<FullForm />} />
          <Route path="/thanks" element={<ThanksPage />} />
        </Routes>
      </main>
      <Footer />
      {location.pathname === '/' && <FloatingCTA onOpenChat={openChat} />}
      
      <Chatbot isOpen={isChatOpen} onClose={closeChat} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
