import { EditableImage } from '@/components/admin/EditableImage';
import { SevenReasonsConfig } from '@/lib/store/firstTimeConfig';
import React from 'react';

interface SevenReasonsProps {
  groupName?: string;
  config?: SevenReasonsConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File) => void;
}

export const SevenReasons: React.FC<SevenReasonsProps> = ({
  groupName = 'SBグループ',
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const data = config || {
    imageUrl: '',
    isVisible: true,
  };

  const reasons = [
    {
      title: '業界初！200件以上の受付口コミ！',
      desc: '透明性を重視し、お店の雰囲気を感じてもらうためHP内に受付口コミ欄をご用意。皆様の声が200件以上投稿されており、利用の参考にしていただけます。',
    },
    {
      title: '業界一の受付対応を目指しています！',
      desc: '予約だけでなく、悩み事やご相談など、ご予約に関係のないお問い合わせでも構いません。ハートフルで丁寧な対応をスタッフ一同一人一人に提供します。',
    },
    {
      title: '大手プロ出身セラピスト多数在籍！',
      desc: '各ジャンルの元プロダクション出身者や、社会経験が豊富な男性を厳選採用。教育においてもお客様の満足度を第一に考え、業界最高レベルの人選を徹底しています。',
    },
    {
      title: '業界熟練の講師による確かな人材育成！',
      desc: '風俗業界で10年以上の経験豊富な専属講師がマンツーマンで指導。一般的な素人男性のレベルを超えた、プロならではの高品質なサービスをお約束します。',
    },
    {
      title: '安心と安定、直営店での全国展開！',
      desc: 'フランチャイズとは違い、全国展開している店舗は全て営業歴6年以上の東京本店にて直接運営に携わったスタッフが管理。どの地域でも安定のおもてなしを提供します。',
    },
    {
      title: '定期的な性病検査の義務付け！',
      desc: '「さくら検査研究所」様とのパートナーシップ契約を結んでおり、全てのセラピストに定期的な性病検査を徹底しています。心ゆくまで安心してお楽しみください！',
    },
    {
      title: '7年以上の運営実績は信頼の証！',
      desc: '急速に成長する業界で、1年未満で姿を消す店舗も珍しくありません。当店は皆様の支持を受け、7年以上にわたり大勢の皆様の女風デビューをサポートし続けています。',
    },
  ];

  if (data.isVisible === false && !isEditing) return null;

  return (
    <section className={`bg-gray-50 py-20 ${!data.isVisible ? 'opacity-50' : ''}`}>
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          {data.imageUrl ? (
            <div className="relative mx-auto mb-4 max-w-2xl">
              <EditableImage
                isEditing={isEditing}
                src={data.imageUrl}
                alt="7つの理由"
                onUpload={(file) => onImageUpload?.('sevenReasons', file)}
                className="h-auto w-full object-contain"
              />
              {isEditing && (
                <button
                  onClick={() => onUpdate?.('sevenReasons', 'imageUrl', '')}
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
              <p className="mb-2 font-bold tracking-widest text-[#FF4B5C]">WHY CHOOSE US</p>
              <h2 className="text-2xl font-bold md:text-3xl">
                {groupName}が初めての女風に選ばれる
                <br className="md:hidden" /> <span className="text-[#FF4B5C]">7つの理由</span>
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
                        if (file) onImageUpload?.('sevenReasons', file);
                      }}
                    />
                  </label>
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-colors hover:border-[#FF4B5C]/30"
            >
              <div className="flex-shrink-0 text-xl">✅</div>
              <div>
                <h3 className="mb-2 font-bold leading-tight text-gray-800">{r.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
