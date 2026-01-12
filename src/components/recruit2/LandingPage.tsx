
import React from 'react';
import Hero from './sections/Hero';
import Trust from './sections/Trust';
import ComicSlider from './sections/ComicSlider';
import Benefits from './sections/Benefits';
import Income from './sections/Income';
import BrandingSupport from './sections/BrandingSupport';
import IdealCandidate from './sections/IdealCandidate';
import Flow from './sections/Flow';
import FAQ from './sections/FAQ';

interface LandingPageProps {
  onOpenChat: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onOpenChat }) => {
  return (
    <div className="bg-slate-50 overflow-hidden">
      <Hero onOpenChat={onOpenChat} />
      <div id="trust"><Trust /></div>
      <div id="comic"><ComicSlider /></div>
      <div id="benefits"><Benefits /></div>
      <div id="income"><Income /></div>
      <div id="special"><BrandingSupport /></div>
      <div id="ideal"><IdealCandidate /></div>
      <div id="flow"><Flow /></div>
      <div id="qa"><FAQ /></div>
      
      {/* Final CTA Section */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight">
            あなたの人生を変える一歩を、<br className="hidden md:block"/>ここから始めませんか？
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            私たちは、あなたの可能性を信じています。<br/>
            誠実な一歩が、想像もしなかった未来を創り出します。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={onOpenChat}
              className="bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <span>チャットでまずは話を聞いてみる</span>
            </button>
            <button 
              onClick={onOpenChat}
              className="bg-amber-600 hover:bg-amber-700 text-white py-5 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center"
            >
              <span>30秒でカンタン応募してみる</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
