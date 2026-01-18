import { PriceConfig } from '@/lib/store/storeTopConfig';
import { AlertCircle } from 'lucide-react';
import React from 'react';
import SectionTitle from '../components/SectionTitle';

interface PriceSectionProps {
  config?: PriceConfig;
}

const PriceSection: React.FC<PriceSectionProps> = () => {
  return (
    <section id="price" className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
      <SectionTitle en="Price Menu" ja="料金プラン" />

      <div className="shadow-primary-100/50 border-primary-50 rounded-[2.5rem] border bg-white p-6 shadow-2xl md:p-12">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3 md:gap-8">
          <div className="order-2 rounded-[2rem] border border-neutral-100 p-8 text-center transition-colors hover:bg-neutral-50 md:order-1">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              Short
            </h3>
            <div className="mb-3 flex items-baseline justify-center text-slate-800">
              <span className="font-serif text-4xl">60</span>
              <span className="ml-1 text-xs font-bold">min</span>
            </div>
            <p className="mb-3 text-xl font-bold text-slate-700">¥12,000</p>
            <p className="text-[10px] font-medium tracking-wider text-slate-400">
              お試し・部分的な集中ケアに
            </p>
          </div>

          <div className="from-primary-50 border-primary-200 relative order-1 transform rounded-[2rem] border bg-gradient-to-b to-white p-10 text-center shadow-xl md:order-2 md:-translate-y-6">
            <div className="bg-primary-500 absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-md">
              Popular No.1
            </div>
            <h3 className="text-primary-500 mb-4 text-xs font-bold uppercase tracking-widest">
              Standard
            </h3>
            <div className="mb-3 flex items-baseline justify-center text-slate-800">
              <span className="font-serif text-5xl">90</span>
              <span className="ml-1 text-xs font-bold">min</span>
            </div>
            <p className="text-primary-500 mb-3 text-2xl font-bold">¥17,000</p>
            <p className="text-[10px] font-bold tracking-wider text-slate-500">
              全身をゆっくりほぐす定番コース
            </p>
          </div>

          <div className="order-3 rounded-[2rem] border border-neutral-100 p-8 text-center transition-colors hover:bg-neutral-50">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              Long
            </h3>
            <div className="mb-3 flex items-baseline justify-center text-slate-800">
              <span className="font-serif text-4xl">120</span>
              <span className="ml-1 text-xs font-bold">min</span>
            </div>
            <p className="mb-3 text-xl font-bold text-slate-700">¥23,000</p>
            <p className="text-[10px] font-medium tracking-wider text-slate-400">
              心身ともに深く癒される贅沢な時間
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-3 rounded-[2rem] border border-neutral-100 bg-neutral-50/50 p-6 text-[10px] text-slate-400 md:p-8 md:text-xs">
          <div className="flex items-start gap-3">
            <AlertCircle size={14} className="text-primary-300 mt-0.5 shrink-0" />
            <p className="tracking-wider">
              全てのプランに消費税が含まれております。延長は30分 ¥6,000にて承ります。
            </p>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle size={14} className="text-primary-300 mt-0.5 shrink-0" />
            <p className="tracking-wider">
              指名料（¥1,000〜）および出張交通費が別途発生いたします。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceSection;
