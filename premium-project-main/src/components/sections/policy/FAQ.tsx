'use client'; 
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const basicFAQs = [
    {
      question: 'キャストに私の個人情報（本名や連絡先）が伝わることはありますか？',
      answer: 'いいえ、一切ございません。お客様の個人情報は当店の専門スタッフが厳重に管理し、キャストに開示することはありませんのでご安心ください。'
    },
    {
      question: 'サイトを退会した場合、私の個人情報はすぐに削除されますか？',
      answer: 'はい。退会手続き完了後、法令等で定められた保管期間を除き、お客様の個人データは速やかに削除いたします。'
    },
    {
      question: 'チャットでのやり取りも保護されますか？',
      answer: 'もちろんです。お客様とスタッフ間の通信は暗号化されており、その内容が外部に漏れることはありません。'
    }
  ];

  const advancedFAQs = [
    {
      question: 'どのような場合に個人情報が削除されますか？',
      answer: '①退会手続き完了時 ②お客様からの削除要求時 ③法定保存期間経過時に、確実に削除いたします。削除完了のご連絡も可能です。'
    },
    {
      question: '個人情報の管理体制について教えてください',
      answer: '専任の個人情報取扱責任者を配置し、アクセス権限の厳格な管理、定期的なセキュリティ監査を実施しています。'
    },
    {
      question: '万が一情報漏洩があった場合の対応は？',
      answer: '即座にお客様への連絡、原因調査、再発防止策の実施、関係機関への報告を行います。透明性を保った対応をお約束いたします。'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const renderFAQSection = (faqs: typeof basicFAQs, startIndex: number) => {
    return faqs.map((faq, index) => {
      const actualIndex = startIndex + index;
      const isOpen = openIndex === actualIndex;
      
      return (
        <div key={actualIndex} className="border-b border-gray-200 last:border-b-0">
          <button
            onClick={() => toggleFAQ(actualIndex)}
            className="w-full text-left py-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-800 font-sans font-medium pr-4 text-sm leading-tight sm:text-base">
              Q. {faq.question}
            </span>
            <div className="flex-shrink-0 mt-0.5">
              {isOpen ? (
                <ChevronUp className="text-red-600" size={18} />
              ) : (
                <ChevronDown className="text-red-600" size={18} />
              )}
            </div>
          </button>
          
          {isOpen && (
            <div className="pb-4 pl-4 pr-8">
              <p className="text-gray-700 leading-relaxed font-serif text-sm sm:text-base">
                A. {faq.answer}
              </p>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-sm mx-auto sm:max-w-2xl lg:max-w-4xl">
        <div className="flex items-center justify-center mb-6">
          <HelpCircle className="text-red-600 mr-3 flex-shrink-0" size={24} />
          <h2 className="text-xl font-bold text-gray-800 font-sans text-center leading-tight sm:text-2xl">
            よくあるご質問<br className="sm:hidden" />
            <span className="text-base sm:text-xl">（個人情報の取り扱いについて）</span>
          </h2>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 sm:p-6">
            <h3 className="text-base font-bold text-gray-800 font-sans mb-4 sm:text-lg">
              基本的な不安を解消するFAQ
            </h3>
            {renderFAQSection(basicFAQs, 0)}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6">
            <h3 className="text-base font-bold text-gray-800 font-sans mb-4 sm:text-lg">
              詳細な管理体制に関するFAQ
            </h3>
            {renderFAQSection(advancedFAQs, basicFAQs.length)}
          </div>
        </div>
      </div>
    </section>
  );
};