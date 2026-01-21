import React, { useState } from 'react';
import { FAQItem as FAQItemType } from './types';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-rose-50 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between px-2 py-5 text-left transition-colors hover:bg-rose-50/30"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl transition-transform group-hover:scale-110">🍓</span>
          <span className="font-rounded font-bold leading-tight text-rose-900">{question}</span>
        </div>
        <span
          className={`text-rose-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="whitespace-pre-wrap px-10 pb-6 text-sm leading-relaxed text-rose-500">
          {answer}
        </div>
      </div>
    </div>
  );
};

interface FAQSectionProps {
  faqs: FAQItemType[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  return (
    <div className="mt-16 duration-1000 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8 text-center">
        <h3 className="font-rounded text-2xl font-bold text-rose-900">よくあるご質問</h3>
        <p className="mt-1 text-xs font-bold tracking-[0.2em] text-rose-300">Q&A</p>
      </div>
      <div className="rounded-[2rem] border-2 border-rose-100 bg-white p-6 shadow-lg shadow-rose-100/50">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
