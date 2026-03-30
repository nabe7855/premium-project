import { EditableImage } from '@/components/admin/EditableImage';
import { FAQConfig } from '@/lib/store/firstTimeConfig';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Remove hardcoded faqData

interface FAQProps {
  config?: FAQConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File) => void;
}

export const FAQ: React.FC<FAQProps> = ({ config, isEditing, onUpdate, onImageUpload }) => {
  const data = config || {
    imageUrl: '',
    items: [],
    isVisible: true,
  };

  const handleItemUpdate = (index: number, field: 'question' | 'answer', value: string) => {
    const newItems = [...(data.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate?.('faq', 'items', newItems);
  };

  const handleAddItem = () => {
    const newItems = [...(data.items || []), { question: '新しい質問', answer: '新しい回答' }];
    onUpdate?.('faq', 'items', newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = (data.items || []).filter((_, i) => i !== index);
    onUpdate?.('faq', 'items', newItems);
  };

  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (isEditing) return;
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (data.items || []).map((item) => ({
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
            <div className="relative mx-auto mb-4 h-[120px] max-w-2xl md:h-[200px]">
              <EditableImage
                isEditing={isEditing}
                src={data.imageUrl}
                alt="よくあるご質問"
                onUpload={(file) => onImageUpload?.('faq', file)}
                className="h-full w-full object-contain"
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
          {(data.items || []).map((item, index) => {
            const isOpen = openIndices.includes(index);
            const showAnswer = isOpen || isEditing;

            return (
              <div
                key={index}
                className={`group relative rounded-3xl border border-stone-100 bg-stone-50 p-6 transition-all md:p-8 ${
                  !isEditing ? 'cursor-pointer hover:shadow-md' : ''
                }`}
                onClick={() => toggleItem(index)}
              >
                {isEditing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(index);
                    }}
                    className="absolute right-4 top-4 rounded-full bg-red-100 p-1.5 text-red-500 opacity-0 transition-opacity hover:bg-red-200 group-hover:opacity-100"
                    title="項目を削除"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FF4B5C] font-bold text-white">
                      Q
                    </span>
                    <h3
                      className={`pt-0.5 text-lg font-bold text-gray-800 outline-none focus:ring-2 focus:ring-rose-200 ${
                        isEditing ? 'cursor-text rounded bg-white/50 px-1' : ''
                      }`}
                      contentEditable={isEditing}
                      onBlur={(e) => handleItemUpdate(index, 'question', e.currentTarget.innerText)}
                      onClick={(e) => isEditing && e.stopPropagation()}
                      suppressContentEditableWarning
                    >
                      {item.question}
                    </h3>
                  </div>
                  {!isEditing && (
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    showAnswer ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="flex gap-4 pt-4 ps-12">
                    <p
                      className={`leading-relaxed text-gray-600 outline-none focus:ring-2 focus:ring-rose-200 ${
                        isEditing ? 'cursor-text rounded bg-white/50 px-1' : ''
                      }`}
                      contentEditable={isEditing}
                      onBlur={(e) => handleItemUpdate(index, 'answer', e.currentTarget.innerText)}
                      onClick={(e) => isEditing && e.stopPropagation()}
                      suppressContentEditableWarning
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {isEditing && (
            <button
              onClick={handleAddItem}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-200 py-6 text-sm font-bold text-stone-400 transition-colors hover:border-stone-300 hover:bg-stone-50 hover:text-stone-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              QA項目を追加する
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
