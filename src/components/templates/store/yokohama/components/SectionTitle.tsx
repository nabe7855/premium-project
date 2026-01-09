import React from 'react';

interface SectionTitleProps {
  en: string;
  ja: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ en, ja }) => (
  <div className="relative z-10 mb-8 px-4 text-center md:mb-12">
    <h2 className="mb-2 font-serif text-2xl tracking-widest text-slate-800 md:text-4xl">{en}</h2>
    <div className="flex items-center justify-center gap-3">
      <div className="bg-primary-300 h-[1px] w-6 md:w-8"></div>
      <p className="font-sans text-[10px] tracking-[0.2em] text-slate-500 md:text-sm">{ja}</p>
      <div className="bg-primary-300 h-[1px] w-6 md:w-8"></div>
    </div>
  </div>
);

export default SectionTitle;
