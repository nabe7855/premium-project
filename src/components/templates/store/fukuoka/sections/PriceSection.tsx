import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import SectionTitle from '../components/SectionTitle';

import { PriceConfig } from '@/lib/store/storeTopConfig';

const defaultPrices = [
  {
    title: 'Short',
    duration: 60,
    price: 12000,
    description: 'お試し・部分的な集中ケアに',
    isPopular: false,
  },
  {
    title: 'Standard',
    duration: 90,
    price: 17000,
    description: '全身をゆっくりほぐす定番コース',
    isPopular: true,
  },
  {
    title: 'Long',
    duration: 120,
    price: 23000,
    description: '心身ともに深く癒される贅沢な時間',
    isPopular: false,
  },
];

const defaultNotes = [
  '全てのプランに消費税が含まれております。延長は30分 ¥6,000にて承ります。',
  '指名料（¥1,000〜）および出張交通費が別途発生いたします。',
];

interface PriceSectionProps {
  config?: PriceConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
}

const PriceSection: React.FC<PriceSectionProps> = ({ config, isEditing, onUpdate }) => {
  const prices = config?.items || defaultPrices;
  const notes = config?.notes || defaultNotes;

  const handleItemUpdate = (index: number, key: string, value: any) => {
    if (onUpdate) {
      const newItems = [...prices];
      if (key === 'price' || key === 'duration') {
        const numericValue = parseInt(value.toString().replace(/[^0-9]/g, '')) || 0;
        newItems[index] = { ...newItems[index], [key]: numericValue };
      } else {
        newItems[index] = { ...newItems[index], [key]: value };
      }
      onUpdate('price', 'items', newItems);
    }
  };

  const addItem = () => {
    if (onUpdate) {
      const newItem = {
        title: 'New Plan',
        duration: 60,
        price: 10000,
        description: '説明文を入力',
        isPopular: false,
      };
      onUpdate('price', 'items', [...prices, newItem]);
    }
  };

  const removeItem = (index: number) => {
    if (onUpdate) {
      const newItems = prices.filter((_, i) => i !== index);
      onUpdate('price', 'items', newItems);
    }
  };

  const handleNoteUpdate = (index: number, value: string) => {
    if (onUpdate) {
      const newNotes = [...notes];
      newNotes[index] = value;
      onUpdate('price', 'notes', newNotes);
    }
  };

  const addNote = () => {
    if (onUpdate) {
      onUpdate('price', 'notes', [...notes, '新しい注意事項']);
    }
  };

  const removeNote = (index: number) => {
    if (onUpdate) {
      const newNotes = notes.filter((_, i) => i !== index);
      onUpdate('price', 'notes', newNotes);
    }
  };

  return (
    <section id="price" className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
      <SectionTitle en={config?.subHeading || 'Price Menu'} ja={config?.heading || '料金プラン'} />

      <div className="shadow-primary-100/50 border-primary-50 rounded-[2.5rem] border bg-white p-6 shadow-2xl md:p-12">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3 md:gap-8">
          {prices.map((item, idx) => (
            <div
              key={idx}
              className={`group relative rounded-[2rem] border border-neutral-100 p-8 text-center transition-all hover:bg-neutral-50 ${
                item.isPopular
                  ? 'from-primary-50 border-primary-200 transform bg-gradient-to-b to-white p-10 shadow-xl md:-translate-y-6'
                  : ''
              }`}
            >
              {isEditing && (
                <button
                  onClick={() => removeItem(idx)}
                  className="absolute -right-2 -top-2 z-50 rounded-full bg-red-500 p-2 text-white shadow-lg transition-transform hover:scale-110"
                >
                  <Trash2 size={14} />
                </button>
              )}

              {item.isPopular && (
                <div className="bg-primary-500 absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-md">
                  Popular No.1
                </div>
              )}
              <h3
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => handleItemUpdate(idx, 'title', e.currentTarget.innerText)}
                className={`mb-4 text-xs font-bold uppercase tracking-widest outline-none ${item.isPopular ? 'text-primary-500' : 'text-slate-400'} ${isEditing ? 'rounded px-1 hover:bg-slate-50' : ''}`}
              >
                {item.title}
              </h3>
              <div className="mb-3 flex items-baseline justify-center text-slate-800">
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => handleItemUpdate(idx, 'duration', e.currentTarget.innerText)}
                  className={`font-serif outline-none ${item.isPopular ? 'text-5xl' : 'text-4xl'} ${isEditing ? 'rounded px-1 hover:bg-slate-50' : ''}`}
                >
                  {item.duration}
                </span>
                <span className="ml-1 text-xs font-bold">min</span>
              </div>
              <div className="mb-3 flex items-baseline justify-center">
                <span
                  className={`font-bold ${item.isPopular ? 'text-primary-500 text-2xl' : 'text-xl text-slate-700'}`}
                >
                  ¥
                </span>
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => handleItemUpdate(idx, 'price', e.currentTarget.innerText)}
                  className={`font-bold outline-none ${item.isPopular ? 'text-primary-500 text-2xl' : 'text-xl text-slate-700'} ${isEditing ? 'ml-1 rounded px-1 hover:bg-slate-50' : ''}`}
                >
                  {isEditing ? item.price : item.price.toLocaleString()}
                </span>
              </div>
              <p
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => handleItemUpdate(idx, 'description', e.currentTarget.innerText)}
                className={`text-[10px] font-medium tracking-wider outline-none ${item.isPopular ? 'text-slate-500' : 'text-slate-400'} ${isEditing ? 'rounded px-1 hover:bg-slate-50' : ''}`}
              >
                {item.description}
              </p>
            </div>
          ))}

          {isEditing && (
            <button
              onClick={addItem}
              className="border-primary-200 text-primary-300 hover:text-primary-500 hover:border-primary-400 flex min-h-[250px] flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed bg-white/50 p-8 transition-all"
            >
              <Plus size={32} className="mb-2" />
              <span className="text-xs font-bold">プランを追加</span>
            </button>
          )}
        </div>

        <div className="mt-10 space-y-3 rounded-[2rem] border border-neutral-100 bg-neutral-50/50 p-6 text-left text-[10px] text-slate-400 md:p-8 md:text-xs">
          {notes.map((note, idx) => (
            <div key={idx} className="group/note relative flex items-start gap-3">
              <AlertCircle size={14} className="text-primary-300 mt-0.5 shrink-0" />
              <p
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => handleNoteUpdate(idx, e.currentTarget.innerText)}
                className={`flex-grow tracking-wider outline-none ${isEditing ? 'min-h-[1.2rem] rounded px-1 hover:bg-white' : ''}`}
              >
                {note}
              </p>
              {isEditing && (
                <button
                  onClick={() => removeNote(idx)}
                  className="text-red-300 opacity-0 transition-opacity hover:text-red-500 group-hover/note:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={addNote}
              className="text-primary-400 hover:text-primary-600 mt-2 flex items-center gap-2 font-bold transition-colors"
            >
              <Plus size={14} />
              <span>注意事項を追加</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PriceSection;
