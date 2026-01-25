'use client';

import { useStore } from '@/contexts/StoreContext';
import { PriceConfig } from '@/lib/store/storeTopConfig';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import SectionTitle from '../components/SectionTitle';

const defaultPricesByTab = [
  // オープニングキャンペーン中
  [
    { title: 'SHORT', duration: 60, price: 10000, description: 'キャンペーン特別価格' },
    { title: 'STANDARD', duration: 90, price: 15000, description: '一番人気の定番コース' },
    { title: 'LONG', duration: 120, price: 20000, description: '至福のロングタイム' },
  ],
  // スタンダードコース
  [
    { title: 'SHORT', duration: 60, price: 12000, description: 'お試し・部分的な集中ケアに' },
    {
      title: 'STANDARD',
      duration: 90,
      price: 17000,
      description: '全身をゆっくりほぐす定番コース',
    },
    { title: 'LONG', duration: 120, price: 23000, description: '心身ともに深く癒される贅沢な時間' },
  ],
  // ロングコース
  [
    { title: 'LUXURY', duration: 150, price: 28000, description: '最高級のトリートメント' },
    { title: 'ROYAL', duration: 180, price: 33000, description: '究極の癒やし体験' },
    { title: 'VIP', duration: 210, price: 38000, description: '完全オーダーメイド' },
  ],
];

const defaultNotes = [
  '全てのプランに消費税が含まれております。延長は30分 ¥6,000にて承ります。',
  '指名料（¥1,000〜）および出張交通費が別途発生いたします。',
];

interface PriceSectionProps {
  config?: PriceConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
}

const PriceSection: React.FC<PriceSectionProps> = ({ config, isEditing }) => {
  const { store } = useStore();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: 'オープニングキャンペーン中' },
    { id: 1, label: 'スタンダードコース' },
    { id: 2, label: 'ロングコース' },
  ];

  const prices = config?.itemsByTab?.[activeTab] || defaultPricesByTab[activeTab];
  const notes = config?.notes || defaultNotes;

  return (
    <section id="price" className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
      <SectionTitle en={config?.subHeading || 'Price Menu'} ja={config?.heading || '料金プラン'} />

      <div className="overflow-hidden rounded-[2.5rem] border-2 border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-2xl md:p-12">
        {/* タブ */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`transform rounded-full px-6 py-3.5 text-sm font-black transition-all active:scale-95 md:px-8 md:text-base ${
                activeTab === tab.id
                  ? 'bg-primary-500 shadow-primary-300/50 text-white shadow-lg'
                  : 'hover:border-primary-300 hover:bg-primary-50 border-2 border-slate-300 bg-white text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 料金グリッド */}
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3 md:gap-8">
          {Array.isArray(prices) &&
            prices.map((item: any, idx: number) => {
              if (!item) return null;
              const isMain = idx === 1; // 中央を強調
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col items-center rounded-[2rem] border-2 p-8 transition-all duration-500 ${
                    isMain
                      ? 'border-primary-400 from-primary-100 z-10 scale-105 bg-gradient-to-b to-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)]'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
                  }`}
                >
                  {isMain && (
                    <div className="bg-primary-500 absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg">
                      Popular No.1
                    </div>
                  )}
                  <span
                    className={`mb-4 text-xs font-black uppercase tracking-[0.25em] md:text-sm ${isMain ? 'text-primary-600' : 'text-slate-500'}`}
                  >
                    {item.title}
                  </span>
                  <div className="mb-2 flex items-baseline gap-1">
                    <span
                      className={`font-serif font-black leading-none ${isMain ? 'text-6xl text-slate-900' : 'text-5xl text-slate-800'}`}
                    >
                      {item.duration}
                    </span>
                    <span
                      className={`text-sm font-bold md:text-base ${isMain ? 'text-slate-600' : 'text-slate-500'}`}
                    >
                      min
                    </span>
                  </div>
                  <div className="mb-6 flex items-baseline">
                    <span
                      className={`font-black ${isMain ? 'text-primary-600 text-3xl' : 'text-2xl text-slate-800'}`}
                    >
                      ¥
                    </span>
                    <span
                      className={`font-black ${isMain ? 'text-primary-600 text-3xl' : 'text-2xl text-slate-800'}`}
                    >
                      {(item.price || 0).toLocaleString()}
                    </span>
                  </div>
                  <p
                    className={`min-h-[2.5rem] text-center text-xs font-semibold leading-relaxed md:text-sm ${isMain ? 'text-slate-700' : 'text-slate-600'}`}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
        </div>

        {/* 注意事項 */}
        <div className="mt-10 space-y-3 rounded-[2rem] border-2 border-slate-200 bg-slate-50 p-6 text-left text-xs text-slate-600 md:p-8 md:text-sm">
          {notes.map((note: string, idx: number) => (
            <div key={idx} className="flex items-start gap-3">
              <AlertCircle size={16} className="text-primary-400 mt-0.5 shrink-0" />
              <p className="flex-grow font-medium leading-relaxed">{note}</p>
            </div>
          ))}
        </div>

        {/* 詳細ボタン */}
        <div className="mt-12 text-center">
          <Link
            href={`/store/${store.slug}/price`}
            className="bg-primary-500 hover:bg-primary-600 group inline-flex transform items-center gap-3 rounded-full px-12 py-5 font-black text-white shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <span>詳しいコースはこちら</span>
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PriceSection;
