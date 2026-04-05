import { EditableImage } from '@/components/admin/EditableImage';
import { CTAConfig } from '@/lib/store/firstTimeConfig';
import React from 'react';

interface CTAProps {
  lineId?: string;
  config?: CTAConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File) => void;
}

export const CTA: React.FC<CTAProps> = ({
  lineId = '@204ynfuu',
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const data = config || {
    heading: 'まずは相談だけ、という方もお気軽に.\n私たちが貴女のデビューを\n大切にサポートします。',
    imageUrl: '',
    isVisible: true,
  };

  if (data.isVisible === false && !isEditing) return null;

  return (
    <section
      className={`relative overflow-hidden bg-white py-24 ${!data.isVisible ? 'opacity-50' : ''}`}
    >
      <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
        <div className="mb-8 flex justify-center">
          {data.imageUrl ? (
            <div className="relative mx-auto h-[100px] w-full max-w-[120px]">
              <EditableImage
                isEditing={isEditing}
                src={data.imageUrl}
                alt="CTA"
                onUpload={(file) => onImageUpload?.('cta', file)}
                className="h-full w-full object-contain"
              />
              {isEditing && (
                <button
                  onClick={() => onUpdate?.('cta', 'imageUrl', '')}
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
            <div className="relative">
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float-cta {
                  0% { transform: translateY(0px); }
                  50% { transform: translateY(-15px); }
                  100% { transform: translateY(0px); }
                }
                .animate-float-cta {
                  animation: float-cta 3s ease-in-out infinite;
                }
              `}} />
              <img 
                src="/img/guide/strawberry-chan.png" 
                alt="Strawberry-chan" 
                className="mx-auto h-48 w-auto animate-float-cta"
              />
              <div className="absolute -right-4 -top-2 rounded-lg border bg-white px-2 py-1 text-[10px] font-bold shadow-sm">
                ご相談ください!
              </div>
              {isEditing && (
                <div className="mt-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-stone-100 px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-stone-200">
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
                    画像を設置する
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onImageUpload?.('cta', file);
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        <h2 
          contentEditable={isEditing}
          onBlur={(e) => onUpdate?.('cta', 'heading', e.currentTarget.innerText)}
          suppressContentEditableWarning
          className="mb-6 text-2xl font-black leading-tight md:text-4xl whitespace-pre-wrap outline-none focus:ring-2 focus:ring-pink-200 rounded px-1 text-gray-900"
        >
          {data.heading}
        </h2>

        <div className="flex flex-col items-center gap-6">
          <a
            href={`https://line.me/R/ti/p/${lineId.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full max-w-lg"
          >
            <div className="absolute inset-0 bg-[#06C755] opacity-20 blur-xl transition-opacity group-hover:opacity-40"></div>
            <div className="relative flex flex-col items-center justify-center gap-4 rounded-[40px] bg-[#06C755] py-6 text-white shadow-2xl transition-all group-hover:-translate-y-1 md:flex-row md:py-8">
              <div className="rounded-2xl bg-white p-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/124/124034.png"
                  alt="LINE"
                  className="h-10 w-10"
                />
              </div>
              <div className="text-center md:text-left">
                <div className="text-xl font-black md:text-2xl">LINEで簡単予約・お問い合わせ</div>
                <div className="text-sm opacity-90">
                  <span className="mr-2 rounded bg-white/20 px-2 py-0.5">スタンプ1つでもOK</span>
                  こちらをクリックして友達登録
                </div>
              </div>
            </div>
          </a>

          <div className="text-sm font-medium text-gray-500">
            LINE ID: <span className="font-bold text-gray-800">{lineId}</span>
          </div>

          <p className="text-xs text-gray-400">24時間受付中 / 相談だけでもOKです</p>
        </div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute left-0 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFF0F3] opacity-50 blur-3xl"></div>
      <div className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-red-50 opacity-50 blur-3xl"></div>
    </section>
  );
};
