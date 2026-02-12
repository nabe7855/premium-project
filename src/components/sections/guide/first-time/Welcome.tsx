import { WelcomeConfig } from '@/lib/store/firstTimeConfig';
import React from 'react';

interface WelcomeProps {
  storeName?: string;
  config?: WelcomeConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({
  storeName = 'ストロベリーボーイズ',
  config,
  isEditing,
  onUpdate,
}) => {
  const data = config || {
    heading: 'ストロベリーボーイズへ、ようこそ。',
    subHeading: 'ABOUT STRAWBERRY BOYS',
    content: [
      '日々、忙しく働く女性の皆様。',
      'たまには自分を甘やかして、心も身体もとろけるような最高の癒やしを体験してみませんか？',
      'ストロベリーボーイズは、そんな貴女のために誕生した、福岡随一のプレミアム・メンズエステです。',
    ],
    isVisible: true,
  };

  const handleTextUpdate = (key: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      onUpdate('welcome', key, e.currentTarget.innerText);
    }
  };

  if (data.isVisible === false && !isEditing) return null;

  return (
    <section
      className={`overflow-hidden bg-white py-16 md:py-24 ${!data.isVisible ? 'opacity-50' : ''}`}
    >
      <div className="container mx-auto max-w-4xl px-4">
        <div className="relative">
          <div className="absolute inset-0 translate-x-2 translate-y-2 transform rounded-lg bg-stone-100 opacity-50"></div>

          <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-[#FFFEFA] p-8 leading-relaxed text-gray-800 shadow-2xl md:p-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'linear-gradient(#000 1px, transparent 1px)',
                backgroundSize: '100% 3rem',
                marginTop: '5rem',
              }}
            ></div>

            <div className="relative z-10 mb-12 inline-block border-b-2 border-[#FF4B5C]/20 pb-4">
              <h2
                contentEditable={isEditing}
                onBlur={(e) => handleTextUpdate('heading', e)}
                suppressContentEditableWarning
                className="text-xl font-bold tracking-widest text-gray-700 md:text-3xl"
              >
                {data.heading}
              </h2>
              <div
                contentEditable={isEditing}
                onBlur={(e) => handleTextUpdate('subHeading', e)}
                suppressContentEditableWarning
                className="mt-2 text-sm font-bold text-[#FF4B5C]"
              >
                {data.subHeading}
              </div>
            </div>

            <div className="relative z-10 space-y-8 text-base md:text-lg">
              <div className="space-y-6 text-gray-600">
                {data.content.map((para, idx) => (
                  <p
                    key={idx}
                    contentEditable={isEditing}
                    onBlur={(e) => {
                      if (onUpdate) {
                        const newContent = [...data.content];
                        newContent[idx] = e.currentTarget.innerText;
                        onUpdate('welcome', 'content', newContent);
                      }
                    }}
                    suppressContentEditableWarning
                  >
                    {para}
                  </p>
                ))}
              </div>

              <div className="flex flex-col items-end pt-12">
                <div className="text-right">
                  <p className="mb-2 text-sm text-gray-400">貴女に寄り添うパートナーとして</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-gray-800 md:text-2xl">
                      {storeName} 一同
                    </span>
                    <div className="flex h-12 w-12 rotate-12 transform items-center justify-center rounded-full border-2 border-white bg-[#FF4B5C] text-white shadow-lg">
                      <span className="text-2xl">🍓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
