'use client';

import { useStore } from '@/contexts/StoreContext';
import { PriceConfig } from '@/lib/store/storeTopConfig';
import { AlertCircle, Camera } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import PriceCard from '../components/PriceCard';

const defaultPricesByTab = [
  // お得なイベントコース
  [
    { title: 'SHORT', duration: '初回120分', price: 16000, description: '' },
    { title: 'STANDARD', duration: '新人限定150分', price: 15000, description: '' },
    { title: 'LONG', duration: '指名料', price: 0, description: '' },
  ],
  // スタンダードコース
  [
    { title: 'SHORT', duration: '120分', price: 20000, description: '' },
    { title: 'STANDARD', duration: '150分', price: 24000, description: '' },
    { title: 'LONG', duration: '180分', price: 29000, description: '' },
  ],
  // ロングコース
  [
    { title: 'LUXURY', duration: '240分〜', price: 39000, description: '' },
    { title: 'ROYAL', duration: 'お泊り10時間〜', price: 55000, description: '' },
    { title: 'VIP', duration: 'トラベル24時間〜', price: 100000, description: '' },
  ],
];

const defaultNotes = [
  '料金はすべて税込表記です。',
  'その他のコース内容・ご利用方法の詳細は、下記よりご確認ください。',
];

interface PriceSectionProps {
  config?: PriceConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const PriceSection: React.FC<PriceSectionProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const { store } = useStore();
  const [[page, direction], setPage] = useState([0, 0]);
  const activeTab = page;

  const tabs = [
    { id: 0, label: config?.tabLabels?.[0] || 'お得なイベントコース' },
    { id: 1, label: config?.tabLabels?.[1] || 'スタンダードコース' },
    { id: 2, label: config?.tabLabels?.[2] || 'ロングコース' },
  ];

  const prices = config?.itemsByTab?.[activeTab] || defaultPricesByTab[activeTab];
  const notes = config?.notes || defaultNotes;
  const categoryDescriptions = config?.tabDescriptions || [
    '期間限定の特別価格でご案内しております。\nこの機会に、当店自慢の心地よいマッサージをぜひご体験ください。\n※通常コースの詳細は下記よりご確認いただけます。',
    '当店のスタンダードコースになります。\nお好きな配分でご利用頂けます。',
    '至福の時間をお約束するロングコース。\n熟練のセラピストが、お疲れの箇所を重点的に、\nゆったりと丁寧に解きほぐします。\n※全て税込み価格',
  ];

  const nextTab = () => {
    setPage([(page + 1) % tabs.length, 1]);
  };
  const prevTab = () => {
    setPage([(page - 1 + tabs.length) % tabs.length, -1]);
  };

  const handleTextUpdate = (key: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      onUpdate('price', key, e.currentTarget.innerText);
    }
  };

  const handleTabLabelUpdate = (index: number, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      const newLabels = [...(config?.tabLabels || tabs.map((t) => t.label))];
      newLabels[index] = e.currentTarget.innerText;
      onUpdate('price', 'tabLabels', newLabels);
    }
  };

  const handleNoteUpdate = (index: number, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      const newNotes = [...(config?.notes || defaultNotes)];
      newNotes[index] = e.currentTarget.innerText;
      onUpdate('price', 'notes', newNotes);
    }
  };

  return (
    <section id="price" className="relative mx-auto w-full max-w-[1120px] bg-[#fffaf7] px-4 py-16 md:px-6 md:py-24">
      {/* ヒーロー背景的な全体背景（アイボリー・淡ピンク基調） */}
      
      {/* Header Area */}
      <div className="relative z-10 flex flex-col items-center text-center w-full">
        {/* トップ装飾ライン */}
        <div className="mb-4 h-[60px] w-full max-w-[800px] opacity-90 drop-shadow-sm md:h-[100px] md:max-w-[1200px]">
          <NextImage
            src="/images/store/fukuoka/price/A_お得なイベントコース/divider.png"
            fill
            className="object-contain"
            alt="divider"
          />
        </div>

        <h2
          className={`flex flex-col items-center font-serif text-5xl font-bold tracking-[0.15em] text-[#3b1f1a] md:text-6xl ${isEditing ? 'group/heading relative' : ''}`}
        >
          {config?.headingImageUrl ? (
            <div className="relative mx-auto mb-4 flex max-w-[300px] items-center justify-center md:max-w-[400px]">
              <div className="relative h-20 w-full md:h-28">
                <NextImage
                  src={config.headingImageUrl}
                  alt={config.heading || 'Price'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 300px, 400px"
                />
              </div>
              {isEditing && (
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file && onImageUpload) {
                        onImageUpload('price', file, 0, 'headingImageUrl');
                      }
                    };
                    input.click();
                  }}
                  className="absolute -right-2 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#b8324f] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                  title="タイトル画像を変更"
                >
                  <Camera size={16} />
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="relative flex h-[80px] w-full max-w-[560px] items-center justify-center md:h-[120px] md:max-w-[900px]">
                <img
                  src="/images/store/fukuoka/price/A_お得なイベントコース/title_price_menu.png"
                  className="h-full w-full object-contain mix-blend-multiply"
                  alt="PRICE MENU"
                />
              </div>
              {isEditing && (
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file && onImageUpload) {
                        onImageUpload('price', file, 0, 'headingImageUrl');
                      }
                    };
                    input.click();
                  }}
                  className="mt-2 text-[10px] text-rose-300 opacity-0 group-hover/heading:opacity-100 hover:text-rose-500"
                >
                  画像をタイトルとして設定
                </button>
              )}
            </>
          )}
        </h2>
        <p
          contentEditable={isEditing}
          onBlur={(e) => handleTextUpdate('subHeading', e)}
          suppressContentEditableWarning
          className="mt-4 font-serif text-sm font-bold tracking-[0.3em] text-[#6f4a42] md:text-base outline-none flex items-center gap-4"
        >
          <span className="text-[#d5a447] text-xs">⟷</span>
          {config?.subHeading || '料金プラン'}
          <span className="text-[#d5a447] text-xs">⟷</span>
        </p>
      </div>

      {/* Tabs Area - Folder Style */}
      <div className="relative z-20 mt-8 flex w-full max-w-[700px] mx-auto justify-center gap-1 md:gap-2 px-2 md:px-0 -mb-[2px]">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setPage([tab.id, idx > activeTab ? 1 : -1])}
              className={`flex-1 flex items-center justify-center gap-1 rounded-t-2xl px-2 py-3 md:px-4 md:py-4 transition-all duration-300 shadow-sm border-2 border-b-0 ${
                isActive
                  ? 'bg-gradient-to-b from-[#dd5d7a] to-[#b8324f] text-white border-[#ead1a1] z-30 pt-4'
                  : 'bg-[#fffdf8] text-[#6f4a42] border-transparent hover:bg-[#fff7f5] z-10'
              }`}
            >
              {/* Tab Strawberry Icon */}
              <span className={`text-xs md:text-sm ${isActive ? 'text-white' : 'text-[#b8324f]'}`}>🌸</span>
              <span
                contentEditable={isEditing}
                onBlur={(e) => handleTabLabelUpdate(idx, e)}
                suppressContentEditableWarning
                onClick={(e) => isEditing && e.stopPropagation()}
                className="text-xs md:text-sm font-bold whitespace-nowrap outline-none tracking-wider"
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:justify-center">
        {/* メインメニューカードエリア */}
        <div className="relative w-full max-w-[700px]">
          {/* Navigation Arrows (Floating) */}
          <button
            onClick={prevTab}
            className="absolute -left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#fffdf8] text-[#8f2439] shadow-md border border-[#f2b6bd] transition-all hover:scale-110 active:scale-95 md:-left-6 md:h-12 md:w-12"
            aria-label="前のプランを表示"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextTab}
            className="absolute -right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#fffdf8] text-[#8f2439] shadow-md border border-[#f2b6bd] transition-all hover:scale-110 active:scale-95 md:-right-6 md:h-12 md:w-12"
            aria-label="次のプランを表示"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* New PriceCard with Animation */}
          <div className="overflow-x-hidden px-4 md:px-0 pb-4 pt-0">
            <PriceCard
              title={tabs[activeTab].label}
              description={categoryDescriptions[activeTab]}
              items={prices}
              isEditing={isEditing}
              page={page}
              direction={direction}
              onUpdate={(key, value) => {
                if (key === 'description' && onUpdate && config) {
                  const newDescs = [...categoryDescriptions];
                  newDescs[activeTab] = value;
                  onUpdate('price', 'tabDescriptions', newDescs);
                } else if (key === 'items' && onUpdate && config) {
                  const newItemsByTab = config.itemsByTab ? [...config.itemsByTab] : [...defaultPricesByTab];
                  newItemsByTab[activeTab] = value;
                  onUpdate('price', 'itemsByTab', newItemsByTab);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* 注意事項 */}
      <div className="mx-auto mt-12 max-w-[700px] space-y-3 px-4 text-left text-xs text-[#6f4a42] md:px-12 md:text-sm">
        {notes.map((note: string, idx: number) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-[#d5a447]">🌸</span>
            <p
              contentEditable={isEditing}
              onBlur={(e) => handleNoteUpdate(idx, e)}
              suppressContentEditableWarning
              className="flex-grow font-medium leading-relaxed"
            >
              {note}
            </p>
          </div>
        ))}
      </div>

      {/* 詳細ボタン CTA */}
      <div className="mt-12 text-center pb-12">
        <Link
          href={`/store/${store.slug}/price`}
          className="group relative inline-flex transform items-center justify-center rounded-full bg-gradient-to-b from-[#cd445d] via-[#a82a40] to-[#8c1e32] px-10 py-5 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 sm:px-16"
          style={{
            // 二重のゴールド線＋白い余白を再現するための複合box-shadowとborder
            border: '3px solid #fffdf8',
            boxShadow: '0 0 0 1px #d5a447, inset 0 0 0 1px #d5a447, 0 8px 16px -4px rgba(140, 30, 50, 0.4)'
          }}
        >
          {/* 左右の小さなひし形装飾 (ゴールド線の内側に付いているもの) */}
          <div className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-[#d5a447]" />
          <div className="absolute right-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-[#d5a447]" />
          
          {/* ボタン内側の光沢（上部のハイライト） */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />

          {/* いちごアイコン (2連いちごのラインアート想定) */}
          <div className="relative mr-2 h-10 w-10 md:h-12 md:w-12 opacity-100 drop-shadow-md">
            <NextImage src="/images/store/fukuoka/price/A_お得なイベントコース/strawberries_transparent.png" fill className="object-contain" alt="" />
          </div>

          <span className="font-serif text-lg font-bold tracking-widest text-white drop-shadow-sm md:text-xl">
            詳しいコースを見る
          </span>

          <svg
            className="ml-6 h-6 w-6 text-white transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
      
      {/* Hide scrollbar utility class */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
};

export default PriceSection;
