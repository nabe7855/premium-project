import React from 'react';

interface SectionTitleProps {
  en: string;
  ja: string;
  isEditing?: boolean;
  onUpdateEn?: (val: string) => void;
  onUpdateJa?: (val: string) => void;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ en, ja, isEditing, onUpdateEn, onUpdateJa }) => (
  <div className="relative z-10 mb-8 px-4 text-center md:mb-12">
    <h2
      contentEditable={isEditing}
      suppressContentEditableWarning={isEditing}
      onBlur={(e) => isEditing && onUpdateEn?.(e.currentTarget.innerText)}
      className={`mb-2 font-serif text-2xl tracking-widest text-slate-800 md:text-4xl outline-none ${isEditing ? 'rounded px-1 hover:bg-neutral-50' : ''}`}
    >
      {en}
    </h2>
    <div className="flex items-center justify-center gap-3">
      <div className="bg-primary-300 h-[1px] w-6 md:w-8"></div>
      <p
        contentEditable={isEditing}
        suppressContentEditableWarning={isEditing}
        onBlur={(e) => isEditing && onUpdateJa?.(e.currentTarget.innerText)}
        className={`font-sans text-[10px] tracking-[0.2em] text-slate-700 md:text-sm outline-none ${isEditing ? 'rounded px-1 hover:bg-neutral-50' : ''}`}
      >
        {ja}
      </p>
      <div className="bg-primary-300 h-[1px] w-6 md:w-8"></div>
    </div>
  </div>
);

export default SectionTitle;
