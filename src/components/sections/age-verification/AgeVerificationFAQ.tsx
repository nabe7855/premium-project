import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import React, { useState } from 'react';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: '初めてでも大丈夫でしょうか？',
      answer:
        'はい、もちろんです。初回のお客様には専任スタッフが丁寧にご案内いたします。ご不安な点がございましたら、お気軽にお尋ねください。リラックスしてお過ごしいただけるよう心がけております。',
    },
    {
      question: 'プライバシーは守られますか？',
      answer:
        '完全に守られます。個人情報の管理は厳重に行い、他のお客様と顔を合わせることのない完全個室制です。また、スタッフ全員が守秘義務を徹底しておりますので、安心してご利用ください。',
    },
    {
      question: 'AI診断はどのように行われますか？',
      answer:
        '心理学に基づいた3つの簡単な質問にお答えいただくだけです。お客様の性格や好み、求めるサービスの傾向を分析し、最も相性の良いスタッフをご提案いたします。診断は無料です。',
    },
    {
      question: '料金体系について教えてください',
      answer:
        'お客様のご希望に応じて複数のプランをご用意しております。基本料金は時間制となっており、追加サービスは別途料金となります。詳細は個別にご相談させていただきます。',
    },
    {
      question: 'キャンセルは可能ですか？',
      answer:
        'はい、可能です。ご予約の24時間前までにご連絡いただければ、キャンセル料はかかりません。それ以降のキャンセルにつきましては、規定のキャンセル料が発生する場合があります。',
    },
    {
      question: '年齢制限はありますか？',
      answer:
        '18歳以上の女性の方にご利用いただけます。年齢の上限はございません。20代から60代まで幅広い年齢層の方にご利用いただいております。',
    },
    {
      question: 'どのような女性が利用されていますか？',
      answer:
        'OL、経営者、主婦、医師、看護師など様々な職業の方がいらっしゃいます。共通しているのは、日々頑張っている自分へのご褒美として、または心身のリフレッシュを求めてご利用されていることです。',
    },
    {
      question: 'サービスの内容について詳しく教えてください',
      answer:
        'お客様のご希望に応じて、会話中心のコミュニケーションから、リラクゼーション、エスコートサービスまで幅広く対応しております。すべて女性の心身の癒しを第一に考えたサービス内容となっております。',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="to-cream-50/30 bg-gradient-to-br from-rose-50/30 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
            <HelpCircle className="text-strawberry-500 h-5 w-5" />
            <span className="font-rounded text-sm text-gray-700">よくあるご質問</span>
          </div>

          <h2 className="font-rounded mb-4 text-3xl font-bold text-gray-800 md:text-4xl">FAQ</h2>

          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            お客様からよくいただくご質問をまとめました
            <br />
            <span className="font-rounded text-strawberry-600 font-medium">
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
              className="overflow-hidden rounded-2xl border border-rose-50 bg-white shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-rose-50/50"
              >
                <h3 className="font-rounded pr-4 font-medium text-gray-800">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-gray-400" />
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
                    <div className="border-t border-rose-50 px-6 pb-4 pt-2">
                      <p className="leading-relaxed text-gray-600">{faq.answer}</p>
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
          className="mt-12 rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-lg"
        >
          <h3 className="font-rounded mb-4 text-xl font-bold text-gray-800">
            他にご質問はございませんか？
          </h3>
          <p className="mb-6 text-gray-600">専任スタッフが丁寧にお答えいたします</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="tel:0120-000-000"
              className="bg-strawberry-500 hover:bg-strawberry-600 font-rounded inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-colors"
            >
              お電話でのお問い合わせ
            </a>
            <a
              href="mailto:info@www.sutoroberrys.jp"
              className="font-rounded inline-flex items-center justify-center gap-2 rounded-full bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
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
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            '@id': 'https://www.sutoroberrys.jp/#faq',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
};

export default FAQSection;
