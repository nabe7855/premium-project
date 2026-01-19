import { Camera, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { ConceptConfig } from '@/lib/store/storeTopConfig';

const defaultConcepts = [
  {
    title: '厳選セラピスト',
    desc: '容姿だけでなく、高いホスピタリティと社会人としてのマナーを兼ね備えた男性のみを採用。厳しい研修をクリアしたプロフェッショナルが伺います。',
    imageUrl:
      'https://images.unsplash.com/photo-1519735812324-ecb585a06a26?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: '女性目線の安心感',
    desc: '女性スタッフによる運営・管理を徹底。女性ならではの細やかな配慮と、万全のセキュリティ体制で、初めての方でも安心してご利用いただけます。',
    imageUrl:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: '完全プライベート',
    desc: 'ご自宅やホテルなど、ご指定の場所がプライベートサロンに。周りの目を気にせず、心ゆくまでリラックスできる時間をご提供します。',
    imageUrl:
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: '明朗会計',
    desc: '不透明な追加料金は一切ございません。WEBサイトに記載の料金プランに基づき、事前に正確な金額をご提示いたします。',
    imageUrl:
      'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=1000',
  },
];

interface ConceptSectionProps {
  config?: ConceptConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const ConceptSection: React.FC<ConceptSectionProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);

  const concepts = config?.items || defaultConcepts;

  useEffect(() => {
    if (isEditing) return; // 編集時は自動スライドを停止
    if (concepts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentConceptIndex((prev) => (prev + 1) % concepts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [concepts.length, isEditing]);

  const handleTextUpdate = (key: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      onUpdate('concept', key, e.currentTarget.innerText);
    }
  };

  const handleItemUpdate = (index: number, key: string, value: string) => {
    if (onUpdate) {
      const newItems = [...concepts];
      newItems[index] = { ...newItems[index], [key]: value };
      onUpdate('concept', 'items', newItems);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload('concept', file, index, 'items');
    }
  };

  const addItem = () => {
    if (onUpdate) {
      const newItem = {
        title: '新規コンセプト',
        desc: '説明文を入力してください',
        imageUrl: defaultConcepts[0].imageUrl,
      };
      onUpdate('concept', 'items', [...concepts, newItem]);
    }
  };

  const removeItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdate) {
      const newItems = concepts.filter((_, i) => i !== index);
      onUpdate('concept', 'items', newItems);
      if (currentConceptIndex >= newItems.length) {
        setCurrentConceptIndex(Math.max(0, newItems.length - 1));
      }
    }
  };

  return (
    <section id="concept" className="mx-auto max-w-7xl overflow-hidden px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 items-center gap-12 md:gap-20 lg:grid-cols-2">
        {/* Image Side */}
        <div className="relative order-2 h-[400px] md:h-[600px] lg:order-1">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-pink-100 opacity-50 mix-blend-multiply blur-3xl filter"></div>
          <div className="bg-primary-100 absolute -bottom-10 -right-10 h-40 w-40 rounded-full opacity-50 mix-blend-multiply blur-3xl filter"></div>

          {concepts.map((concept, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 z-10 transform overflow-hidden rounded-[2rem] shadow-2xl transition-all duration-1000 ${
                idx === currentConceptIndex
                  ? 'translate-y-0 rotate-0 opacity-100'
                  : 'pointer-events-none translate-y-8 rotate-3 opacity-0'
              }`}
            >
              <img
                src={concept.imageUrl}
                alt={concept.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

              {isEditing && idx === currentConceptIndex && (
                <label className="absolute inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-black/30 text-white opacity-0 transition-opacity hover:opacity-100">
                  <Camera size={48} className="mb-2" />
                  <span className="text-sm font-bold">画像を変更</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, idx)}
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        {/* Content Side */}
        <div className="order-1 lg:order-2">
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => handleTextUpdate('badge', e)}
            className={`text-primary-400 text-[10px] font-bold uppercase tracking-[0.4em] md:text-xs ${isEditing ? 'hover:bg-primary-50 rounded px-1' : ''}`}
          >
            {config?.badge || 'Our Concept'}
          </span>
          <h2
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => handleTextUpdate('heading', e)}
            className={`mb-6 mt-3 whitespace-pre-line font-serif text-2xl leading-snug text-slate-800 md:text-4xl ${isEditing ? 'rounded px-1 hover:bg-slate-50' : ''}`}
          >
            {config?.heading || '安心と癒やしを、\nすべての女性の日常に。'}
          </h2>

          <div className="mb-8 space-y-4 text-left">
            {concepts.map((concept, idx) => (
              <div
                key={idx}
                className={`relative cursor-pointer rounded-[1.5rem] border p-4 transition-all duration-500 md:p-6 ${
                  idx === currentConceptIndex
                    ? 'border-primary-200 shadow-primary-50 scale-[1.02] bg-white shadow-lg'
                    : 'hover:border-primary-100 border-neutral-100 bg-white/50 hover:bg-white'
                }`}
                onClick={() => setCurrentConceptIndex(idx)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 rounded-xl p-2 transition-colors ${idx === currentConceptIndex ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-slate-400'}`}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="flex-grow">
                    <h3
                      contentEditable={isEditing}
                      suppressContentEditableWarning={isEditing}
                      onBlur={(e) => handleItemUpdate(idx, 'title', e.currentTarget.innerText)}
                      onClick={(e) => isEditing && e.stopPropagation()}
                      className={`mb-1 text-sm font-bold transition-colors md:text-base ${idx === currentConceptIndex ? 'text-slate-800' : 'text-slate-500'} ${isEditing ? 'rounded px-1 hover:bg-slate-50' : ''}`}
                    >
                      {concept.title}
                    </h3>
                    {(idx === currentConceptIndex || isEditing) && (
                      <p
                        contentEditable={isEditing}
                        suppressContentEditableWarning={isEditing}
                        onBlur={(e) => handleItemUpdate(idx, 'desc', e.currentTarget.innerText)}
                        onClick={(e) => isEditing && e.stopPropagation()}
                        className={`text-xs leading-relaxed text-slate-500 duration-500 md:text-sm ${isEditing ? 'mt-2 block min-h-[1em] rounded px-1 hover:bg-slate-50' : 'animate-in fade-in slide-in-from-top-2'}`}
                      >
                        {concept.desc}
                      </p>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={(e) => removeItem(idx, e)}
                      className="ml-2 rounded-full p-2 text-red-300 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                {idx === currentConceptIndex && !isEditing && (
                  <div className="bg-primary-100 absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-[1.5rem]">
                    <div className="bg-primary-500 h-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
            {isEditing && (
              <button
                onClick={addItem}
                className="hover:border-primary-300 hover:text-primary-500 flex w-full items-center justify-center gap-2 rounded-[1.5rem] border-2 border-dashed border-neutral-200 py-4 text-slate-400 transition-colors"
              >
                <Plus size={20} />
                <span>コンセプトを追加</span>
              </button>
            )}
          </div>

          <p
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => handleTextUpdate('subHeading', e)}
            className={`whitespace-pre-line border-l-4 border-pink-200 py-2 pl-4 text-xs italic text-slate-500 md:text-sm ${isEditing ? 'rounded px-1 hover:bg-slate-50' : ''}`}
          >
            {config?.subHeading ||
              '「自分へのご褒美」を、もっと身近で、もっと心地よいものに。LUMIÈREは福岡の女性を応援します。'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;
