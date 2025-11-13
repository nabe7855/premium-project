'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      category: '応募・面接について',
      question: '未経験でも大丈夫ですか？',
      answer:
        'はい、未経験の方も大歓迎です。充実した研修制度があり、専任スタッフがマンツーマンでサポートします。8割以上の方が未経験からスタートしています。',
    },
    {
      category: 'プライバシー',
      question: '身バレや顔バレの心配はありませんか？',
      answer:
        '徹底した身バレ防止に努めます、こちらから強要することは決してないので安心してください。また、顔出しは一切不要で、個人情報の管理も徹底しています。',
    },
    {
      category: '勤務について',
      question: '副業として働くことはできますか？',
      answer:
        'はい、多くの方が副業として働いています。自由シフト制なので、本業やプライベートに合わせて調整できます。',
    },
    {
      category: '収入について',
      question: '実際にどのくらい稼げますか？',
      answer:
        '経験や勤務頻度により異なりますが、週2-3日勤務で月収20-30万円、週4-5日勤務で月収40-60万円の方が多いです。',
    },
    {
      category: '安全性',
      question: '安全面での対策はありますか？',
      answer:
        '24時間サポート体制、緊急時対応システム、定期的な健康チェック、女性スタッフ常駐など、多重の安全対策を実施しています。',
    },
    {
      category: 'サポート体制',
      question: '困ったときの相談先はありますか？',
      answer:
        '24時間相談ホットライン、女性カウンセラーとの定期面談、メンタルヘルスサポートなど、充実した相談体制があります。',
    },
    {
      category: '退職について',
      question: '辞めたいときはすぐに辞められますか？',
      answer:
        'はい、退職は自由です。退職時には個人情報の完全削除を保証し、アフターサポートも行います。',
    },
    {
      category: '職場環境',
      question: '職場の雰囲気はどうですか？',
      answer:
        'スタッフが中心となって、温かく支え合う職場環境を作っています。定期的な交流イベントもあり、仲間との絆も深められます。',
    },
  ];

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  //const categories = Array.from(new Set(faqItems.map((item) => item.category)));

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-rounded text-3xl font-bold text-gray-800 md:text-4xl">
            よくある質問
          </h2>
          <p className="font-serif text-xl text-gray-600">応募前の不安や疑問にお答えします</p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="overflow-hidden rounded-xl bg-white shadow-sm">
                <button
                  onClick={() => toggleOpen(index)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <HelpCircle className="h-5 w-5 flex-shrink-0 text-pink-500" />
                    <div>
                      <span className="text-xs font-semibold text-pink-600">{item.category}</span>
                      <p className="font-semibold text-gray-800">{item.question}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <div className="border-l-2 border-pink-100 pl-9">
                      <p className="font-serif leading-relaxed text-gray-600">{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-gradient-to-r from-pink-100 to-purple-100 p-8 text-center">
            <h3 className="mb-4 font-rounded text-2xl font-bold text-gray-800">
              まだ不安や疑問がありますか？
            </h3>
            <p className="mb-6 text-gray-600">
              どんな小さなことでも、お気軽にご相談ください。女性スタッフが親身にお答えします。
            </p>
            <button className="rounded-full bg-pink-500 px-8 py-3 text-white transition-colors hover:bg-pink-600">
              直接相談してみる
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
