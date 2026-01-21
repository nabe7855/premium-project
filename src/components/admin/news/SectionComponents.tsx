import React from 'react';
import { SectionData } from './types';

interface SectionComponentProps {
  data: SectionData;
  active: boolean;
  innerRef: (el: HTMLDivElement | null) => void;
  onUpdate?: (data: SectionData) => void;
}

export const HeroSection: React.FC<SectionComponentProps> = ({ data, active, innerRef }) => {
  const { title, subtitle, imageUrl, buttonText, titleStyle, subtitleStyle, buttonStyle } =
    data.content;
  return (
    <div
      ref={innerRef}
      className={`relative flex h-[500px] items-center justify-center overflow-hidden text-center md:h-[700px] ${active ? 'z-10 ring-8 ring-inset ring-rose-500' : ''}`}
    >
      {imageUrl && (
        <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
      <div className="pointer-events-none relative z-10 max-w-5xl px-8">
        <h1
          className="mb-6 font-black leading-[1.1] text-white drop-shadow-2xl"
          style={{
            fontSize: `${titleStyle?.size || 64}px`,
            transform: `translate(${(titleStyle?.x || 50) - 50}%, ${(titleStyle?.y || 35) - 35}%)`,
          }}
        >
          {title || 'Luxury Moments'}
        </h1>
        <p
          className="mb-12 font-medium uppercase tracking-[0.2em] text-white/95 drop-shadow-xl"
          style={{
            fontSize: `${subtitleStyle?.size || 22}px`,
            transform: `translate(${(subtitleStyle?.x || 50) - 50}%, ${(subtitleStyle?.y || 50) - 50}%)`,
          }}
        >
          {subtitle || 'Exceptional Premium Service'}
        </p>
        {buttonText && (
          <div
            style={{
              transform: `translate(${(buttonStyle?.x || 50) - 50}%, ${(buttonStyle?.y || 72) - 72}%)`,
            }}
          >
            <button className="transform rounded-full bg-white px-14 py-5 font-black text-slate-900 shadow-[0_25px_60px_rgba(0,0,0,0.5)] transition-transform hover:scale-110">
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const CampaignSection: React.FC<SectionComponentProps> = ({ data, active, innerRef }) => {
  const { title, subtitle, description, imageUrl, buttonText } = data.content;
  return (
    <div
      ref={innerRef}
      className={`bg-white px-10 py-32 ${active ? 'z-10 ring-8 ring-inset ring-rose-500' : ''}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-20 lg:flex-row">
        <div className="flex-1 text-left">
          <p className="mb-6 border-l-4 border-rose-500 pl-4 text-xs font-black uppercase tracking-[0.4em] text-rose-500">
            {subtitle || 'Limited Campaign'}
          </p>
          <h2 className="mb-10 text-5xl font-black leading-tight tracking-tighter text-slate-900 lg:text-6xl">
            {title || 'Special Seasonal Offer'}
          </h2>
          <p className="mb-12 whitespace-pre-wrap text-xl font-medium leading-loose text-slate-500">
            {description ||
              'Experience our exclusive bespoke events designed for those who appreciate the absolute finer things in life.'}
          </p>
          {buttonText && (
            <button className="rounded-[1.5rem] bg-slate-900 px-12 py-5 font-black text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all hover:bg-rose-600">
              {buttonText}
            </button>
          )}
        </div>
        <div className="group aspect-[4/5] w-full flex-1 transform overflow-hidden rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.2)] lg:rotate-2">
          <img
            src={imageUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622'}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export const CastSection: React.FC<SectionComponentProps> = ({ data, active, innerRef }) => {
  const { title, subtitle, description, imageUrl, buttonText } = data.content;
  return (
    <div
      ref={innerRef}
      className={`bg-slate-50 px-10 py-32 ${active ? 'z-10 ring-8 ring-inset ring-rose-500' : ''}`}
    >
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-20 overflow-hidden rounded-[5rem] bg-white p-14 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.1)] lg:flex-row lg:p-20">
        <div className="absolute right-0 top-0 -mr-48 -mt-48 h-96 w-96 rounded-full bg-rose-50 opacity-40 blur-[120px]" />
        <div className="group aspect-[3/4] w-full shrink-0 -rotate-2 transform overflow-hidden rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] lg:w-[400px]">
          <img
            src={imageUrl || 'https://images.unsplash.com/photo-1549490349-8643362247b5'}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
            alt=""
          />
        </div>
        <div className="relative z-10 flex-1 text-center lg:text-left">
          <div className="mb-8 inline-block rounded-full bg-rose-50 px-8 py-2.5 text-xs font-black uppercase tracking-[0.3em] text-rose-600 shadow-sm">
            {subtitle || 'Featured Talent'}
          </div>
          <h2 className="mb-10 text-6xl font-black leading-none tracking-tighter text-slate-900">
            {title || 'Premium Artist'}
          </h2>
          <div className="relative mb-12">
            <span className="absolute -left-12 -top-16 select-none font-serif text-9xl text-rose-100 opacity-30">
              “
            </span>
            <p className="relative z-10 text-2xl font-medium italic leading-relaxed text-slate-500">
              {description ||
                'Dedication to providing an absolutely unforgettable experience tailored precisely to your unique and most sophisticated desires.'}
            </p>
          </div>
          {buttonText && (
            <button className="rounded-2xl bg-slate-900 px-12 py-5 font-black text-white shadow-2xl transition-all hover:bg-rose-600">
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const RankingSection: React.FC<SectionComponentProps> = ({ data, active, innerRef }) => {
  const { title, items } = data.content;
  return (
    <div
      ref={innerRef}
      className={`bg-white px-10 py-32 ${active ? 'z-10 ring-8 ring-inset ring-rose-500' : ''}`}
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-24 text-center text-5xl font-black uppercase tracking-tighter text-slate-900">
          {title || 'Exquisite Selection'}
        </h2>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          {(items || []).map((item: any, i: number) => (
            <div key={i} className="group flex flex-col items-center">
              <div className="relative mb-10 w-full">
                <div className="absolute -left-8 -top-8 z-20 flex h-20 w-20 transform flex-col items-center justify-center rounded-[2rem] bg-slate-900 font-black text-white shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-700 group-hover:-translate-y-3 group-hover:rotate-6 group-hover:bg-rose-500">
                  <span className="mb-1 text-[10px] uppercase tracking-widest opacity-60">
                    Rank
                  </span>
                  <span className="text-2xl leading-none">0{i + 1}</span>
                </div>
                <div className="aspect-[4/5] overflow-hidden rounded-[3.5rem] bg-slate-50 shadow-2xl transition-all duration-1000 group-hover:shadow-[0_80px_160px_-40px_rgba(0,0,0,0.25)]">
                  <img
                    src={item.imageUrl}
                    className="duration-[2s] h-full w-full object-cover transition-transform group-hover:scale-110"
                    alt=""
                  />
                </div>
              </div>
              <h3 className="mb-4 text-2xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-rose-600">
                {item.name}
              </h3>
              <p className="px-6 text-center text-base font-medium leading-loose text-slate-400">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const GallerySection: React.FC<SectionComponentProps> = ({ data, active, innerRef }) => {
  const { title, items } = data.content;
  return (
    <div
      ref={innerRef}
      className={`bg-slate-900 px-6 py-32 ${active ? 'z-10 ring-8 ring-inset ring-rose-500' : ''}`}
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-24 text-center text-4xl font-black uppercase italic tracking-[0.4em] text-white opacity-90">
          {title || 'Visual Narrative'}
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {(items || []).map((item: any, i: number) => (
            <div
              key={i}
              className={`group relative cursor-pointer overflow-hidden rounded-[2.5rem] shadow-2xl ${i % 3 === 0 ? 'md:col-span-2 md:row-span-2' : 'aspect-square'}`}
            >
              <img
                src={item.imageUrl}
                className="duration-[3s] h-full w-full object-cover transition-transform group-hover:scale-110"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TextSection: React.FC<SectionComponentProps> = ({ data, active, innerRef }) => {
  const { title, description } = data.content;
  return (
    <div
      ref={innerRef}
      className={`bg-white px-10 py-32 ${active ? 'z-10 ring-8 ring-inset ring-rose-500' : ''}`}
    >
      <div className="mx-auto max-w-4xl text-center md:text-left">
        {title && (
          <div className="mb-14">
            <h2 className="mb-6 text-5xl font-black leading-tight tracking-tight text-slate-900">
              {title}
            </h2>
            <div className="h-2 w-24 rounded-full bg-rose-500" />
          </div>
        )}
        <div className="whitespace-pre-wrap text-2xl font-light italic leading-[2] tracking-wide text-slate-500">
          {description ||
            'Elevate your ultimate expectations with our bespoke solutions designed for the most discerning individual seeking perfection.'}
        </div>
      </div>
    </div>
  );
};

export const CTASection: React.FC<SectionComponentProps> = ({ data, active, innerRef }) => {
  const { title, subtitle, buttonText } = data.content;
  return (
    <div
      ref={innerRef}
      className={`relative overflow-hidden bg-slate-900 px-10 py-40 ${active ? 'z-10 ring-8 ring-inset ring-rose-500' : ''}`}
    >
      <div className="absolute left-0 top-0 h-full w-full">
        <div className="absolute right-0 top-0 -mr-96 -mt-96 h-[800px] w-[800px] animate-pulse rounded-full bg-rose-600 opacity-20 blur-[180px]" />
        <div className="absolute bottom-0 left-0 -mb-48 -ml-48 h-[600px] w-[600px] rounded-full bg-rose-900 opacity-20 blur-[150px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="mb-10 text-6xl font-black leading-tight tracking-tighter text-white drop-shadow-2xl md:text-7xl">
          {title || 'Begin Your New Story'}
        </h2>
        <p className="mx-auto mb-20 max-w-3xl text-2xl font-medium leading-relaxed tracking-wide text-slate-400">
          {subtitle ||
            'Join an elite community and experience the absolute pinnacle of luxury and personalized service.'}
        </p>
        {buttonText && (
          <button className="transform rounded-full bg-rose-600 px-20 py-7 text-2xl font-black text-white shadow-[0_30px_80px_rgba(225,29,72,0.4)] transition-all hover:scale-110 hover:bg-white hover:text-slate-900 hover:shadow-none active:scale-95">
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export const SNSSection: React.FC<SectionComponentProps> = ({ data, active, innerRef }) => {
  const platformIcons = {
    Instagram: (
      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    X: (
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.25h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    TikTok: (
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.64-4.89 1.16-.9 2.62-1.44 4.13-1.49.07 1.54.03 3.08.01 4.62-1.1.06-2.26.54-3.03 1.35-.77.81-1.18 1.91-1.11 3.01.06 1.26.71 2.42 1.71 3.16 1.1.84 2.5 1.11 3.86.84 1.53-.3 2.85-1.47 3.39-2.93.31-.83.39-1.72.39-2.61.01-3.61.01-7.22 0-10.83z" />
      </svg>
    ),
  };
  return (
    <div
      ref={innerRef}
      className={`border-t border-slate-50 bg-white px-10 py-24 ${active ? 'z-10 ring-8 ring-inset ring-rose-500' : ''}`}
    >
      <div className="mx-auto flex max-w-xl flex-col items-center gap-12">
        <p className="text-center text-[12px] font-black uppercase tracking-[0.6em] text-slate-300">
          Follow Our Social Journey
        </p>
        <div className="flex justify-center gap-16">
          {(['Instagram', 'X', 'TikTok'] as const).map((platform) => (
            <div key={platform} className="group flex cursor-pointer flex-col items-center gap-4">
              <div className="flex h-20 w-20 transform items-center justify-center rounded-[2rem] border border-slate-100 bg-slate-50 text-slate-300 shadow-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-rose-50 group-hover:text-rose-50 group-hover:shadow-xl">
                {platformIcons[platform]}
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 transition-colors group-hover:text-slate-700">
                {platform}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PriceSection: React.FC<SectionComponentProps> = ({ data, active, innerRef }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const { title, subtitle, items, buttonText } = data.content;

  const tabs = [
    { id: 0, label: 'オープニングキャンペーン中' },
    { id: 1, label: 'スタンダードコース' },
    { id: 2, label: 'ロングコース' },
  ];

  // 各タブごとのデフォルトデータ
  const defaultItemsByTab = [
    [
      { name: 'SHORT', time: '60', price: '10,000', description: 'キャンペーン特別価格' },
      { name: 'STANDARD', time: '90', price: '15,000', description: '一番人気の定番コース' },
      { name: 'LONG', time: '120', price: '20,000', description: '至福のロングタイム' },
    ],
    [
      { name: 'SHORT', time: '60', price: '12,000', description: 'お試し・部分的な集中ケアに' },
      {
        name: 'STANDARD',
        time: '90',
        price: '17,000',
        description: '全身をゆっくりほぐす定番コース',
      },
      {
        name: 'LONG',
        time: '120',
        price: '23,000',
        description: '心身ともに深く癒される贅沢な時間',
      },
    ],
    [
      { name: 'LUXURY', time: '150', price: '28,000', description: '最高級のトリートメント' },
      { name: 'ROYAL', time: '180', price: '33,000', description: '究極の癒やし体験' },
      { name: 'VIP', time: '210', price: '38,000', description: '完全オーダーメイド' },
    ],
  ];

  const displayItems = items?.[activeTab] || defaultItemsByTab[activeTab];

  return (
    <div
      ref={innerRef}
      className={`bg-white px-4 py-20 md:px-10 ${active ? 'z-10 ring-8 ring-inset ring-rose-500' : ''}`}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
            {title || 'Price Menu'}
          </h2>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 md:text-base">
            {subtitle || '料金プラン'}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-slate-50 bg-white p-6 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] md:rounded-[3rem] md:p-12">
          {/* Tabs */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab(tab.id);
                }}
                className={`transform rounded-full px-6 py-3 text-xs font-black transition-all active:scale-95 md:text-sm ${
                  activeTab === tab.id
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3 md:gap-8">
            {displayItems.map((item: any, i: number) => {
              const isMain = i === 1; // スタンダード（中央）を強調
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center rounded-[2rem] p-8 transition-all duration-500 ${
                    isMain
                      ? 'z-10 scale-105 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-slate-100/50'
                      : 'bg-transparent'
                  }`}
                >
                  <span className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 md:text-[11px]">
                    {item.name}
                  </span>
                  <div className="mb-2 flex items-baseline gap-1">
                    <span className="text-4xl font-black leading-none text-slate-900 md:text-5xl">
                      {item.time}
                    </span>
                    <span className="text-xs font-bold text-slate-400 md:text-sm">min</span>
                  </div>
                  <div className="mb-6 text-xl font-black text-slate-900 md:text-2xl">
                    <span className="mr-0.5 text-base md:text-lg">¥</span>
                    {item.price}
                  </div>
                  <p className="min-h-[2.5rem] text-center text-[10px] font-medium leading-relaxed text-slate-400 md:text-xs">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Notes */}
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <div className="mb-2 flex gap-3">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-[9px] leading-relaxed text-slate-400 md:text-[10px]">
                全てのプランに消費税が含まれております。延長は30分 ¥6,000にて承ります。
              </p>
            </div>
            <div className="flex gap-3">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-[9px] leading-relaxed text-slate-400 md:text-[10px]">
                指名料(¥1,000〜) および出張交通費が別途発生いたします。
              </p>
            </div>
          </div>
        </div>

        {buttonText && (
          <div className="mt-16 text-center">
            <button className="group relative inline-flex transform items-center gap-3 rounded-full bg-slate-900 px-12 py-5 font-black text-white shadow-xl transition-all hover:scale-105 hover:bg-rose-600 active:scale-95">
              <span>{buttonText}</span>
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
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
