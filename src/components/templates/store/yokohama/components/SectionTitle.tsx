import { Camera, Image as ImageIcon } from 'lucide-react';
import NextImage from 'next/image';
import React from 'react';

interface SectionTitleProps {
  en: string;
  ja: string;
  imageUrl?: string;
  isEditing?: boolean;
  onUpdateEn?: (val: string) => void;
  onUpdateJa?: (val: string) => void;
  onImageUpload?: () => void;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  en,
  ja,
  imageUrl,
  isEditing,
  onUpdateEn,
  onUpdateJa,
  onImageUpload,
}) => (
  <div className="group relative z-10 mb-8 px-4 text-center md:mb-12">
    {imageUrl ? (
      <div className="relative mx-auto mb-4 flex max-w-[300px] items-center justify-center md:max-w-[400px]">
        <div className="relative h-20 w-full md:h-28">
          <NextImage
            src={imageUrl}
            alt={ja}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 300px, 400px"
          />
        </div>
        {isEditing && (
          <button
            onClick={onImageUpload}
            className="absolute -right-2 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
            title="タイトル画像を変更"
          >
            <Camera size={16} />
          </button>
        )}
      </div>
    ) : (
      <>
        <h2
          contentEditable={isEditing}
          suppressContentEditableWarning={isEditing}
          onBlur={(e) => isEditing && onUpdateEn?.(e.currentTarget.innerText)}
          className={`mb-2 font-serif text-2xl tracking-widest text-slate-800 md:text-4xl outline-none ${isEditing ? 'rounded px-1 hover:bg-neutral-50' : ''}`}
        >
          {en}
        </h2>
        {isEditing && (
          <button
            onClick={onImageUpload}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-100"
          >
            <ImageIcon size={12} />
            タイトルを画像に設定
          </button>
        )}
      </>
    )}

    <div className="flex items-center justify-center gap-3">
      <div className="h-[1px] w-6 bg-slate-200 md:w-8"></div>
      <p
        contentEditable={isEditing}
        suppressContentEditableWarning={isEditing}
        onBlur={(e) => isEditing && onUpdateJa?.(e.currentTarget.innerText)}
        className={`font-sans text-[10px] tracking-[0.2em] text-slate-500 md:text-sm outline-none ${isEditing ? 'rounded px-1 hover:bg-neutral-50' : ''}`}
      >
        {ja}
      </p>
      <div className="h-[1px] w-6 bg-slate-200 md:w-8"></div>
    </div>
  </div>
);

export default SectionTitle;
