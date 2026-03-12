import React from 'react';
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

import Income from './sections/Income';
import OpenCastRecruitment from './sections/OpenCastRecruitment';
import Trust from './sections/Trust';

export interface LandingPageConfig {
  general?: {
    groupName?: string;
    storeName?: string;
    pageTitleSuffix?: string;
    notificationEmails?: string;
  };
  hero?: {
    mainHeading?: string;
    subHeading?: string;
    isVisible?: boolean;
    heroImage?: string;
    stats?: { label: string; val: string }[];
  };
  openCast?: {
    isVisible?: boolean;
    openCastImage?: string;
    targetDate?: string;
    slotsLabelBefore?: string;
    slotsCount?: string;
    slotsLabelAfter?: string;
    entryDeadlineText?: string;
    selectionTargetText?: string;
    slotsLimitText?: string;
    benefits?: { title: string; desc: string }[];
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
    sectionTitle?: string;
    mainHeading?: string;
    description?: string;
    pillars?: { title: string; sub: string; desc: string }[];
    statsHeaderTitle?: string;
    statsHeaderDesc?: string;
    stats?: { label: string; value: string; unit: string; desc: string }[];
    locationsBadge?: string;
    locationsHeading?: string;
    locations?: { city: string; image: string; stores?: number }[];
  };
  income?: {
    isVisible?: boolean;
    sectionHeader?: string;
    mainHeading?: string;
    description?: string;
    profileImage?: string;
    tipText?: string;
    profiles?: any[];
  };
  achievements?: {
    castImages?: Record<string, string>;
    isVisible?: boolean;
    heading?: string;
    subHeading?: string;
    description?: string;
    profiles?: any[];
    routineTitle?: string;
    disclaimer?: string;
  };
  comic?: {
    slides?: any[];
    isVisible?: boolean;
  };
  benefits?: {
    isVisible?: boolean;
    heading?: string;
    description?: string;
    points?: { title: string; desc: string }[];
  };
  comparison?: {
    isVisible?: boolean;
    heading?: string;
    description?: string;
    ourStoreLabel?: string;
    ourStoreSub?: string;
    storeALabel?: string;
    storeASub?: string;
    storeBLabel?: string;
    storeBSub?: string;
    features?: {
      label: string;
      us: string;
      otherA: string;
      otherB: string;
    }[];
    footnote?: string;
  };
  branding?: {
    images?: Record<string, string>;
    isVisible?: boolean;
    isGridVisible?: boolean;
    metricsLabel?: string;
    metricsValue?: string;
    heading?: string;
    description?: string;
    features?: { title: string; desc: string }[];
  };
  ideal?: {
    isVisible?: boolean;
  };
  checkSheet?: {
    isVisible?: boolean;
    heading?: string;
    description?: string;
    okHeading?: string;
    ngHeading?: string;
    okItems?: string[];
    ngItems?: string[];
    resultPerfect?: string;
    resultGood?: string;
    resultTrial?: string;
    closingLine1?: string;
    closingLine2?: string;
    closingLine3?: string;
  };
  flow?: {
    isVisible?: boolean;
    heading?: string;
    description?: string;
    steps?: {
      step: string;
      title: string;
      duration: string;
      desc: string;
      color: string;
      numColor: string;
      image: string;
    }[];
  };
  footer?: {
    isVisible?: boolean;
    description?: string;
    linksHeading?: string;
    links?: { label: string; url: string }[];
    contactHeading?: string;
    phone?: string;
    receptionHours?: string;
    address?: string;
    privacyLabel?: string;
    privacyUrl?: string;
    termsLabel?: string;
    termsUrl?: string;
    copyright?: string;
  };
  faq?: {
    isVisible?: boolean;
    heading?: string;
    description?: string;
    items?: { cat: string; q: string; a: string }[];
  };
  cta?: {
    heading?: string;
    description?: string;
    chatButtonText?: string;
    consultButtonText?: string;
    formButtonText?: string;
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
  // Ensure sections exist to avoid undefined errors, but don't force-merge with hardcoded defaults.
  // The defaults should be handled by the caller or at component level.
  const config = incomingConfig || ({} as LandingPageConfig);

  const onImageUpload = async (section: string, key: string, file: File) => {
    if (!onUpload) return;
    const url = await onUpload(file);
    if (url) {
      onUpdate?.(section, key, url);
    }
  };

  console.log('✅ LandingPage merged config hero:', config.hero);

  return (
    <div className="overflow-hidden bg-slate-50">
      {/* Visual Header Preview during Editing */}
      {isEditing && (
        <div className="pointer-events-none relative h-16 opacity-80">
          <Header
            onOpenForm={() => {}}
            groupName={config.general?.groupName}
            storeName={config.general?.storeName}
            pageTitleSuffix={config.general?.pageTitleSuffix}
          />
        </div>
      )}

      {/* Hero Section */}
      {(config.hero?.isVisible !== false || isEditing) && (
        <div
          className={`group relative transition-opacity duration-300 ${
            config.hero?.isVisible === false ? 'opacity-40' : ''
          }`}
        >
          {isEditing && (
            <div className="absolute right-2 top-2 z-50">
              <button
                onClick={() => onUpdate?.('hero', 'isVisible', config.hero?.isVisible === false)}
                className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                  config.hero?.isVisible === false
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {config.hero?.isVisible === false ? '表示する' : '非表示にする'}
              </button>
            </div>
          )}
          <HeroCollage
            onOpenChat={onOpenChat}
            mainHeading={config.hero?.mainHeading}
            subHeading={config.hero?.subHeading}
            heroImage={config.hero?.heroImage}
            stats={config.hero?.stats}
            isEditing={isEditing}
            onUpdate={(key: string, value: any) => onUpdate?.('hero', key, value)}
          />
        </div>
      )}

      {/* Open Cast Recruitment Section */}
      {(config.openCast?.isVisible !== false || isEditing) && (
        <div
          className={`group relative transition-opacity duration-300 ${
            config.openCast?.isVisible === false ? 'opacity-40' : ''
          }`}
        >
          {isEditing && (
            <div className="absolute right-2 top-2 z-50">
              <button
                onClick={() =>
                  onUpdate?.('openCast', 'isVisible', config.openCast?.isVisible === false)
                }
                className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                  config.openCast?.isVisible === false
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {config.openCast?.isVisible === false ? '表示する' : '非表示にする'}
              </button>
            </div>
          )}
          <OpenCastRecruitment
            onOpenChat={onOpenChat}
            isEditing={isEditing}
            onUpdate={(key: string, value: any) => onUpdate?.('openCast', key, value)}
            openCastImage={config.openCast?.openCastImage}
            targetDate={config.openCast?.targetDate}
            slotsLabelBefore={config.openCast?.slotsLabelBefore}
            slotsCount={config.openCast?.slotsCount}
            slotsLabelAfter={config.openCast?.slotsLabelAfter}
            entryDeadlineText={config.openCast?.entryDeadlineText}
            selectionTargetText={config.openCast?.selectionTargetText}
            slotsLimitText={config.openCast?.slotsLimitText}
            benefits={config.openCast?.benefits}
          />
        </div>
      )}

      {/* Fukuoka Reason Section */}
      {(config.fukuoka?.isVisible !== false || isEditing) && (
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
            onUpdate={(key: string, value: any) => onUpdate?.('fukuoka', key, value)}
            backgroundImage={config.fukuoka?.backgroundImage}
            heading={config.fukuoka?.heading}
            description1={config.fukuoka?.description1}
            description2={config.fukuoka?.description2}
            description3={config.fukuoka?.description3}
            italicText={config.fukuoka?.italicText}
          />
        </div>
      )}

      {/* Trust Section */}
      {(config.trust?.isVisible !== false || isEditing) && (
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
      )}

      {/* Achievements Section */}
      {(config.achievements?.isVisible !== false || isEditing) && (
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
            isVisible={config?.achievements?.isVisible}
            heading={config?.achievements?.heading}
            subHeading={config?.achievements?.subHeading}
            description={config?.achievements?.description}
            routineTitle={config?.achievements?.routineTitle}
            disclaimer={config?.achievements?.disclaimer}
            isEditing={isEditing}
            onUpdate={(key, value) => {
              if (
                [
                  'heading',
                  'subHeading',
                  'description',
                  'profiles',
                  'routineTitle',
                  'disclaimer',
                ].includes(key)
              ) {
                onUpdate?.('achievements', key, value);
              } else {
                onUpdate?.('achievements', `castImages.${key}`, value);
              }
            }}
            profiles={config?.achievements?.profiles}
            castImages={config?.achievements?.castImages}
          />
        </div>
      )}

      {/* Comic Section */}
      {(config.comic?.isVisible !== false || isEditing) && (
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
      )}

      {/* Benefits Section */}
      {(config.benefits?.isVisible !== false || isEditing) && (
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
            isVisible={config?.benefits?.isVisible}
            heading={config?.benefits?.heading}
            description={config?.benefits?.description}
            points={config?.benefits?.points}
            isEditing={isEditing}
            onUpdate={(key, value) => onUpdate?.('benefits', key, value)}
          />
        </div>
      )}

      {/* Mid-page CTA Section (Moved from OpenCastRecruitment) */}
      <section className="bg-slate-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={onOpenChat}
              className="group relative overflow-hidden rounded-2xl bg-yellow-400 px-10 py-5 text-lg font-bold text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.3)] transition-all hover:scale-105 hover:bg-yellow-500 hover:shadow-[0_0_50px_rgba(250,204,21,0.5)] active:scale-95"
            >
              <span className="relative z-10">簡単相談してみる</span>
              <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/40 to-transparent duration-700 ease-in-out group-hover:translate-x-full"></div>
            </button>
            <button
              onClick={onOpenChat}
              className="rounded-2xl border-2 border-amber-400/40 bg-slate-900/50 px-10 py-5 text-lg font-bold text-amber-300 backdrop-blur-sm transition-all hover:border-amber-400/60 hover:bg-slate-900/70 active:scale-95"
            >
              詳しい話を聞いてみる
            </button>
          </div>
          <div className="mt-6 text-center text-sm text-slate-400">
            <p>✓ 相談は30秒で完了します</p>
            <p>✓ 面接ではありません。まずはお気軽にご相談ください</p>
          </div>
        </div>
      </section>

      {/* Income Simulation Section */}
      {(config.income?.isVisible !== false || isEditing) && (
        <div
          id="income"
          className={`group relative transition-opacity duration-300 ${
            config?.income?.isVisible === false ? 'opacity-40' : ''
          }`}
        >
          {isEditing && (
            <div className="absolute right-2 top-2 z-50">
              <button
                onClick={() =>
                  onUpdate?.('income', 'isVisible', config?.income?.isVisible === false)
                }
                className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                  config?.income?.isVisible === false
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {config?.income?.isVisible === false ? '表示する' : '非表示にする'}
              </button>
            </div>
          )}
          <Income
            config={config?.income}
            isEditing={isEditing}
            onUpdate={(key: string, value: any) => onUpdate?.('income', key, value)}
            onImageUpload={onImageUpload}
          />
        </div>
      )}

      {/* Comparison Section */}
      {(config.comparison?.isVisible !== false || isEditing) && (
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
          <Comparison
            isEditing={isEditing}
            onUpdate={(key, value) => onUpdate?.('comparison', key, value)}
            {...config?.comparison}
          />
        </div>
      )}

      {/* Check Sheet Section */}
      {(config.checkSheet?.isVisible !== false || isEditing) && (
        <div
          id="check"
          className={`group relative transition-opacity duration-300 ${
            config?.checkSheet?.isVisible === false ? 'opacity-40' : ''
          }`}
        >
          {isEditing && (
            <div className="absolute right-2 top-2 z-50">
              <button
                onClick={() =>
                  onUpdate?.('checkSheet', 'isVisible', config?.checkSheet?.isVisible === false)
                }
                className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                  config?.checkSheet?.isVisible === false
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {config?.checkSheet?.isVisible === false ? '表示する' : '非表示にする'}
              </button>
            </div>
          )}
          <CheckSheet
            isEditing={isEditing}
            onUpdate={(key, value) => onUpdate?.('checkSheet', key, value)}
            {...config?.checkSheet}
            onOpenChat={onOpenChat}
          />
        </div>
      )}

      {/* Flow Section */}
      {(config.flow?.isVisible !== false || isEditing) && (
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
            isVisible={config?.flow?.isVisible}
            heading={config?.flow?.heading}
            description={config?.flow?.description}
            steps={config?.flow?.steps}
            onOpenChat={onOpenChat}
            isEditing={isEditing}
            onUpdate={(key, value) => {
              if (value instanceof File) {
                onImageUpload?.('flow', key, value);
              } else {
                onUpdate?.('flow', key, value);
              }
            }}
          />
        </div>
      )}

      {/* Metrics Grid Section */}
      {(config.branding?.isGridVisible !== false || isEditing) && (
        <div
          className={`group relative transition-opacity duration-300 ${
            config?.branding?.isGridVisible === false ? 'opacity-40' : ''
          }`}
        >
          {isEditing && (
            <div className="absolute right-2 top-2 z-50">
              <button
                onClick={() =>
                  onUpdate?.('branding', 'isGridVisible', config?.branding?.isGridVisible === false)
                }
                className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                  config?.branding?.isGridVisible === false
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {config?.branding?.isGridVisible === false ? '表示する' : '非表示にする'}
              </button>
            </div>
          )}
          <MetricsGrid
            isEditing={isEditing}
            onUpdate={(key, value) => {
              if (['metricsLabel', 'metricsValue'].includes(key)) {
                onUpdate?.('branding', key, value);
              } else if (value instanceof File) {
                onImageUpload?.('branding', `images.${key}`, value);
              } else {
                onUpdate?.('branding', `images.${key}`, value);
              }
            }}
            brandingImages={config?.branding?.images}
            metricsLabel={config?.branding?.metricsLabel}
            metricsValue={config?.branding?.metricsValue}
          />
        </div>
      )}

      {/* Branding Support Section */}
      {(config.branding?.isVisible !== false || isEditing) && (
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
          <BrandingSupport
            isEditing={isEditing}
            onUpdate={(key, value) => onUpdate?.('branding', key, value)}
            heading={config?.branding?.heading}
            description={config?.branding?.description}
            features={config?.branding?.features}
          />
        </div>
      )}

      {/* FAQ Section */}
      {(config.faq?.isVisible !== false || isEditing) && (
        <div
          id="faq"
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
            isVisible={config?.faq?.isVisible}
            heading={config?.faq?.heading}
            description={config?.faq?.description}
            items={config?.faq?.items}
            onOpenChat={onOpenChat}
            isEditing={isEditing}
            onUpdate={(key, value) => onUpdate?.('faq', key, value)}
          />
        </div>
      )}

      {/* Final CTA Section */}
      <section className="bg-slate-900 py-24 text-center text-white">
        <div className="container mx-auto max-w-4xl px-4">
          {isEditing ? (
            <h2
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdate?.('cta', 'heading', e.currentTarget.innerText)}
              className="mb-8 cursor-text whitespace-pre-line rounded font-serif text-3xl font-bold leading-tight outline-none hover:bg-white/5 md:text-5xl"
            >
              {config?.cta?.heading ?? 'あなたの人生を変える一歩を、\nここから始めませんか？'}
            </h2>
          ) : (
            <h2 className="mb-8 font-serif text-3xl font-bold leading-tight md:text-5xl">
              {config?.cta?.heading ? (
                config.cta.heading.split('\n').map((line: string, i: number) => (
                  <span key={i}>
                    {line}
                    {i < config.cta!.heading!.split('\n').length - 1 && (
                      <br className="hidden md:block" />
                    )}
                  </span>
                ))
              ) : (
                <>
                  あなたの人生を変える一歩を、
                  <br className="hidden md:block" />
                  ここから始めませんか？
                </>
              )}
            </h2>
          )}
          {isEditing ? (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdate?.('cta', 'description', e.currentTarget.innerText)}
              className="mb-12 cursor-text whitespace-pre-line rounded text-lg text-slate-400 outline-none hover:bg-white/5"
            >
              {config?.cta?.description ??
                '私たちは、あなたの可能性を信じています。\n誠実な一歩が、想像もしなかった未来を創り出します。'}
            </p>
          ) : (
            <p className="mb-12 text-lg text-slate-400">
              {config?.cta?.description ? (
                config.cta.description.split('\n').map((line: string, i: number) => (
                  <span key={i}>
                    {line}
                    {i < config.cta!.description!.split('\n').length - 1 && <br />}
                  </span>
                ))
              ) : (
                <>
                  私たちは、あなたの可能性を信じています。
                  <br />
                  誠実な一歩が、想像もしなかった未来を創り出します。
                </>
              )}
            </p>
          )}

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                onClick={onOpenChat}
                className="group relative flex items-center justify-center space-x-3 rounded-2xl bg-green-600 py-6 text-lg font-bold text-white shadow-xl transition-all hover:bg-green-700 hover:shadow-green-900/40 active:scale-95"
              >
                <span className="text-2xl transition-transform group-hover:scale-110">💬</span>
                {isEditing ? (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdate?.('cta', 'chatButtonText', e.currentTarget.innerText)}
                    className="cursor-text outline-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {config?.cta?.chatButtonText ?? 'チャットでまずは話を聞いてみる'}
                  </span>
                ) : (
                  <span>{config?.cta?.chatButtonText ?? 'チャットでまずは話を聞いてみる'}</span>
                )}
              </button>
              <button
                onClick={onOpenChat}
                className="group relative flex items-center justify-center space-x-3 rounded-2xl bg-yellow-400 py-6 text-lg font-bold text-black shadow-xl transition-all hover:bg-yellow-500 hover:shadow-yellow-900/20 active:scale-95"
              >
                <span className="text-2xl transition-transform group-hover:scale-110">⚡</span>
                {isEditing ? (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdate?.('cta', 'consultButtonText', e.currentTarget.innerText)
                    }
                    className="cursor-text outline-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {config?.cta?.consultButtonText ?? '30秒で簡単相談してみる'}
                  </span>
                ) : (
                  <span>{config?.cta?.consultButtonText ?? '30秒で簡単相談してみる'}</span>
                )}
              </button>
            </div>

            <button
              onClick={onOpenForm}
              className="mx-auto flex w-full max-w-md items-center justify-center space-x-3 rounded-2xl border-2 border-slate-700 bg-transparent py-5 text-lg font-bold text-white transition-all hover:border-amber-500 hover:bg-amber-500/10 active:scale-95"
            >
              <span className="text-xl">📝</span>
              {isEditing ? (
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdate?.('cta', 'formButtonText', e.currentTarget.innerText)}
                  className="cursor-text outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {config?.cta?.formButtonText ?? '応募フォームから応募する'}
                </span>
              ) : (
                <span>{config?.cta?.formButtonText ?? '応募フォームから応募する'}</span>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
