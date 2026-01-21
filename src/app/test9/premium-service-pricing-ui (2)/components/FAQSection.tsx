
import React, { useState } from 'react';
import { FAQItem as FAQItemType } from '../types';

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
        className="w-full py-5 px-2 flex items-center justify-between text-left group transition-colors hover:bg-rose-50/30"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl group-hover:scale-110 transition-transform">🍓</span>
          <span className="font-bold text-rose-900 font-rounded leading-tight">{question}</span>
        </div>
        <span className={`text-rose-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pb-6 px-10 text-rose-500 text-sm leading-relaxed whitespace-pre-wrap">
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
    <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-rose-900 font-rounded">よくあるご質問</h3>
        <p className="text-xs text-rose-300 font-bold tracking-[0.2em] mt-1">Q&A</p>
      </div>
      <div className="bg-white border-2 border-rose-100 rounded-[2rem] p-6 shadow-lg shadow-rose-100/50">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
