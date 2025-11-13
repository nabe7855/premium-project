'use client';
import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: '口コミの信頼性について',
      answer:
        '当サービスの口コミは、実際にご利用いただいたお客様からの貴重なご意見です。虚偽の投稿を防ぐため、利用確認を行った上で掲載しております。',
    },
    {
      question: '初めての利用について',
      answer:
        '初回のお客様には、事前にしっかりとご説明をさせていただきます。不安な点がございましたら、お気軽にお問い合わせください。',
    },
    {
      question: 'プライバシーについて',
      answer:
        'お客様の個人情報は厳重に管理しており、第三者に開示することはございません。安心してご利用いただけます。',
    },
    {
      question: '予約・キャンセルについて',
      answer:
        '予約は24時間受付しております。キャンセルについても、お早めにご連絡いただければ対応いたします。',
    },
  ];

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center gap-2">
        <HelpCircle className="h-6 w-6 text-pink-500" />
        <h2 className="text-2xl font-bold text-gray-800">よくある質問</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
            >
              <span className="font-medium text-gray-800">{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="font-serif leading-relaxed text-gray-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
