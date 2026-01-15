"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/test2/Header';
import MenuOverlay from '@/components/test2/MenuOverlay';
import { COLORS } from '@/data/test2';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.pastelPink }}>
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className={`flex-1 transition-opacity duration-300 ${isMenuOpen ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-6 text-center">
          <div className="mb-6 opacity-20">
             <div className="w-16 h-16 border-4 border-[#D14D72] rounded-full flex items-center justify-center">
                <span className="text-4xl">🍓</span>
             </div>
          </div>
          <p className="text-[#4A2B2F] text-sm font-medium tracking-wide">
            メニューからサービスを選択してください。
          </p>
          <p className="text-[#C5A059] text-[10px] mt-2 font-bold uppercase tracking-widest">
            Strawberry Boys Premium
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
