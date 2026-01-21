import { NewcomerConfig } from '@/lib/store/storeTopConfig';
import React from 'react';

interface NewcomerSectionProps {
  config?: NewcomerConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const NewcomerSection: React.FC<NewcomerSectionProps> = ({ config, isEditing }) => {
  if (!config || !config.isVisible) return null;

  return (
    <section id="newcomer" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Image-matching Header */}
        <div className="mb-12 overflow-hidden rounded-xl bg-gradient-to-r from-[#9C7E4F] via-[#C4A97A] to-[#9C7E4F] py-6 text-center text-white shadow-lg md:py-8">
          <h2 className="mb-2 font-serif text-xl font-bold tracking-[0.2em] md:text-3xl">
            {config.heading}
          </h2>
          <p className="text-sm font-medium tracking-widest md:text-xl">{config.courseText}</p>
        </div>

        {isEditing && (
          <div className="mb-8 rounded border border-[#C4A97A] bg-amber-50 p-2 text-center text-xs text-[#9C7E4F]">
            ※ 新人キャスト情報の編集は管理者設定からのみ可能です
          </div>
        )}

        {/* Horizontal Slider / Grid */}
        <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-8 md:mx-0 md:grid md:grid-cols-6 md:gap-4 md:px-0">
          {config.items.map((item) => (
            <div key={item.id} className="min-w-[140px] snap-center md:min-w-0">
              <div className="group relative mb-2">
                {/* Image with brown/gold border matching the image */}
                <div className="relative aspect-[3/4] overflow-hidden border-[2px] border-[#C4A97A] shadow-md transition-all duration-500 group-hover:shadow-xl">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* "New Face" Badge */}
                  <div className="absolute right-2 top-2 flex h-10 w-10 flex-col items-center justify-center rounded-full border border-[#C4A97A] bg-white/95 text-center shadow-sm">
                    <span className="font-serif text-[8px] leading-none text-[#9C7E4F]">New</span>
                    <span className="font-serif text-[8px] leading-none text-[#9C7E4F]">Face</span>
                  </div>
                </div>
              </div>

              <div className="px-1 text-left">
                <h3 className="mb-0.5 font-serif text-sm font-bold tracking-widest text-slate-800">
                  {item.name}
                </h3>
                <p className="font-serif text-[10px] tracking-widest text-[#9C7E4F]">
                  {item.age} / <span className="text-[#C4A97A]">T</span>
                  {item.height}cm
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewcomerSection;
