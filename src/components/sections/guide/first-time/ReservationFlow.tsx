import { EditableImage } from '@/components/admin/EditableImage';
import { ReservationFlowConfig } from '@/lib/store/firstTimeConfig';
import React from 'react';

interface ReservationFlowProps {
  config?: ReservationFlowConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File) => void;
}

export const ReservationFlow: React.FC<ReservationFlowProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const data = config || {
    imageUrl: '',
    isVisible: true,
  };

  const steps = [
    {
      title: 'セラピストを決める',
      desc: 'まずはセラピスト一覧から.写メ日記や口コミを参考に.ご指名がある場合はその方を,決まっていない場合はお店にご相談ください.貴女に合った方をスタッフが選定します.',
    },
    {
      title: 'お店に問い合わせ・申し込み',
      desc: '電話・メール・LINE・X(旧Twitter)のDMから.お急ぎの場合は電話かLINEがスムーズです.',
      details: [
        '【日時】第三希望まであるとスムーズです',
        '【待ち合わせ場所】新宿、渋谷、池袋、鶯谷などが推奨ですが、ご自宅も可能です',
        '【コース内容】初回の方は120分16,000円コースが推奨です',
        '【指名の有無】ご希望がある場合はお伝えください',
      ],
    },
    {
      title: '担当セラピストの決定',
      desc: 'ご指名がある場合はお店が確認後、ご報告。指名がない場合はお客様の要望（年齢、性格など）に合ったセラピストを厳選してご報告いたします。',
    },
    {
      title: 'ご予約完了',
      desc: '最終確認を行い受付完了。変更点があればお気軽にお申し付けください。当店ではセラピストとの事前のメッセージ交換を推奨しており、当日を安心して迎えられます。',
    },
  ];

  if (data.isVisible === false && !isEditing) return null;

  return (
    <section className={`bg-white py-20 ${!data.isVisible ? 'opacity-50' : ''}`}>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-16 text-center">
          {data.imageUrl ? (
            <div className="relative mx-auto mb-4 max-w-2xl">
              <EditableImage
                isEditing={isEditing}
                src={data.imageUrl}
                alt="ご利用までの流れ"
                onUpload={(file) => onImageUpload?.('reservationFlow', file)}
                className="h-auto w-full object-contain"
              />
              {isEditing && (
                <button
                  onClick={() => onUpdate?.('reservationFlow', 'imageUrl', '')}
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
              <h2 className="text-3xl font-black">ご利用までの流れ</h2>
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
                        if (file) onImageUpload?.('reservationFlow', file);
                      }}
                    />
                  </label>
                </div>
              )}
            </>
          )}
        </div>

        <div className="relative space-y-12">
          <div className="absolute bottom-0 left-6 top-0 hidden w-1 bg-[#FFF0F3] md:left-1/2 md:-ml-0.5 md:block"></div>

          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex flex-col items-start md:flex-row md:items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-full flex-1 md:w-auto">
                <div
                  className={`relative rounded-3xl border border-gray-100 bg-gray-50 p-6 md:p-8 ${i % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}
                >
                  <h3 className="mb-3 text-xl font-bold text-[#FF4B5C]">
                    ステップ {i + 1}: {s.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-600 md:text-base">
                    {s.desc}
                  </p>
                  {s.details && (
                    <div className="space-y-1 rounded-xl border border-red-50 bg-white/80 p-4 text-xs text-gray-500 md:text-sm">
                      <p className="mb-2 font-bold text-gray-700">
                        予約時に以下の情報をお伝えください：
                      </p>
                      {s.details.map((d, j) => (
                        <p key={j}>・{d}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="z-10 hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#FF4B5C] text-xl font-bold text-white shadow-lg md:flex">
                {i + 1}
              </div>
              <div className="hidden flex-1 md:block"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
