import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: '初めてでも大丈夫でしょうか？',
      answer: 'はい、もちろんです。初回のお客様には専任スタッフが丁寧にご案内いたします。ご不安な点がございましたら、お気軽にお尋ねください。リラックスしてお過ごしいただけるよう心がけております。'
    },
    {
      question: 'プライバシーは守られますか？',
      answer: '完全に守られます。個人情報の管理は厳重に行い、他のお客様と顔を合わせることのない完全個室制です。また、スタッフ全員が守秘義務を徹底しておりますので、安心してご利用ください。'
    },
    {
      question: 'AI診断はどのように行われますか？',
      answer: '心理学に基づいた3つの簡単な質問にお答えいただくだけです。お客様の性格や好み、求めるサービスの傾向を分析し、最も相性の良いスタッフをご提案いたします。診断は無料です。'
    },
    {
      question: '料金体系について教えてください',
      answer: 'お客様のご希望に応じて複数のプランをご用意しております。基本料金は時間制となっており、追加サービスは別途料金となります。詳細は個別にご相談させていただきます。'
    },
    {
      question: 'キャンセルは可能ですか？',
      answer: 'はい、可能です。ご予約の24時間前までにご連絡いただければ、キャンセル料はかかりません。それ以降のキャンセルにつきましては、規定のキャンセル料が発生する場合があります。'
    },
    {
      question: '年齢制限はありますか？',
      answer: '18歳以上の女性の方にご利用いただけます。年齢の上限はございません。20代から60代まで幅広い年齢層の方にご利用いただいております。'
    },
    {
      question: 'どのような女性が利用されていますか？',
      answer: 'OL、経営者、主婦、医師、看護師など様々な職業の方がいらっしゃいます。共通しているのは、日々頑張っている自分へのご褒美として、または心身のリフレッシュを求めてご利用されていることです。'
    },
    {
      question: 'サービスの内容について詳しく教えてください',
      answer: 'お客様のご希望に応じて、会話中心のコミュニケーションから、リラクゼーション、エスコートサービスまで幅広く対応しております。すべて女性の心身の癒しを第一に考えたサービス内容となっております。'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-rose-50/30 to-cream-50/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6">
            <HelpCircle className="w-5 h-5 text-strawberry-500" />
            <span className="text-sm font-rounded text-gray-700">よくあるご質問</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-rounded font-bold text-gray-800 mb-4">
            FAQ
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            お客様からよくいただくご質問をまとめました
            <br />
            <span className="font-rounded font-medium text-strawberry-600">
              他にご不明な点がございましたらお気軽にお問い合わせください
            </span>
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-sm border border-rose-50 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-rose-50/50 transition-colors"
              >
                <h3 className="font-rounded font-medium text-gray-800 pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pt-2 border-t border-rose-50">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 p-8 bg-white rounded-2xl shadow-lg border border-rose-100"
        >
          <h3 className="text-xl font-rounded font-bold text-gray-800 mb-4">
            他にご質問はございませんか？
          </h3>
          <p className="text-gray-600 mb-6">
            専任スタッフが丁寧にお答えいたします
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0120-000-000"
              className="inline-flex items-center justify-center gap-2 bg-strawberry-500 hover:bg-strawberry-600 text-white px-6 py-3 rounded-full font-rounded font-medium transition-colors"
            >
              お電話でのお問い合わせ
            </a>
            <a
              href="mailto:info@strawberry-boy.com"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-rounded font-medium transition-colors"
            >
              メールでのお問い合わせ
            </a>
          </div>
        </motion.div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </section>
  );
};

export default FAQSection;