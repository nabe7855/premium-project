'use client';

import React, { useState } from 'react';

// ---------------------------------------------------------------------------
// FAQアコーディオンコンポーネント
// ---------------------------------------------------------------------------

export interface FaqItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FaqItem[];
}

function FaqAccordionItem({ item, index }: { item: FaqItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="overflow-hidden rounded-xl border transition-all"
      style={{ borderColor: isOpen ? '#E8567A' : '#F9D1DA' }}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        style={{ background: isOpen ? '#FFF0F3' : '#FFFBFC' }}
        aria-expanded={isOpen}
      >
        <span className="flex items-start gap-3">
          <span
            className="mt-0.5 flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
            style={{ background: '#E8567A' }}
          >
            Q{index + 1}
          </span>
          <span className="text-sm font-medium leading-relaxed" style={{ color: '#1a1a1a' }}>
            {item.question}
          </span>
        </span>
        <span
          className="ml-3 flex-shrink-0 text-lg transition-transform duration-200"
          style={{
            color: '#E8567A',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </span>
      </button>

      {isOpen && (
        <div
          className="border-t px-5 py-4"
          style={{ borderColor: '#F9D1DA', background: '#FFFBFC' }}
        >
          <div className="flex gap-3">
            <span
              className="mt-0.5 flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background: '#F9D1DA', color: '#E8567A' }}
            >
              A
            </span>
            <p className="text-sm leading-loose" style={{ color: '#555' }}>
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQSection({ items }: FAQSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-12">
      <h2
        className="mb-6 font-serif text-lg font-bold"
        style={{ color: '#1a1a1a' }}
      >
        よくある質問
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <FaqAccordionItem key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
