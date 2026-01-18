import { FAQConfig } from '@/lib/store/storeTopConfig';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import SectionTitle from '../components/SectionTitle';

interface FAQSectionProps {
  config?: FAQConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({ config, isEditing, onUpdate }) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  if (!config || (!config.isVisible && !isEditing)) return null;

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleItemUpdate = (index: number, key: string, value: any) => {
    if (onUpdate && config.items) {
      const newItems = [...config.items];
      newItems[index] = { ...newItems[index], [key]: value };
      onUpdate('faq', 'items', newItems);
    }
  };

  const addItem = () => {
    if (onUpdate && config.items) {
      const nextId =
        config.items.length > 0 ? Math.max(...config.items.map((i) => parseInt(i.id))) + 1 : 1;
      const newItem = {
        id: nextId.toString(),
        question: '新しい質問',
        answer: '回答をここに入力してください',
      };
      onUpdate('faq', 'items', [...config.items, newItem]);
    }
  };

  const removeItem = (id: string) => {
    if (onUpdate && config.items) {
      const newItems = config.items.filter((i) => i.id !== id);
      onUpdate('faq', 'items', newItems);
    }
  };

  return (
    <section
      id="faq"
      className={`bg-neutral-50 py-16 md:py-24 ${!config.isVisible && isEditing ? 'opacity-40' : ''}`}
    >
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="text-center">
          <SectionTitle
            en={config.subHeading}
            ja={config.heading}
            // Title editing is handled by props if needed, but for now we follow the pattern
          />
        </div>

        <div className="mt-12 space-y-4">
          {config.items.map((item, idx) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all duration-300"
              >
                {isEditing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="absolute right-14 top-5 z-20 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="flex w-full items-center justify-between p-5 text-left md:p-6"
                >
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={isEditing}
                    onBlur={(e) => handleItemUpdate(idx, 'question', e.currentTarget.innerText)}
                    onClick={(e) => isEditing && e.stopPropagation()}
                    className={`text-sm font-bold tracking-wider text-slate-700 outline-none md:text-base ${isEditing ? 'rounded px-1 hover:bg-neutral-50' : ''}`}
                  >
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`text-primary-300 h-5 w-5 transition-transform duration-300 ${
                      isOpen || isEditing ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen || isEditing ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-neutral-50 p-5 pt-0 text-xs leading-relaxed text-slate-500 md:p-6 md:pt-0 md:text-sm">
                    <div
                      contentEditable={isEditing}
                      suppressContentEditableWarning={isEditing}
                      onBlur={(e) => handleItemUpdate(idx, 'answer', e.currentTarget.innerText)}
                      className={`whitespace-pre-line outline-none ${isEditing ? 'rounded p-1 hover:bg-neutral-50' : ''}`}
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isEditing && (
            <button
              onClick={addItem}
              className="border-primary-200 text-primary-400 hover:text-primary-600 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-white/50 p-4 transition-all hover:bg-white"
            >
              <Plus size={20} />
              <span className="text-sm font-bold">項目を追加</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
