import { EditableImage } from '@/components/admin/EditableImage';
import { DayFlowConfig } from '@/lib/store/firstTimeConfig';
import React from 'react';

interface DayFlowProps {
  config?: DayFlowConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File) => void;
}

export const DayFlow: React.FC<DayFlowProps> = ({ config, isEditing, onUpdate, onImageUpload }) => {
  const defaultData: DayFlowConfig = {
    imageUrl: '',
    steps: [
      {
        title: 'セラピストと合流',
        desc: '駅改札前やUNIQLO前など、事前に伝えた貴女の服装を元にセラピストからお声がけします。スムーズに合流できない場合はお店が仲介するのでご安心を！',
      },
      {
        title: 'ホテルへ移動',
        desc: 'セラピストがいくつかピックアップしてご提案。デート気分でエスコートされます。入室後、ご利用料金を現金でセラピストにお渡しください。',
      },
      {
        title: 'カウンセリング',
        desc: '10〜15分程度。カウンセリングシートを使い、要望や重点的にしてほしい項目、NG項目を確認します。「寄り添う事」がテーマの特別な時間です。',
      },
      {
        title: 'シャワー',
        desc: 'リラックスしていただくためにお客様から先にシャワー。洗体オプション（+2,000円）で一緒に入浴して、お身体を丁寧に洗うプランも人気です♡',
      },
      {
        title: 'カウント開始',
        desc: 'お客様がシャワーを出たタイミングでコース時間スタート！ここまでの時間は完全無料です。心地よい非日常のひとときを存分にお楽しみください。',
      },
    ],
    footerNote: '※シャワー後のカウント開始までのお時間は全て【無料】です',
    isVisible: true,
  };

  const data = config ? { ...defaultData, ...config } : defaultData;

  const currentSteps = data.steps || [];

  const handleStepUpdate = (index: number, key: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      const newSteps = [...currentSteps];
      newSteps[index] = { ...newSteps[index], [key]: e.currentTarget.innerText };
      onUpdate('dayFlow', 'steps', newSteps);
    }
  };

  const handleUpdateField = (key: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      onUpdate('dayFlow', key, e.currentTarget.innerText);
    }
  };

  if (data.isVisible === false && !isEditing) return null;

  return (
    <section className={`bg-[#FFF0F3]/50 py-20 ${!data.isVisible ? 'opacity-50' : ''}`}>
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          {data.imageUrl ? (
            <div className="relative mx-auto mb-4 max-w-2xl">
              <EditableImage
                isEditing={isEditing}
                src={data.imageUrl}
                alt="ご予約当日の流れ"
                onUpload={(file) => onImageUpload?.('dayFlow', file)}
                className="h-auto w-full object-contain"
              />
              {isEditing && (
                <button
                  onClick={() => onUpdate?.('dayFlow', 'imageUrl', '')}
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
              <h2 className="mb-4 text-center text-3xl font-black">ご予約当日の流れ</h2>
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
                        if (file) onImageUpload?.('dayFlow', file);
                      }}
                    />
                  </label>
                </div>
              )}
            </>
          )}
          <p
            contentEditable={isEditing}
            onBlur={(e) => handleUpdateField('footerNote', e)}
            suppressContentEditableWarning
            className="mt-4 font-medium text-gray-500"
          >
            {data.footerNote}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {currentSteps.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex h-full w-full flex-col items-center rounded-2xl border border-white bg-white p-6 text-center shadow-md transition-all hover:border-[#FF4B5C]/20">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF4B5C] font-bold text-white shadow-lg">
                  {i + 1}
                </div>
                <h3 className="mb-4 text-base font-bold leading-tight text-gray-800">
                  ステップ {i + 1}
                  <br />
                  <span
                    contentEditable={isEditing}
                    onBlur={(e) => handleStepUpdate(i, 'title', e)}
                    suppressContentEditableWarning
                  >
                    {s.title}
                  </span>
                </h3>
                <p
                  contentEditable={isEditing}
                  onBlur={(e) => handleStepUpdate(i, 'desc', e)}
                  suppressContentEditableWarning
                  className="text-left text-xs leading-relaxed text-gray-500"
                >
                  {s.desc}
                </p>
              </div>
              {i < currentSteps.length - 1 && (
                <div className="py-4 text-2xl font-bold text-[#FF4B5C] md:hidden">↓</div>
              )}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl rounded-3xl border-2 border-[#FF4B5C]/20 bg-white p-8 text-center shadow-xl">
          <p className="text-sm leading-relaxed text-gray-600 md:text-base">
            当日までご不安な方は、
            <span className="font-bold text-[#FF4B5C]">担当セラピストとの事前カウンセリング</span>
            を推奨しております。
            <br />
            LINEやDMで事前に相談しておくことで、当日の楽しみが倍増します♡
          </p>
        </div>
      </div>
    </section>
  );
};
