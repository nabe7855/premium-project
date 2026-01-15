import React from 'react';
import Achievements from './sections/Achievements';
import Benefits from './sections/Benefits';
import BrandingSupport from './sections/BrandingSupport';
import ComicSlider from './sections/ComicSlider';
import FAQ from './sections/FAQ';
import Flow from './sections/Flow';
import HeroCollage from './sections/HeroCollage';
import IdealCandidate from './sections/IdealCandidate';
import Income from './sections/Income';
import Trust from './sections/Trust';

interface LandingPageProps {
  onOpenChat: () => void;
  onOpenForm: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onOpenChat, onOpenForm }) => {
  return (
    <div className="overflow-hidden bg-slate-50">
      <HeroCollage onOpenChat={onOpenChat} />
      <div id="trust">
        <Trust />
      </div>
      <div id="achievements">
        <Achievements />
      </div>
      <div id="comic">
        <ComicSlider />
      </div>
      <div id="benefits">
        <Benefits />
      </div>
      <div id="income">
        <Income />
      </div>
      <div id="special">
        <BrandingSupport />
      </div>
      <div id="ideal">
        <IdealCandidate />
      </div>
      <div id="flow">
        <Flow />
      </div>
      <div id="qa">
        <FAQ />
      </div>

      {/* Final CTA Section */}
      <section className="bg-slate-900 py-24 text-center text-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-8 font-serif text-3xl font-bold leading-tight md:text-5xl">
            あなたの人生を変える一歩を、
            <br className="hidden md:block" />
            ここから始めませんか？
          </h2>
          <p className="mb-12 text-lg text-slate-400">
            私たちは、あなたの可能性を信じています。
            <br />
            誠実な一歩が、想像もしなかった未来を創り出します。
          </p>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                onClick={onOpenChat}
                className="group relative flex items-center justify-center space-x-3 rounded-2xl bg-green-600 py-6 text-lg font-bold text-white shadow-xl transition-all hover:bg-green-700 hover:shadow-green-900/40 active:scale-95"
              >
                <span className="text-2xl transition-transform group-hover:scale-110">💬</span>
                <span>チャットでまずは話を聞いてみる</span>
              </button>
              <button
                onClick={onOpenChat}
                className="group relative flex items-center justify-center space-x-3 rounded-2xl bg-amber-600 py-6 text-lg font-bold text-white shadow-xl transition-all hover:bg-amber-700 hover:shadow-amber-900/40 active:scale-95"
              >
                <span className="text-2xl transition-transform group-hover:scale-110">⚡</span>
                <span>30秒でカンタン応募してみる</span>
              </button>
            </div>

            <button
              onClick={onOpenForm}
              className="mx-auto flex w-full max-w-md items-center justify-center space-x-3 rounded-2xl border-2 border-slate-700 bg-transparent py-5 text-lg font-bold text-white transition-all hover:border-amber-500 hover:bg-amber-500/10 active:scale-95"
            >
              <span className="text-xl">📝</span>
              <span>応募フォームから応募する</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
