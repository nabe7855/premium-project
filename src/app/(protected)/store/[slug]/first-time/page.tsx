'use client';

import { CastSampler } from '@/components/sections/guide/first-time/CastSampler';
import { CTA } from '@/components/sections/guide/first-time/CTA';
import { DayFlow } from '@/components/sections/guide/first-time/DayFlow';
import { FAQ } from '@/components/sections/guide/first-time/FAQ';
import { FirstTimeBanner } from '@/components/sections/guide/first-time/FirstTimeBanner';
import { Hero } from '@/components/sections/guide/first-time/Hero';
import { Options } from '@/components/sections/guide/first-time/Options';
import { Pricing } from '@/components/sections/guide/first-time/Pricing';
import { ReservationFlow } from '@/components/sections/guide/first-time/ReservationFlow';
import { SevenReasons } from '@/components/sections/guide/first-time/SevenReasons';
import { ThreePoints } from '@/components/sections/guide/first-time/ThreePoints';
import { Welcome } from '@/components/sections/guide/first-time/Welcome';
import { stores } from '@/data/stores';
import { Zen_Maru_Gothic } from 'next/font/google';
import { useParams } from 'next/navigation';

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export default function FirstTimePage() {
  const { slug } = useParams();
  const store = stores[slug as string] || stores['tokyo'];
  const storeName = store.name;

  return (
    <div className={`${zenMaruGothic.className} min-h-screen bg-[#FFFAFA] pt-20 md:pt-24`}>
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

      <FirstTimeBanner />
      <Hero storeName={storeName} />
      <Welcome storeName={storeName} />
      <CastSampler storeSlug={slug as string} />
      <ThreePoints />
      <SevenReasons groupName="SBグループ" />
      <ReservationFlow />
      <DayFlow />
      <Pricing />
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
      <FAQ />
      <CTA />

      {/* Sticky Bottom CTA for Mobile */}
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
    </div>
  );
}
