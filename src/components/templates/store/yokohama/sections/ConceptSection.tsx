'use client';
import { Camera, ChevronDown, Heart, Home, Plus, Receipt, Trash2, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { ConceptConfig } from '@/lib/store/storeTopConfig';

const getConceptIcon = (title: string, index: number) => {
  if (title.includes('セラピスト')) return <Users size={20} />;
  if (title.includes('安心')) return <Heart size={20} />;
  if (title.includes('プライベート')) return <Home size={20} />;
  if (title.includes('会計') || title.includes('料金')) return <Receipt size={20} />;

  // Fallback based on index
  const icons = [
    <Users size={20} />,
    <Heart size={20} />,
    <Home size={20} />,
    <Receipt size={20} />,
  ];
  return icons[index % icons.length];
};

interface ConceptSectionProps {
  config?: ConceptConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

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

const ConceptSection: React.FC<ConceptSectionProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const items = config?.items || defaultConcepts;
  const heading = config?.heading || '安心と癒やしを、すべての女性の日常に。';
  const subHeading = config?.subHeading || 'Our Concept';

  useEffect(() => {
    if (isEditing) return;
    const timer = setInterval(() => {
      setCurrentConceptIndex((prev) => (prev + 1) % items.length);
    }, 11250);
    return () => clearInterval(timer);
  }, [items.length, isEditing]);

  const handleTextUpdate = (key: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      onUpdate('concept', key, e.currentTarget.innerText);
    }
  };

  const handleItemUpdate = (index: number, key: string, value: string) => {
    if (onUpdate) {
      const newItems = [...items];
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
      onUpdate('concept', 'items', [...items, newItem]);
    }
  };

  const removeItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdate) {
      const newItems = items.filter((_, i) => i !== index);
      onUpdate('concept', 'items', newItems);
      if (currentConceptIndex >= newItems.length) {
        setCurrentConceptIndex(Math.max(0, newItems.length - 1));
      }
    }
  };

  return (
    <section id="concept" className="bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="relative">
          {/* Content Side */}
          <div>
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={isEditing}
              onBlur={(e) => handleTextUpdate('badge', e)}
              className={`text-xs font-bold uppercase tracking-[0.3em] text-rose-500 ${isEditing ? 'rounded px-1 hover:bg-rose-50' : ''}`}
            >
              {config?.badge || subHeading}
            </span>
            <h2
              contentEditable={isEditing}
              suppressContentEditableWarning={isEditing}
              onBlur={(e) => handleTextUpdate('heading', e)}
              className={`mb-8 mt-4 font-serif text-3xl font-bold leading-tight text-slate-800 md:text-5xl ${isEditing ? 'rounded px-1 hover:bg-white/10' : ''}`}
            >
              {config?.heading || heading}
            </h2>

            <div className="space-y-4">
              {items.map((concept, idx) => (
                <div
                  key={idx}
                  className={`group cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                    idx === currentConceptIndex
                      ? 'border-rose-200 bg-white shadow-xl shadow-rose-100/20'
                      : 'border-transparent bg-transparent hover:bg-white/50 hover:shadow-md'
                  }`}
                  onClick={() => setCurrentConceptIndex(idx)}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className={`mt-1 rounded-2xl p-3 transition-all duration-500 ${
                        idx === currentConceptIndex
                          ? 'rotate-0 bg-rose-500 text-white shadow-lg'
                          : '-rotate-3 bg-rose-50 text-rose-400 group-hover:rotate-0'
                      }`}
                    >
                      {getConceptIcon(concept.title, idx)}
                    </div>
                    <div className="flex-grow pt-1">
                      <div className="flex items-center justify-between">
                        <h3
                          contentEditable={isEditing}
                          suppressContentEditableWarning={isEditing}
                          onBlur={(e) => handleItemUpdate(idx, 'title', e.currentTarget.innerText)}
                          onClick={(e) => isEditing && e.stopPropagation()}
                          className={`text-lg font-bold transition-colors ${
                            idx === currentConceptIndex ? 'text-slate-800' : 'text-slate-500'
                          } ${isEditing ? 'rounded px-1 hover:bg-slate-50' : ''}`}
                        >
                          {concept.title}
                        </h3>
                        <ChevronDown
                          size={20}
                          className={`transition-all duration-500 ${
                            idx === currentConceptIndex
                              ? 'rotate-180 text-rose-500'
                              : 'text-slate-300'
                          }`}
                        />
                      </div>
                      {(idx === currentConceptIndex || isEditing) && (
                        <div
                          className={`mt-5 space-y-4 overflow-hidden ${isEditing ? '' : 'duration-500 animate-in fade-in slide-in-from-top-2'}`}
                        >
                          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-sm md:aspect-[21/9]">
                            <img
                              src={concept.imageUrl}
                              alt={concept.title}
                              className="h-full w-full object-cover"
                            />
                            {isEditing && (
                              <label
                                onClick={(e) => e.stopPropagation()}
                                className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center bg-black/30 text-white opacity-0 transition-opacity hover:opacity-100"
                              >
                                <Camera size={24} className="mb-1" />
                                <span className="text-[10px] font-bold">画像変更</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleImageChange(e, idx)}
                                />
                              </label>
                            )}
                          </div>
                          <p
                            contentEditable={isEditing}
                            suppressContentEditableWarning={isEditing}
                            onBlur={(e) => handleItemUpdate(idx, 'desc', e.currentTarget.innerText)}
                            onClick={(e) => isEditing && e.stopPropagation()}
                            className={`text-sm leading-relaxed text-slate-500 ${isEditing ? 'block min-h-[1em] rounded px-1 hover:bg-slate-50' : ''}`}
                          >
                            {concept.desc}
                          </p>
                        </div>
                      )}
                    </div>
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
              ))}
              {isEditing && (
                <button
                  onClick={addItem}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-200 py-4 text-slate-400 transition-colors hover:border-rose-300 hover:text-rose-500"
                >
                  <Plus size={20} />
                  <span>コンセプトを追加</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;
