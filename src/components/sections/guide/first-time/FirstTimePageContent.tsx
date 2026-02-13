'use client';

import { Zen_Maru_Gothic } from 'next/font/google';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { stores } from '@/data/stores';
import { getFirstTimeConfig } from '@/lib/store/firstTimeActions';
import { DEFAULT_FIRST_TIME_CONFIG, FirstTimeConfig } from '@/lib/store/firstTimeConfig';

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
}: FirstTimePageContentProps) {
  const params = useParams();
  const slug = propSlug || (params?.slug as string) || 'fukuoka';
  const [config, setConfig] = useState<FirstTimeConfig>(propConfig || DEFAULT_FIRST_TIME_CONFIG);
  const [isLoading, setIsLoading] = useState(!propConfig);

  useEffect(() => {
    if (propConfig) {
      setConfig(propConfig);
      return;
    }

    const fetchConfig = async () => {
      const result = await getFirstTimeConfig(slug);
      if (result.success && result.config) {
        setConfig(result.config as FirstTimeConfig);
      }
      setIsLoading(false);
    };
    fetchConfig();
  }, [slug, propConfig]);

  const store = stores[slug] || stores['fukuoka'];
  const storeName = store.name;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className={`${zenMaruGothic.className} min-h-screen bg-[#FFFAFA] pt-20 md:pt-24`}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html {
          scroll-behavior: smooth;
        }
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

      <FirstTimeBanner
        config={config.banner}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      <Hero storeName={storeName} config={config.hero} isEditing={isEditing} onUpdate={onUpdate} />
      <AnchorNav slug={slug} />

      <div id="welcome">
        <Welcome
          storeName={storeName}
          config={config.welcome}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      </div>
      <div id="cast-list">
        <CastSampler
          storeSlug={slug}
          config={config.casts}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      </div>
      <ThreePoints
        config={config.threePoints}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      <SevenReasons
        groupName="SBグループ"
        config={config.sevenReasons}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      <div id="flow">
        <ReservationFlow
          config={config.reservationFlow}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
        <DayFlow
          config={config.dayFlow}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
      </div>
      <div id="pricing">
        <Pricing
          config={config.pricing}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
        />
        <Options
          areas={
            slug === 'osaka'
              ? [
                  { name: '梅田・難波・心斎橋', price: '4,000円〜' },
                  { name: 'その他大阪市内', price: '3,000円〜' },
                ]
              : slug === 'nagoya'
                ? [
                    { name: '栄・名古屋駅周辺', price: '4,000円〜' },
                    { name: 'その他名古屋市内', price: '3,000円〜' },
                  ]
                : slug === 'fukuoka'
                  ? [
                      { name: '中洲・天神・博多駅周辺', price: '4,000円〜' },
                      { name: 'その他福岡市内', price: '3,000円〜' },
                    ]
                  : undefined
          }
        />
      </div>
      <ForbiddenItems
        config={config.forbidden}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      <FAQ
        config={config.faq}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />
      <CTA
        config={config.cta}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onImageUpload={onImageUpload}
      />

      {/* Sticky Bottom CTA for Mobile */}
      {!isEditing && (
        <div className="fixed bottom-24 left-4 right-4 z-50 md:hidden">
          <a
            href="https://line.me"
            target="_blank"
            rel="noopener noreferrer"
            className="flex animate-bounce items-center justify-center gap-2 rounded-full border-2 border-white bg-[#06C755] py-4 text-lg font-bold text-white shadow-xl"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/124/124034.png"
              alt="LINE"
              className="h-6 w-6"
            />
            LINEで無料相談・予約
          </a>
        </div>
      )}
    </div>
  );
}
