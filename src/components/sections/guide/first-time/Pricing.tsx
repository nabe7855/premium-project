import { EditableImage } from '@/components/admin/EditableImage';
import { PricingConfig } from '@/lib/store/firstTimeConfig';
import React from 'react';

interface PricingProps {
  config?: PricingConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File) => void;
}

export const Pricing: React.FC<PricingProps> = ({ config, isEditing, onUpdate, onImageUpload }) => {
  const data = config || {
    imageUrl: '',
    isVisible: true,
  };

  if (data.isVisible === false && !isEditing) return null;

  return (
    <section className={`bg-white py-20 ${!data.isVisible ? 'opacity-50' : ''}`}>
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          {data.imageUrl ? (
            <div className="relative mx-auto mb-4 max-w-2xl">
              <EditableImage
                isEditing={isEditing}
                src={data.imageUrl}
                alt="ご利用プランの一覧"
                onUpload={(file) => onImageUpload?.('pricing', file)}
                className="h-auto w-full object-contain"
              />
              {isEditing && (
                <button
                  onClick={() => onUpdate?.('pricing', 'imageUrl', '')}
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
              <h2 className="mb-4 text-center text-3xl font-black">ご利用プランの一覧</h2>
              <p className="mb-4 text-center text-gray-500">
                当店一番人気の初回120分コースを推奨しております♪
              </p>
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
                    画像ヘッダーを使用する
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onImageUpload?.('pricing', file);
                      }}
                    />
                  </label>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8">
          {/* Main 120min Course (Focused) */}
          <div className="flex flex-col overflow-hidden rounded-3xl border-2 border-[#FF4B5C] bg-white shadow-2xl md:flex-row">
            <div className="flex flex-col items-center justify-center border-b border-gray-100 bg-gray-50 p-8 md:w-1/4 md:border-b-0 md:border-r">
              <span className="mb-2 text-sm font-bold text-[#FF4B5C]">初回120分</span>
              <span className="text-2xl font-black text-gray-800">金額</span>
            </div>
            <div className="flex-1 p-8 text-center md:p-12 md:text-left">
              <div className="mb-6 flex flex-col items-center gap-4 md:flex-row">
                <span className="text-2xl text-gray-300 line-through">20,000円</span>
                <span className="text-5xl font-black tracking-tighter text-[#FF4B5C] md:text-6xl">
                  16,000円
                </span>
              </div>
              <div className="rounded-2xl bg-red-50 p-6">
                <p className="mb-4 font-bold text-gray-700">【備考】</p>
                <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                  初めてご利用のお客様から、多くのご指示を頂いている当店一番人気コースです♡
                  <br />
                  2時間をかけてメインの施術行程を存分にご堪能いただけます。指圧、パウダー、オイル、性感マッサージの全てを網羅したトータルリラクゼーションに最適です！
                </p>
              </div>
            </div>
          </div>

          {/* Sub Courses */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border-2 border-red-100 p-8 transition-colors hover:border-red-200">
              <h3 className="mb-4 text-center text-xl font-black">初回150分コース</h3>
              <div className="mb-6 flex items-baseline justify-center gap-2">
                <span className="text-sm text-gray-300 line-through">24,000円</span>
                <span className="text-3xl font-black text-[#FF4B5C]">22,000円</span>
              </div>
              <p className="text-center text-sm text-gray-500">
                もう少しお時間に余裕を持ちたい時の150分コースです♡
              </p>
            </div>
            <div className="rounded-3xl border-2 border-red-100 p-8 transition-colors hover:border-red-200">
              <h3 className="mb-4 text-center text-xl font-black">初回180分コース</h3>
              <div className="mb-6 flex items-baseline justify-center gap-2">
                <span className="text-sm text-gray-300 line-through">29,000円</span>
                <span className="text-3xl font-black text-[#FF4B5C]">27,000円</span>
              </div>
              <p className="text-center text-sm text-gray-500">
                総額7,000円お得な180分コース。究極の癒しに。
              </p>
            </div>
          </div>
        </div>

        {/* Other Fees */}
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-100 bg-gray-50 p-8">
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-2 border-b border-gray-200 pb-4 md:flex-row md:items-center">
              <div>
                <span className="text-lg font-bold text-gray-800">指名料</span>
                <p className="text-xs text-gray-400">何度指名しても同額です</p>
              </div>
              <span className="text-2xl font-black tracking-tighter text-[#FF4B5C]">1,000円</span>
            </div>
            <div className="flex flex-col justify-between gap-2 border-b border-gray-200 pb-4 md:flex-row md:items-center">
              <div>
                <span className="text-lg font-bold text-gray-800">延長30分</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-[#FF4B5C]">6,000円</span>
            </div>
          </div>
          <p className="mt-6 text-[10px] leading-relaxed text-gray-400">
            【料金構成】①初回コース料金 + ②出張費(23区以内、その他相談) + ③指名料(指名なし無料)
            <br />
            ※初回特典は全セラピストに適用可能です。
            <br />
            ※前日までのご予約で優先案内いたします。お早めにご相談ください。
            <br />
            上記①②③合計の金額を担当セラピストに現金でお渡しください。
          </p>
        </div>
      </div>
    </section>
  );
};
