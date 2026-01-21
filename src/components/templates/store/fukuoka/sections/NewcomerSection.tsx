import { NewcomerConfig } from '@/lib/store/storeTopConfig';
import React from 'react';

interface NewcomerSectionProps {
  config?: NewcomerConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const NewcomerSection: React.FC<NewcomerSectionProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload: _onImageUpload,
}) => {
  if (!config || (!config.isVisible && !isEditing)) return null;

  const items = config.items || [];

  return (
    <section
      id="newcomer"
      className={`bg-white py-16 md:py-24 ${!config.isVisible && isEditing ? 'opacity-40' : ''}`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Image-matching Header */}
        <div className="mb-12 overflow-hidden rounded-xl bg-gradient-to-r from-[#9C7E4F] via-[#C4A97A] to-[#9C7E4F] py-6 text-center text-white shadow-lg md:py-8">
          <h2
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => onUpdate?.('newcomer', 'heading', e.currentTarget.innerText)}
            className={`mb-2 font-serif text-xl font-bold tracking-[0.2em] outline-none md:text-3xl ${isEditing ? 'rounded px-2 hover:bg-white/10' : ''}`}
          >
            {config.heading}
          </h2>
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => onUpdate?.('newcomer', 'courseText', e.currentTarget.innerText)}
            className={`text-sm font-medium tracking-widest outline-none md:text-xl ${isEditing ? 'rounded px-2 hover:bg-white/10' : ''}`}
          >
            {config.courseText}
          </p>
        </div>

        {/* Horizontal Slider / Grid */}
        <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-8 md:mx-0 md:grid md:grid-cols-6 md:gap-4 md:px-0">
          {items.map((item) => (
            <div key={item.id} className="group relative min-w-[140px] snap-center md:min-w-0">
              {/* Manual Removal Disabled for dynamic Newcomer section */}
              {/* isEditing && (
                <button
                  onClick={() => removeItem(idx)}
                  className="absolute right-4 top-4 z-50 rounded-full bg-red-500 p-2 text-white shadow-lg transition-transform hover:scale-110"
                >
                  <Trash2 size={16} />
                </button>
              ) */}

              <div className="relative mb-2">
                <div className="relative aspect-[3/4] overflow-hidden border-[2px] border-[#C4A97A] shadow-md transition-all duration-500 group-hover:shadow-xl">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Manual Image Change Disabled for dynamic Newcomer section */}
                  {/* isEditing && (
                    <label className="absolute inset-0 z-40 flex cursor-pointer flex-col items-center justify-center bg-black/30 text-white opacity-0 transition-opacity hover:opacity-100">
                      <Camera size={40} className="mb-2" />
                      <span className="text-xs font-bold">画像を変更</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, idx)}
                      />
                    </label>
                  ) */}

                  {/* "New Face" Badge */}
                  <div className="absolute right-2 top-2 flex h-10 w-10 flex-col items-center justify-center rounded-full border border-[#C4A97A] bg-white/95 text-center shadow-sm">
                    <span className="font-serif text-[8px] leading-none text-[#9C7E4F]">New</span>
                    <span className="font-serif text-[8px] leading-none text-[#9C7E4F]">Face</span>
                  </div>
                </div>
              </div>

              <div className="px-1 text-left">
                <h3
                  className={`mb-0.5 font-serif text-sm font-bold tracking-widest text-slate-800 outline-none`}
                >
                  {item.name}
                </h3>
                <div className="flex gap-1 font-serif text-[10px] tracking-widest text-[#9C7E4F]">
                  <span className="outline-none">{item.age}</span>
                  <span>/</span>
                  <span className="text-[#C4A97A]">T</span>
                  <span className="tracking-tighter outline-none">{item.height}</span>
                  <span className="ml-[-1px]">cm</span>
                </div>
              </div>
            </div>
          ))}

          {/* Manual Addition Disabled for dynamic Newcomer section */}
          {/* isEditing && (
            <button
              onClick={addItem}
              className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#C4A97A] bg-white/50 p-8 text-[#9C7E4F] transition-all hover:bg-neutral-50"
            >
              <Plus size={40} className="mb-2" />
              <span className="text-xs font-bold">新人を追加</span>
            </button>
          ) */}
        </div>
      </div>
    </section>
  );
};

export default NewcomerSection;
