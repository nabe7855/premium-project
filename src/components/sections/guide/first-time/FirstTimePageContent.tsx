'use client';

import { Zen_Maru_Gothic } from 'next/font/google';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { stores } from '@/data/stores';
import { getFirstTimeConfig } from '@/lib/store/firstTimeActions';
import { FirstTimeConfig, mergeConfig } from '@/lib/store/firstTimeConfig';

import AnchorNav from './AnchorNav';
import { CastSampler } from './CastSampler';
import { CTA } from './CTA';
import { DayFlow } from './DayFlow';
import { FAQ } from './FAQ';
import { FirstTimeBanner } from './FirstTimeBanner';
import { ForbiddenItems } from './ForbiddenItems';
import { Hero } from './Hero';
import { Options } from './Options';
import { Pricing } from './Pricing';
import { ReservationFlow } from './ReservationFlow';
import { SevenReasons } from './SevenReasons';
import { ThreePoints } from './ThreePoints';
import { Welcome } from './Welcome';

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

interface FirstTimePageContentProps {
  slug?: string;
  storeName?: string;
  isEditing?: boolean;
  config?: FirstTimeConfig;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File) => void;
}

export default function FirstTimePageContent({
  slug: propSlug,
  isEditing = false,
  config: propConfig,
  onUpdate,
  onImageUpload,
  storeName: propStoreName,
}: FirstTimePageContentProps) {
  const params = useParams();
  const slug = propSlug || (params?.slug as string) || 'fukuoka';
  
  // サーバーサイドから渡された初期設定を使用し、不要なスピナー表示を回避
  const [config, setConfig] = useState<FirstTimeConfig>(propConfig || mergeConfig({}));
  const [isLoading, setIsLoading] = useState(!propConfig);

  useEffect(() => {
    // すでに Props で設定が渡されている場合は、マウント時のフェッチをスキップ
    if (propConfig) {
      setConfig(propConfig);
      setIsLoading(false);
      return;
    }

    const fetchConfig = async () => {
      const result = await getFirstTimeConfig(slug);
      if (result.success && result.config) {
        setConfig(mergeConfig(result.config));
      }
      setIsLoading(false);
    };
    fetchConfig();
  }, [slug, propConfig]);

  // 静的データからのフォールバック（propsがない場合のみ）
  const staticStore = stores[slug] || stores['fukuoka'];
  const storeName = propStoreName || staticStore.name;

  // 編集モード以外で設定がある場合はスピナーを出さない（SSR/ISR を最大活用）
  if (isLoading && !propConfig) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className={`${zenMaruGothic.className} min-h-screen bg-[#FFFAFA] pt-[70px] md:pt-[84px]`}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `,
        }}
      />

      {(config.sectionOrder || []).map((sectionId) => {
        switch (sectionId) {
          case 'banner':
            return (
              <FirstTimeBanner
                key="banner"
                config={config.banner}
                isEditing={isEditing}
                onUpdate={onUpdate}
                onImageUpload={onImageUpload}
              />
            );
          case 'hero':
            return (
              <Hero
                key="hero"
                storeName={storeName}
                config={config.hero}
                isEditing={isEditing}
                onUpdate={onUpdate}
              />
            );
          case 'anchorNav':
            return (
              <AnchorNav
                key="anchorNav"
                slug={slug}
                config={config.anchorNav}
                isEditing={isEditing}
              />
            );
          case 'welcome':
            return (
              <div id="welcome" key="welcome">
                <Welcome
                  storeName={storeName}
                  config={config.welcome}
                  isEditing={isEditing}
                  onUpdate={onUpdate}
                  onImageUpload={onImageUpload}
                />
              </div>
            );
          case 'casts':
            return (
              <div id="cast-list" key="casts">
                <CastSampler
                  storeSlug={slug}
                  config={config.casts}
                  isEditing={isEditing}
                  onUpdate={onUpdate}
                  onImageUpload={onImageUpload}
                />
              </div>
            );
          case 'threePoints':
            return (
              <ThreePoints
                key="threePoints"
                config={config.threePoints}
                isEditing={isEditing}
                onUpdate={onUpdate}
                onImageUpload={onImageUpload}
              />
            );
          case 'sevenReasons':
            return (
              <SevenReasons
                key="sevenReasons"
                groupName="SBグループ"
                config={config.sevenReasons}
                isEditing={isEditing}
                onUpdate={onUpdate}
                onImageUpload={onImageUpload}
              />
            );
          case 'reservationFlow':
            return (
              <div id="flow-wrap" key="reservationFlow">
                <ReservationFlow
                  config={config.reservationFlow}
                  isEditing={isEditing}
                  onUpdate={onUpdate}
                  onImageUpload={onImageUpload}
                />
              </div>
            );
          case 'dayFlow':
            return (
              <div id="flow" key="dayFlow">
                <DayFlow
                  config={config.dayFlow}
                  isEditing={isEditing}
                  onUpdate={onUpdate}
                  onImageUpload={onImageUpload}
                />
              </div>
            );
          case 'pricing':
            return (
              <div id="pricing" key="pricing">
                <Pricing
                  config={config.pricing}
                  isEditing={isEditing}
                  onUpdate={onUpdate}
                  onImageUpload={onImageUpload}
                />
              </div>
            );
          case 'options':
            return (
              <Options
                key="options"
                config={config.options}
                isEditing={isEditing}
                onUpdate={onUpdate}
              />
            );
          case 'forbidden':
            return (
              <div id="forbidden" key="forbidden">
                <ForbiddenItems
                  config={config.forbidden}
                  isEditing={isEditing}
                  onUpdate={onUpdate}
                  onImageUpload={onImageUpload}
                />
              </div>
            );
          case 'faq':
            return (
              <div id="faq" key="faq">
                <FAQ
                  config={config.faq}
                  isEditing={isEditing}
                  onUpdate={onUpdate}
                  onImageUpload={onImageUpload}
                />
              </div>
            );
          case 'cta':
            return (
              <CTA
                key="cta"
                config={config.cta}
                isEditing={isEditing}
                onUpdate={onUpdate}
                onImageUpload={onImageUpload}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
