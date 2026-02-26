import { FirstTimeHeroConfig } from '@/lib/store/firstTimeConfig';
import React from 'react';

interface HeroProps {
  storeName?: string;
  config?: FirstTimeHeroConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
}

export const Hero: React.FC<HeroProps> = ({
  storeName = 'STRAWBERRY BOYS',
  config,
  isEditing,
  onUpdate,
}) => {
  const defaultData: FirstTimeHeroConfig = {
    badge: 'FOR FIRST TIME VISITORS',
    mainHeading: '頑張るあなたの心に、',
    subHeading: '一粒のご褒美を。',
    subHeadingAccent: '一粒のご褒美を。',
    priceBadgeTitle: '＼ 初回限定特典 ／',
    priceBadgeCourse: '120分コース',
    priceBadgeOldPrice: '¥20,000',
    priceBadgeNewPrice: '¥16,000',
    priceBadgeDescription:
      '一番人気の満足プラン。\n技術もマインドも超一流な\nセラピストにお任せください。',
    isVisible: true,
  };

  const data = config ? { ...defaultData, ...config } : defaultData;

  const handleTextUpdate = (key: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      onUpdate('hero', key, e.currentTarget.innerText);
    }
  };

  if (data.isVisible === false && !isEditing) return null;

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-red-50 pb-20 pt-8 md:pb-32 md:pt-12 ${!data.isVisible ? 'opacity-50' : ''}`}
    >
      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div
            contentEditable={isEditing}
            onBlur={(e) => handleTextUpdate('badge', e)}
            suppressContentEditableWarning
            className="mb-4 inline-block rounded-full bg-[#FF4B5C] px-4 py-1 text-sm font-bold tracking-wider text-white"
          >
            {data.badge}
          </div>
          <h1
            contentEditable={isEditing}
            onBlur={(e) => handleTextUpdate('mainHeading', e)}
            suppressContentEditableWarning
            className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl lg:text-6xl"
          >
            {data.mainHeading}
          </h1>
          <h2 className="mb-8 text-2xl font-black text-gray-800 md:text-4xl">
            <span
              contentEditable={isEditing}
              onBlur={(e) => handleTextUpdate('subHeadingAccent', e)}
              suppressContentEditableWarning
              className="text-[#FF4B5C]"
            >
              {data.subHeadingAccent}
            </span>
          </h2>

          <div className="group relative cursor-pointer transition-transform duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-[#FF4B5C] opacity-20 blur-xl transition-opacity group-hover:opacity-40"></div>
            <div className="relative flex flex-col items-center gap-6 rounded-3xl border-4 border-[#FF4B5C] bg-white p-6 shadow-2xl md:flex-row md:p-8">
              <div className="text-left">
                <span
                  contentEditable={isEditing}
                  onBlur={(e) => handleTextUpdate('priceBadgeTitle', e)}
                  suppressContentEditableWarning
                  className="text-lg font-bold text-[#FF4B5C]"
                >
                  {data.priceBadgeTitle}
                </span>
                <h2
                  contentEditable={isEditing}
                  onBlur={(e) => handleTextUpdate('priceBadgeCourse', e)}
                  suppressContentEditableWarning
                  className="text-2xl font-black text-gray-800 md:text-3xl"
                >
                  {data.priceBadgeCourse}
                </h2>
                <div className="mt-2 flex items-baseline gap-2">
                  <span
                    contentEditable={isEditing}
                    onBlur={(e) => handleTextUpdate('priceBadgeOldPrice', e)}
                    suppressContentEditableWarning
                    className="text-lg text-gray-400 line-through"
                  >
                    {data.priceBadgeOldPrice}
                  </span>
                  <span
                    contentEditable={isEditing}
                    onBlur={(e) => handleTextUpdate('priceBadgeNewPrice', e)}
                    suppressContentEditableWarning
                    className="text-4xl font-black text-[#FF4B5C] md:text-5xl"
                  >
                    {data.priceBadgeNewPrice}
                  </span>
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 md:h-20 md:w-px"></div>
              <div className="text-center md:text-left">
                <p
                  contentEditable={isEditing}
                  onBlur={(e) => handleTextUpdate('priceBadgeDescription', e)}
                  suppressContentEditableWarning
                  className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600"
                >
                  {data.priceBadgeDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Strawberries */}
      <div className="animate-float absolute right-[10%] top-10 hidden opacity-20 md:block">
        <span className="text-8xl">🍓</span>
      </div>
      <div className="animate-float absolute bottom-20 left-[5%] hidden opacity-10 delay-700 md:block">
        <span className="text-9xl">🍓</span>
      </div>
    </section>
  );
};
