import React from 'react';

const faqData = [
  {
    question: '初めてなので、何をどうすればいいか分かりません。',
    answer:
      'ご安心ください。まずはLINEで「初めてです」とスタンプ一つ送っていただければ、専任の女性コンシェルジュが丁寧に手順をご案内いたします。無理な勧誘は一切ございません。',
  },
  {
    question: '年齢や容姿に自信がないのですが、利用しても大丈夫ですか？',
    answer:
      'もちろんです。当店の女性のお客様は20代から70代まで幅広く、皆様それぞれの目的で癒やしを求められています。セラピストは貴女という一人の女性を大切におもてなしするプロですので、安心してお任せください。',
  },
  {
    question: 'ホテル代などの追加料金はかかりますか？',
    answer:
      '表示価格の他に、出張費（23区内は一律）と、ご自身で手配いただく場合はホテル代の実費のみとなります。指名料は何度でも一律1,000円です。詳細は「ご利用料金」セクションをご確認ください。',
  },
  {
    question: '場所はどこでも指定できますか？',
    answer:
      '新宿・渋谷・池袋をはじめとする東京都内、および近郊のホテルやご自宅へお伺いいたします。具体的なエリアについてはお気軽にお問い合わせください。',
  },
];

export const FAQ: React.FC = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className="border-t border-gray-50 bg-white py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-black md:text-4xl">よくあるご質問</h2>
          <p className="font-medium italic text-gray-500">Q&A for New Customers</p>
        </div>

        <div className="space-y-6">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-stone-100 bg-stone-50 p-6 transition-all hover:shadow-md md:p-8"
            >
              <div className="mb-4 flex gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FF4B5C] font-bold text-white">
                  Q
                </span>
                <h3 className="pt-0.5 text-lg font-bold text-gray-800">{item.question}</h3>
              </div>
              <div className="flex gap-4 ps-12">
                <p className="leading-relaxed text-gray-600">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
