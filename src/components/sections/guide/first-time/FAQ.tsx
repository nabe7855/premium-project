import { EditableImage } from '@/components/admin/EditableImage';
import { FAQConfig } from '@/lib/store/firstTimeConfig';
import React from 'react';

const faqData = [
  {
    question: '初めてなので、何をどうすればいいか分かりません。',
    answer:
      'ご安心ください。まずはLINEで「初めてです」とスタンプ一つ送っていただければ、専任の女性コンシェルジュが丁寧に手順をご案内いたします。無理な勧誘は一切ございません。',
  },
  {
    question: '年齢や容姿に自信がないのですが、利用しても大丈夫ですか？',
    answer:
      'もちろんです。当店の女性のお客様は20代から70代まで幅広く、皆様それぞれの目的で癒やしを求められています。セラピストは貴女という一人の女性を大切におもてなしするプロですので、安心してお任せください。',
  },
  {
    question: 'ホテル代などの追加料金はかかりますか？',
    answer:
      '表示価格の他に、出張費（23区内は一律）と、ご自身で手配いただく場合はホテル代の実費のみとなります。指名料は何度でも一律1,000円です。詳細は「ご利用料金」セクションをご確認ください。',
  },
  {
    question: '場所はどこでも指定できますか？',
    answer:
      '新宿・渋谷・池袋をはじめとする東京都内、および近郊のホテルやご自宅へお伺いいたします。具体的なエリアについてはお気軽にお問い合わせください。',
  },
];

interface FAQProps {
  config?: FAQConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File) => void;
}

export const FAQ: React.FC<FAQProps> = ({ config, isEditing, onUpdate, onImageUpload }) => {
  const data = config || {
    imageUrl: '',
    isVisible: true,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  if (data.isVisible === false && !isEditing) return null;

  return (
    <section
      id="faq"
      className={`border-t border-gray-50 bg-white py-20 ${!data.isVisible ? 'opacity-50' : ''}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-16 text-center">
          {data.imageUrl ? (
            <div className="relative mx-auto mb-4 max-w-2xl">
              <EditableImage
                isEditing={isEditing}
                src={data.imageUrl}
                alt="よくあるご質問"
                onUpload={(file) => onImageUpload?.('faq', file)}
                className="h-auto w-full object-contain"
              />
              {isEditing && (
                <button
                  onClick={() => onUpdate?.('faq', 'imageUrl', '')}
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
              <h2 className="mb-4 text-3xl font-black md:text-4xl">よくあるご質問</h2>
              <p className="font-medium italic text-gray-500">Q&A for New Customers</p>
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
                        if (file) onImageUpload?.('faq', file);
                      }}
                    />
                  </label>
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-6">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-stone-100 bg-stone-50 p-6 transition-all hover:shadow-md md:p-8"
            >
              <div className="mb-4 flex gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FF4B5C] font-bold text-white">
                  Q
                </span>
                <h3 className="pt-0.5 text-lg font-bold text-gray-800">{item.question}</h3>
              </div>
              <div className="flex gap-4 ps-12">
                <p className="leading-relaxed text-gray-600">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
