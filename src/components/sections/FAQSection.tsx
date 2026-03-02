'use client';

import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    id: 1,
    question: '初めてでも大丈夫ですか？',
    answer:
      'はい、初回の方には専任のコンシェルジュが丁寧にサポートいたします。事前のカウンセリングから当日のフォローまで、不安なことがあれば何でもお気軽にご相談ください。初回限定の割引もご用意しております。',
  },
  {
    id: 2,
    question: '料金システムはどうなっていますか？',
    answer:
      '時間制の明確な料金システムです。表示価格以外の追加料金等は一切発生いたしません。お支払いは現金、クレジットカード、電子マネーに対応しており、事前決済も可能です。詳細はプランページをご確認ください。',
  },
  {
    id: 3,
    question: 'キャンセルはできますか？',
    answer:
      'ご予約の24時間前まででしたら無料でキャンセル可能です。24時間以内のキャンセルについては、プランにより異なりますが、料金の50%〜100%のキャンセル料が発生する場合がございます。',
  },
  {
    id: 4,
    question: 'どのような方がキャストとして在籍していますか？',
    answer:
      '20代から30代前半の男性を中心に、厳格な選考（採用率3%）を通過した方のみが在籍しています。定期的な研修とマナー講習を受けており、お客様に安心してご利用いただけるよう努めております。',
  },
  {
    id: '5',
    question: 'プライバシーは守られますか？',
    answer:
      'お客様の個人情報は厳重に管理しており、第三者に開示することは一切ございません。キャストにも守秘義務を徹底しており、安心してご利用いただけます。また、匿名でのご利用も可能です。',
  },
  {
    id: '6',
    question: 'AIマッチングはどのような仕組みですか？',
    answer:
      '心理学に基づいた3つの質問にお答えいただくことで、あなたの性格や好みを分析し、最適なキャストをマッチングします。95%以上のお客様に「期待以上だった」とご満足いただいている高精度なシステムです。',
  },
];

interface FAQ {
  id: string | number;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQ[];
}

export default function FAQSection({ faqs: propsFaqs }: FAQSectionProps) {
  const displayFaqs = propsFaqs || faqs;
  const [openItems, setOpenItems] = useState<(string | number)[]>([]);

  if (!displayFaqs || displayFaqs.length === 0) return null;

  const toggleItem = (id: string | number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      {/* 構造化データの追加 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: displayFaqs.map((item) => ({
              '@id': `https://www.sutoroberrys.jp/#faq-${item.id}`,
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            よくあるご質問
            <br />
            <span className="text-rose-600">FAQ</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            お客様からよくいただくご質問にお答えします。
            <br />
            その他ご不明な点がございましたら、お気軽にお問い合わせください。
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {displayFaqs.map((faq) => {
            const isOpen = openItems.includes(faq.id);
            return (
              <Card key={faq.id} className="overflow-hidden">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-6 text-left transition-colors duration-200 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="pr-4 text-lg font-semibold text-gray-900">Q. {faq.question}</h3>
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-rose-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="rounded-lg bg-rose-50 p-4">
                      <p className="leading-relaxed text-gray-700">
                        <span className="font-medium text-rose-700">A. </span>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Contact Info */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 p-8">
            <h3 className="mb-4 font-serif text-xl font-bold text-gray-900">
              その他のご質問・お問い合わせ
            </h3>
            <p className="mb-6 text-gray-600">
              24時間365日、専任のコンシェルジュがサポートいたします
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="text-sm text-gray-600">📞 フリーダイヤル: 0120-XXX-XXX</div>
              <div className="hidden text-gray-400 sm:block">|</div>
              <div className="text-sm text-gray-600">📧 メール: support@www.sutoroberrys.jp</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
