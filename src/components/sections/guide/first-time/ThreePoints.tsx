import { EditableImage } from '@/components/admin/EditableImage';
import { ThreePointsConfig } from '@/lib/store/firstTimeConfig';
import React from 'react';

interface ThreePointsProps {
  config?: ThreePointsConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File) => void;
}

export const ThreePoints: React.FC<ThreePointsProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const data = config || {
    imageUrl: '',
    isVisible: true,
  };

  const points = [
    {
      step: 'point 1',
      title: '初めての方限定！120分16,000円！',
      description:
        '本物のサービスをご体験頂けるよう、トップセラピストを含む全セラピストが対象の特別な価格にて初回コースをご案内致します！追加料金なしの明朗会計です。',
      icon: '🍓',
    },
    {
      step: 'point 2',
      title: '女風デビューを失敗させません！',
      description:
        '事前カウンセリングで不安を解消！お店に何度でも無料相談可能です。セラピストとの事前連絡・カウンセリングで当日の不安を解消し、安心して素敵な体験をお楽しみください。',
      icon: '✨',
    },
    {
      step: 'point 3',
      title: 'ゆったり過ごせるボリュームの120分！',
      description:
        '対面カウンセリング＆シャワー後にコーススタート！入室後のカウンセリングとシャワーを浴び終えた後からお時間のカウントを開始。無料時間の長さに驚きと喜びの声を多数頂いております！',
      icon: '⏰',
    },
  ];

  if (data.isVisible === false && !isEditing) return null;

  return (
    <section
      className={`bg-gradient-to-b from-white to-pink-50 py-20 ${!data.isVisible ? 'opacity-50' : ''}`}
    >
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          {data.imageUrl ? (
            <div className="relative mx-auto mb-4 max-w-2xl">
              <EditableImage
                isEditing={isEditing}
                src={data.imageUrl}
                alt="3つの安心ポイント"
                onUpload={(file) => onImageUpload?.('threePoints', file)}
                className="h-auto w-full object-contain"
              />
              {isEditing && (
                <button
                  onClick={() => onUpdate?.('threePoints', 'imageUrl', '')}
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
              <h2 className="text-2xl font-black leading-tight text-gray-800 md:text-4xl">
                ストロベリーボーイズが選ばれる
                <br />
                <span className="text-[#FF4B5C] underline decoration-[#FF4B5C]/30 underline-offset-8">
                  3つの安心ポイント
                </span>
              </h2>
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
                        if (file) onImageUpload?.('threePoints', file);
                      }}
                    />
                  </label>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {points.map((p, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-red-50 bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl"
            >
              <div className="mb-4 text-sm font-black uppercase tracking-widest text-[#FF4B5C]">
                {p.step}
              </div>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold leading-tight text-gray-800">
                <span className="text-2xl">{p.icon}</span>
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 md:text-base">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
