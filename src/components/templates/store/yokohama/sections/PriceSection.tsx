'use client';

import { useStore } from '@/contexts/StoreContext';
import { PriceConfig } from '@/lib/store/storeTopConfig';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import PriceCard from '../components/PriceCard';
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
    { title: 'ROYAL', duration: 180, price: 33000, description: '究極의 癒やし体験' },
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
  const [[page, direction], setPage] = useState([0, 0]);
  const activeTab = page;

  const tabs = [
    { id: 0, label: 'オープニングキャンペーン中' },
    { id: 1, label: 'スタンダードコース' },
    { id: 2, label: 'ロングコース' },
  ];

  const prices = config?.itemsByTab?.[activeTab] || defaultPricesByTab[activeTab];
  const notes = config?.notes || defaultNotes;

  const nextTab = () => {
    setPage([(page + 1) % tabs.length, 1]);
  };
  const prevTab = () => {
    setPage([(page - 1 + tabs.length) % tabs.length, -1]);
  };

  // カテゴリーに応じた説明文（モックまたはConfigから取得）
  const categoryDescriptions = [
    'オープンを記念して、期間限定の特別価格でご提供いたします。この機会にぜひ当店のトリートメントをご体験ください。',
    'オイルトリートメント・タイ古式・ヘッド＆フェイシャル・リフレクソロジーの中から、お客様のお好みのコースをお好きな配分でご利用頂けます。',
    '至福の時間をお約束するロングコース。熟練のセラピストが、お疲れの箇所を重点的に、ゆったりと丁寧に解きほぐします。',
  ];

  return (
    <section id="price" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <SectionTitle en={config?.subHeading || 'Price Menu'} ja={config?.heading || '料金プラン'} />

      <div className="relative flex flex-col gap-8 md:flex-row md:justify-center">
        {/* メインメニューカードエリア */}
        <div className="relative w-full max-w-[476px]">
          {/* Navigation Arrows (Floating) */}
          <button
            onClick={prevTab}
            className="absolute left-[-20px] top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#D4AF37] text-white shadow-lg transition-all hover:scale-110 active:scale-95 md:left-[-24px] md:h-12 md:w-12"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextTab}
            className="absolute right-[-20px] top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#D4AF37] text-white shadow-lg transition-all hover:scale-110 active:scale-95 md:right-[-24px] md:h-12 md:w-12"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* New PriceCard with Animation */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <PriceCard
                  title={tabs[activeTab].label}
                  description={categoryDescriptions[activeTab]}
                  items={prices}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 注意事項 */}
      <div className="mx-auto mt-12 max-w-lg space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left text-xs text-slate-600 md:p-8 md:text-sm">
        {notes.map((note: string, idx: number) => (
          <div key={idx} className="flex items-start gap-3">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-[#642B2B]/40" />
            <p className="flex-grow font-medium leading-relaxed">{note}</p>
          </div>
        ))}
      </div>

      {/* 詳細ボタン */}
      <div className="mt-12 text-center">
        <Link
          href={`/store/${store.slug}/price`}
          className="group inline-flex transform items-center gap-3 rounded-full bg-[#642B2B] px-12 py-5 font-black text-white shadow-xl transition-all hover:scale-105 active:scale-95"
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
    </section>
  );
};

export default PriceSection;
