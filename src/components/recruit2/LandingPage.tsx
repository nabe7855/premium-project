import React from 'react';
import AchievementsAndLifestyle from './sections/AchievementsAndLifestyle';
import Benefits from './sections/Benefits';
import BrandingSupport from './sections/BrandingSupport';
import ComicSlider from './sections/ComicSlider';
import Comparison from './sections/Comparison';
import FAQ from './sections/FAQ';
import Flow from './sections/Flow';
import FukuokaReason from './sections/FukuokaReason';
import HeroCollage from './sections/HeroCollage';
import IdealCandidate from './sections/IdealCandidate';
import Philosophy from './sections/Philosophy';
import Trust from './sections/Trust';

export interface LandingPageConfig {
  hero: {
    mainHeading?: string;
    subHeading?: string;
    isVisible: boolean;
    heroImage?: string;
    openCastImage?: string;
  };
  fukuoka?: {
    backgroundImage?: string;
  };
  branding?: {
    images?: Record<string, string>;
  };
  achievements?: {
    castImages?: Record<string, string>;
  };
  comic?: {
    slides?: any[];
  };
  [key: string]: any;
}

interface LandingPageProps {
  onOpenChat: () => void;
  onOpenForm: () => void;
  config?: LandingPageConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onOpenChat,
  onOpenForm,
  config,
  isEditing = false,
  onUpdate,
}) => {
  // デフォルト設定（既存のハードコード値があればここでマージ、またはコンポーネント側でデフォルトを持つ）

  return (
    <div className="overflow-hidden bg-slate-50">
      {/* Hero Section */}
      {(!config || config.hero?.isVisible !== false) && (
        <div className="group relative">
          {isEditing && (
            <div className="absolute right-2 top-2 z-50">
              <button
                onClick={() => onUpdate?.('hero', 'isVisible', false)}
                className="rounded bg-red-500 px-2 py-1 text-xs text-white shadow"
              >
                非表示にする
              </button>
            </div>
          )}
          <HeroCollage
            onOpenChat={onOpenChat}
            mainHeading={config?.hero?.mainHeading}
            subHeading={config?.hero?.subHeading}
            heroImage={config?.hero?.heroImage}
            openCastImage={config?.hero?.openCastImage}
            isEditing={isEditing}
            onUpdate={(key, value) => onUpdate?.('hero', key, value)}
          />
        </div>
      )}
      <Philosophy />
      <FukuokaReason
        isEditing={isEditing}
        onUpdate={(key, value) => onUpdate?.('fukuoka', key, value)}
        backgroundImage={config?.fukuoka?.backgroundImage}
      />
      <div id="trust">
        <Trust />
      </div>
      <div id="achievements">
        <AchievementsAndLifestyle
          isEditing={isEditing}
          onUpdate={(key, value) => onUpdate?.('achievements', key, value)}
          castImages={config?.achievements?.castImages}
        />
      </div>
      <div id="comic">
        <ComicSlider
          isEditing={isEditing}
          onUpdate={(key, value) => onUpdate?.('comic', key, value)}
          slides={config?.comic?.slides}
        />
      </div>
      <div id="benefits">
        <Benefits />
      </div>
      <div id="comparison">
        <Comparison />
      </div>
      <div id="special">
        <BrandingSupport
          isEditing={isEditing}
          onUpdate={(key, value) => onUpdate?.('branding', key, value)}
          brandingImages={config?.branding?.images}
        />
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
