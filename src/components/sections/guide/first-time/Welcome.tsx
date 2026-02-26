import { EditableImage } from '@/components/admin/EditableImage';
import { WelcomeConfig } from '@/lib/store/firstTimeConfig';
import React from 'react';

interface WelcomeProps {
  storeName?: string;
  config?: WelcomeConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({
  storeName = 'ストロベリーボーイズ',
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const defaultData: WelcomeConfig = {
    heading: 'ストロベリーボーイズへ、ようこそ。',
    subHeading: 'ABOUT STRAWBERRY BOYS',
    imageUrl: '',
    content: [
      '日々、忙しく働く女性の皆様。',
      'たまには自分を甘やかして、心も身体もとろけるような最高の癒やしを体験してみませんか？',
      'ストロベリーボーイズは、そんな貴女のために誕生した、福岡随一のプレミアム・メンズエステです。',
    ],
    isVisible: true,
  };

  const data = config ? { ...defaultData, ...config } : defaultData;

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

            <div className="relative z-10 mb-12 inline-block w-full border-b-2 border-[#FF4B5C]/20 pb-4">
              {data.imageUrl ? (
                <div className="relative mb-4 max-w-2xl">
                  <EditableImage
                    isEditing={isEditing}
                    src={data.imageUrl}
                    alt="Welcome to STRAWBERRY BOYS"
                    onUpload={(file) => onImageUpload?.('welcome', file)}
                    className="h-auto w-full object-contain"
                  />
                  {isEditing && (
                    <button
                      onClick={() => onUpdate?.('welcome', 'imageUrl', '')}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <>
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
                  {isEditing && (
                    <div className="mt-4">
                      <label className="flex cursor-pointer items-center gap-2 rounded-md bg-stone-100 px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-stone-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        画像ヘッダーを使用する
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onImageUpload?.('welcome', file);
                          }}
                        />
                      </label>
                    </div>
                  )}
                </>
              )}
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
