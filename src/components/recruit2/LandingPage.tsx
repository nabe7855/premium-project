import React from 'react';
import { STOCK_RECRUIT_CONFIG } from './constants';
import Header from './Header';
import AchievementsAndLifestyle from './sections/AchievementsAndLifestyle';
import Benefits from './sections/Benefits';
import BrandingSupport from './sections/BrandingSupport';
import CheckSheet from './sections/CheckSheet';
import ComicSlider from './sections/ComicSlider';
import Comparison from './sections/Comparison';
import FAQ from './sections/FAQ';
import Flow from './sections/Flow';
import FukuokaReason from './sections/FukuokaReason';
import HeroCollage from './sections/HeroCollage';
import MetricsGrid from './sections/MetricsGrid';

import OpenCastRecruitment from './sections/OpenCastRecruitment';
import Trust from './sections/Trust';

export interface LandingPageConfig {
  general?: {
    groupName?: string;
    storeName?: string;
    pageTitleSuffix?: string;
  };
  hero: {
    mainHeading?: string;
    subHeading?: string;
    isVisible: boolean;
    heroImage?: string;
  };
  openCast?: {
    isVisible?: boolean;
    openCastImage?: string;
  };
  fukuoka?: {
    backgroundImage?: string;
    heading?: string;
    description1?: string;
    description2?: string;
    description3?: string;
    italicText?: string;
    isVisible?: boolean;
  };
  trust?: {
    isVisible?: boolean;
  };
  achievements?: {
    castImages?: Record<string, string>;
    isVisible?: boolean;
  };
  comic?: {
    slides?: any[];
    isVisible?: boolean;
  };
  benefits?: {
    isVisible?: boolean;
  };
  comparison?: {
    isVisible?: boolean;
  };
  branding?: {
    images?: Record<string, string>;
    isVisible?: boolean;
  };
  ideal?: {
    isVisible?: boolean;
  };
  flow?: {
    isVisible?: boolean;
  };
  faq?: {
    isVisible?: boolean;
  };
  [key: string]: any;
}
interface LandingPageProps {
  onOpenChat: () => void;
  onOpenForm: () => void;
  config?: LandingPageConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onUpload?: (file: File) => Promise<string | null>;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onOpenChat,
  onOpenForm,
  config: incomingConfig,
  isEditing = false,
  onUpdate,
  onUpload,
}) => {
  // Merge incoming config with stock config. Incoming (DB) takes priority.
  // We do deep merge logic here manually for clarity.
  console.log('🖼️ LandingPage received incomingConfig:', incomingConfig);
  const config = {
    general: { ...STOCK_RECRUIT_CONFIG.general, ...incomingConfig?.general },
    hero: { ...STOCK_RECRUIT_CONFIG.hero, ...incomingConfig?.hero },
    openCast: { ...STOCK_RECRUIT_CONFIG.openCast, ...incomingConfig?.openCast },
    fukuoka: { ...STOCK_RECRUIT_CONFIG.fukuoka, ...incomingConfig?.fukuoka },
    trust: { ...STOCK_RECRUIT_CONFIG.trust, ...incomingConfig?.trust },
    achievements: { ...STOCK_RECRUIT_CONFIG.achievements, ...incomingConfig?.achievements },
    comic: { ...STOCK_RECRUIT_CONFIG.comic, ...incomingConfig?.comic },
    benefits: { ...STOCK_RECRUIT_CONFIG.benefits, ...incomingConfig?.benefits },
    comparison: { ...STOCK_RECRUIT_CONFIG.comparison, ...incomingConfig?.comparison },
    branding: { ...STOCK_RECRUIT_CONFIG.branding, ...incomingConfig?.branding },
    ideal: { ...STOCK_RECRUIT_CONFIG.ideal, ...incomingConfig?.ideal },
    flow: { ...STOCK_RECRUIT_CONFIG.flow, ...incomingConfig?.flow },
    faq: { ...STOCK_RECRUIT_CONFIG.faq, ...incomingConfig?.faq },
  };
  console.log('✅ LandingPage merged config hero:', config.hero);

  return (
    <div className="overflow-hidden bg-slate-50">
      {/* Visual Header Preview during Editing */}
      {isEditing && (
        <div className="pointer-events-none relative h-16 opacity-80">
          <Header
            onOpenForm={() => {}}
            groupName={config.general.groupName}
            storeName={config.general.storeName}
            pageTitleSuffix={config.general.pageTitleSuffix}
          />
        </div>
      )}

      {/* Hero Section */}
      {(config.hero.isVisible !== false || isEditing) && (
        <div
          className={`group relative transition-opacity duration-300 ${
            config.hero.isVisible === false ? 'opacity-40' : ''
          }`}
        >
          {isEditing && (
            <div className="absolute right-2 top-2 z-50">
              <button
                onClick={() => onUpdate?.('hero', 'isVisible', config.hero.isVisible !== false)}
                className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                  config.hero.isVisible === false
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {config.hero.isVisible === false ? '表示する' : '非表示にする'}
              </button>
            </div>
          )}
          <HeroCollage
            onOpenChat={onOpenChat}
            mainHeading={config.hero.mainHeading}
            subHeading={config.hero.subHeading}
            heroImage={config.hero.heroImage}
            stats={config.hero.stats}
            isEditing={isEditing}
            onUpdate={(key, value) => onUpdate?.('hero', key, value)}
          />
        </div>
      )}

      {/* Open Cast Recruitment Section */}
      {(config.openCast.isVisible !== false || isEditing) && (
        <div
          className={`group relative transition-opacity duration-300 ${
            config.openCast.isVisible === false ? 'opacity-40' : ''
          }`}
        >
          {isEditing && (
            <div className="absolute right-2 top-2 z-50">
              <button
                onClick={() =>
                  onUpdate?.('openCast', 'isVisible', config.openCast.isVisible !== false)
                }
                className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                  config.openCast.isVisible === false
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {config.openCast.isVisible === false ? '表示する' : '非表示にする'}
              </button>
            </div>
          )}
          <OpenCastRecruitment
            onOpenChat={onOpenChat}
            isEditing={isEditing}
            onUpdate={(key, value) => onUpdate?.('openCast', key, value)}
            openCastImage={config.openCast.openCastImage}
            benefits={config.openCast.benefits}
          />
        </div>
      )}

      {/* Fukuoka Reason Section */}
      <div
        className={`group relative transition-opacity duration-300 ${
          config?.fukuoka?.isVisible === false ? 'opacity-40' : ''
        }`}
      >
        {isEditing && (
          <div className="absolute right-2 top-2 z-50">
            <button
              onClick={() =>
                onUpdate?.('fukuoka', 'isVisible', config?.fukuoka?.isVisible === false)
              }
              className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                config?.fukuoka?.isVisible === false
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {config?.fukuoka?.isVisible === false ? '表示する' : '非表示にする'}
            </button>
          </div>
        )}
        <FukuokaReason
          isEditing={isEditing}
          onUpdate={(key, value) => onUpdate?.('fukuoka', key, value)}
          backgroundImage={config?.fukuoka?.backgroundImage}
          heading={config?.fukuoka?.heading}
          description1={config?.fukuoka?.description1}
          description2={config?.fukuoka?.description2}
          description3={config?.fukuoka?.description3}
          italicText={config?.fukuoka?.italicText}
        />
      </div>

      {/* Trust Section */}
      <div
        id="trust"
        className={`group relative transition-opacity duration-300 ${
          config?.trust?.isVisible === false ? 'opacity-40' : ''
        }`}
      >
        {isEditing && (
          <div className="absolute right-2 top-2 z-50">
            <button
              onClick={() => onUpdate?.('trust', 'isVisible', config?.trust?.isVisible === false)}
              className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                config?.trust?.isVisible === false
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {config?.trust?.isVisible === false ? '表示する' : '非表示にする'}
            </button>
          </div>
        )}
        <Trust
          config={config?.trust}
          isEditing={isEditing}
          onUpdate={(key, value) => onUpdate?.('trust', key, value)}
        />
      </div>

      {/* Achievements Section */}
      <div
        id="achievements"
        className={`group relative transition-opacity duration-300 ${
          config?.achievements?.isVisible === false ? 'opacity-40' : ''
        }`}
      >
        {isEditing && (
          <div className="absolute right-2 top-2 z-50">
            <button
              onClick={() =>
                onUpdate?.('achievements', 'isVisible', config?.achievements?.isVisible === false)
              }
              className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                config?.achievements?.isVisible === false
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {config?.achievements?.isVisible === false ? '表示する' : '非表示にする'}
            </button>
          </div>
        )}
        <AchievementsAndLifestyle
          isEditing={isEditing}
          onUpdate={(key, value) => onUpdate?.('achievements', `castImages.${key}`, value)}
          castImages={config?.achievements?.castImages}
        />
      </div>

      {/* Comic Section */}
      <div
        id="comic"
        className={`group relative transition-opacity duration-300 ${
          config?.comic?.isVisible === false ? 'opacity-40' : ''
        }`}
      >
        {isEditing && (
          <div className="absolute right-2 top-2 z-50">
            <button
              onClick={() => onUpdate?.('comic', 'isVisible', config?.comic?.isVisible === false)}
              className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                config?.comic?.isVisible === false
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {config?.comic?.isVisible === false ? '表示する' : '非表示にする'}
            </button>
          </div>
        )}
        <ComicSlider
          isEditing={isEditing}
          onUpdate={(key, value) => onUpdate?.('comic', key, value)}
          onUpload={onUpload}
          slides={config?.comic?.slides}
        />
      </div>

      {/* Benefits Section */}
      <div
        id="benefits"
        className={`group relative transition-opacity duration-300 ${
          config?.benefits?.isVisible === false ? 'opacity-40' : ''
        }`}
      >
        {isEditing && (
          <div className="absolute right-2 top-2 z-50">
            <button
              onClick={() =>
                onUpdate?.('benefits', 'isVisible', config?.benefits?.isVisible === false)
              }
              className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                config?.benefits?.isVisible === false
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {config?.benefits?.isVisible === false ? '表示する' : '非表示にする'}
            </button>
          </div>
        )}
        <Benefits
          heading={config.benefits.heading}
          description={config.benefits.description}
          points={config.benefits.points}
        />
      </div>

      {/* Comparison Section */}
      <div
        id="comparison"
        className={`group relative transition-opacity duration-300 ${
          config?.comparison?.isVisible === false ? 'opacity-40' : ''
        }`}
      >
        {isEditing && (
          <div className="absolute right-2 top-2 z-50">
            <button
              onClick={() =>
                onUpdate?.('comparison', 'isVisible', config?.comparison?.isVisible === false)
              }
              className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                config?.comparison?.isVisible === false
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {config?.comparison?.isVisible === false ? '表示する' : '非表示にする'}
            </button>
          </div>
        )}
        <Comparison />
      </div>

      {/* Check Sheet Section */}
      <div id="check">
        <CheckSheet onOpenChat={onOpenChat} />
      </div>

      {/* Flow Section */}
      <div
        id="flow"
        className={`group relative transition-opacity duration-300 ${
          config?.flow?.isVisible === false ? 'opacity-40' : ''
        }`}
      >
        {isEditing && (
          <div className="absolute right-2 top-2 z-50">
            <button
              onClick={() => onUpdate?.('flow', 'isVisible', config?.flow?.isVisible === false)}
              className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                config?.flow?.isVisible === false
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {config?.flow?.isVisible === false ? '表示する' : '非表示にする'}
            </button>
          </div>
        )}
        <Flow
          heading={config.flow.heading}
          description={config.flow.description}
          steps={config.flow.steps}
          onOpenChat={onOpenChat}
        />
      </div>

      {/* Metrics Grid Section */}
      <div
        className={`group relative transition-opacity duration-300 ${
          config?.branding?.isVisible === false ? 'opacity-40' : ''
        }`}
      >
        <MetricsGrid
          isEditing={isEditing}
          onUpdate={(key, value) => onUpdate?.('branding', `images.${key}`, value)}
          brandingImages={config?.branding?.images}
        />
      </div>

      {/* Branding Support Section */}
      <div
        id="special"
        className={`group relative transition-opacity duration-300 ${
          config?.branding?.isVisible === false ? 'opacity-40' : ''
        }`}
      >
        {isEditing && (
          <div className="absolute right-2 top-2 z-50">
            <button
              onClick={() =>
                onUpdate?.('branding', 'isVisible', config?.branding?.isVisible === false)
              }
              className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                config?.branding?.isVisible === false
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {config?.branding?.isVisible === false ? '表示する' : '非表示にする'}
            </button>
          </div>
        )}
        <BrandingSupport isEditing={isEditing} />
      </div>

      {/* FAQ Section */}
      <div
        id="qa"
        className={`group relative transition-opacity duration-300 ${
          config?.faq?.isVisible === false ? 'opacity-40' : ''
        }`}
      >
        {isEditing && (
          <div className="absolute right-2 top-2 z-50">
            <button
              onClick={() => onUpdate?.('faq', 'isVisible', config?.faq?.isVisible === false)}
              className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                config?.faq?.isVisible === false
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {config?.faq?.isVisible === false ? '表示する' : '非表示にする'}
            </button>
          </div>
        )}
        <FAQ
          heading={config.faq.heading}
          description={config.faq.description}
          items={config.faq.items}
          onOpenChat={onOpenChat}
        />
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
                className="group relative flex items-center justify-center space-x-3 rounded-2xl bg-yellow-400 py-6 text-lg font-bold text-black shadow-xl transition-all hover:bg-yellow-500 hover:shadow-yellow-900/20 active:scale-95"
              >
                <span className="text-2xl transition-transform group-hover:scale-110">⚡</span>
                <span>30秒で簡単相談してみる</span>
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
