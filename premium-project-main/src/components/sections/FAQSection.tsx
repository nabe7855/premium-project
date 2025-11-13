'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: "初めてでも大丈夫ですか？",
    answer: "はい、初回の方には専任のコンシェルジュが丁寧にサポートいたします。事前のカウンセリングから当日のフォローまで、不安なことがあれば何でもお気軽にご相談ください。初回限定の割引もご用意しております。"
  },
  {
    id: 2,
    question: "料金システムはどうなっていますか？",
    answer: "時間制の明確な料金システムです。表示価格以外の追加料金等は一切発生いたしません。お支払いは現金、クレジットカード、電子マネーに対応しており、事前決済も可能です。詳細はプランページをご確認ください。"
  },
  {
    id: 3,
    question: "キャンセルはできますか？",
    answer: "ご予約の24時間前まででしたら無料でキャンセル可能です。24時間以内のキャンセルについては、プランにより異なりますが、料金の50%〜100%のキャンセル料が発生する場合がございます。"
  },
  {
    id: 4,
    question: "どのような方がキャストとして在籍していますか？",
    answer: "20代から30代前半の男性を中心に、厳格な選考（採用率3%）を通過した方のみが在籍しています。定期的な研修とマナー講習を受けており、お客様に安心してご利用いただけるよう努めております。"
  },
  {
    id: 5,
    question: "プライバシーは守られますか？",
    answer: "お客様の個人情報は厳重に管理しており、第三者に開示することは一切ございません。キャストにも守秘義務を徹底しており、安心してご利用いただけます。また、匿名でのご利用も可能です。"
  },
  {
    id: 6,
    question: "AIマッチングはどのような仕組みですか？",
    answer: "心理学に基づいた3つの質問にお答えいただくことで、あなたの性格や好みを分析し、最適なキャストをマッチングします。95%以上のお客様に「期待以上だった」とご満足いただいている高精度なシステムです。"
  }
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            よくあるご質問
            <br />
            <span className="text-rose-600">FAQ</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            お客様からよくいただくご質問にお答えします。
            <br />
            その他ご不明な点がございましたら、お気軽にお問い合わせください。
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openItems.includes(faq.id);
            return (
              <Card key={faq.id} className="overflow-hidden">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-900 pr-4">
                      Q. {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-rose-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="bg-rose-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
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
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-8">
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-4">
              その他のご質問・お問い合わせ
            </h3>
            <p className="text-gray-600 mb-6">
              24時間365日、専任のコンシェルジュがサポートいたします
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-sm text-gray-600">
                📞 フリーダイヤル: 0120-XXX-XXX
              </div>
              <div className="hidden sm:block text-gray-400">|</div>
              <div className="text-sm text-gray-600">
                📧 メール: support@strawberry-boy.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}