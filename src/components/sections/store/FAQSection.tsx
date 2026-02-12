'use client';

import { FAQConfig } from '@/lib/store/storeTopConfig';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

interface FAQSectionProps {
  config?: FAQConfig;
}

const FAQSection: React.FC<FAQSectionProps> = ({ config }) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  if (!config || !config.isVisible) return null;

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <section id="faq" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold md:text-4xl">
            {config.heading || 'よくあるご質問'}
          </h2>
          <p className="text-sm font-medium uppercase tracking-widest text-gray-400">
            {config.subHeading || 'FAQ'}
          </p>
        </div>

        <div className="space-y-4">
          {config.items.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 transition-all duration-300"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="flex w-full items-center justify-between p-5 text-left md:p-6"
                >
                  <span className="text-sm font-bold text-gray-700 md:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="whitespace-pre-line border-t border-gray-100 p-5 pt-4 text-xs leading-relaxed text-gray-600 md:p-6 md:pt-4 md:text-sm">
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
