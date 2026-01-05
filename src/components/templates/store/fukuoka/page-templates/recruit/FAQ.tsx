import { Minus, Plus } from 'lucide-react';
import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const faqs = [
    {
      q: '本当に未経験でも大丈夫ですか？',
      a: 'はい、全く問題ありません！当店では在籍キャストの約9割が未経験からのスタートです。プロの講師による丁寧な技術・マナー研修がありますので、自信を持ってデビューできるようサポートいたします。',
    },
    {
      q: '性的な本番行為などはありますか？',
      a: '一切ございません。当店は法令を遵守した健全店であり、お客様にも性交渉の禁止を徹底して周知しております。あくまで心と体を癒やすリラクゼーションサービスが主体ですのでご安心ください。',
    },
    {
      q: 'お酒が飲めなくても働けますか？',
      a: 'もちろん可能です。当店はバーやホストクラブとは異なり、お酒の接待がメインではありません。ホテルやお客様のご自宅でのサービスが中心ですので、お酒は一滴も飲めなくても全く支障ありません。',
    },
    {
      q: '身バレが不安なのですが、大丈夫でしょうか？',
      a: '最大限の配慮をさせていただきます。源氏名の使用はもちろん、サイト上での顔出し非公開も選べます。また、お客様へ送るプロフィール情報の管理も徹底しており、あなたが許可した範囲内でのみ情報を公開します。',
    },
    {
      q: 'どんなお客様が利用されますか？',
      a: '20代から50代の幅広い一般女性（学生、主婦、会社員の方など）がメインです。皆さんマナーの良い、癒やしを求めている紳士的なお客様ばかりですので、怖い思いをすることはまずありません。',
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-amber-500">FAQ</h2>
          <p className="mb-6 font-serif text-3xl font-bold text-slate-900 md:text-4xl">
            よくあるご質問
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`rounded-2xl border bg-white transition-all ${isOpen ? 'border-amber-500 shadow-md' : 'border-slate-100'}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left"
      >
        <div className="flex items-center">
          <span className="mr-4 shrink-0 text-xl font-bold text-amber-500">Q.</span>
          <span className="text-sm font-bold leading-tight text-slate-800 md:text-base">
            {question}
          </span>
        </div>
        <div
          className={`ml-4 shrink-0 rounded-full p-1 ${isOpen ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-400'}`}
        >
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      {isOpen && (
        <div className="border-t border-slate-50 p-6 pt-0 text-sm leading-relaxed text-slate-600 md:text-base">
          <div className="flex">
            <span className="mr-4 shrink-0 text-xl font-bold text-slate-300">A.</span>
            <p>{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
