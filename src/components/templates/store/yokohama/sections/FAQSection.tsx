import { FAQConfig } from '@/lib/store/storeTopConfig';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import SectionTitle from '../components/SectionTitle';

interface FAQSectionProps {
  config?: FAQConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({ config, isEditing, onUpdate }) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  if (!config || !config.isVisible) return null;

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <section id="faq" className="bg-neutral-50 py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <SectionTitle en={config.subHeading} ja={config.heading} />

        <div className="space-y-4">
          {config.items.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all duration-300"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="flex w-full items-center justify-between p-5 text-left md:p-6"
                >
                  <span className="text-sm font-bold tracking-wider text-slate-700 md:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`text-primary-300 h-5 w-5 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="whitespace-pre-line border-t border-neutral-50 p-5 pt-0 text-xs leading-relaxed text-slate-500 md:p-6 md:pt-0 md:text-sm">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
