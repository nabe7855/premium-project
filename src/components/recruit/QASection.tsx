
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { SectionTitle } from './Common';

const QASection: React.FC = () => {
  const faqs = [
    { q: "未経験でも本当に大丈夫ですか？", a: "はい、もちろんです。当店のセラピストの約8割が未経験からのスタートです。専属講師がメンタル面も含めてしっかりサポートいたします。" },
    { q: "身バレが怖いのですが、対策はありますか？", a: "徹底した対策を行っております。源氏名の使用はもちろん、特定のエリアへの広告非表示（エリアブロック）や、サイトへの顔出しNGも選択可能です。" },
    { q: "お酒が飲めなくても働けますか？", a: "はい、全く問題ありません。当店は接客技術と癒やしの提供がメインですので、飲酒の強要などは一切ございません。" },
    { q: "罰金やノルマはありますか？", a: "一切ございません。出勤の強要もありませんので、あなたのライフスタイルに合わせて働いていただけます。" },
    { q: "どんな服装で働けばいいですか？", a: "お店のコンセプトに合わせた清潔感のあるスタイルを推奨していますが、詳しくは研修時にアドバイスさせていただきます。" },
  ];

  return (
    <section id="qa" className="py-20 px-4 bg-stone-50">
      <div className="max-w-3xl mx-auto">
        <SectionTitle title="よくあるご質問" subtitle="FREQUENTLY ASKED QUESTIONS" />
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden group">
              <button className="w-full text-left p-5 flex items-center justify-between font-bold text-stone-900 group-hover:text-strawberry transition-colors">
                <span className="flex items-center gap-3">
                  <span className="text-lg text-strawberry font-serif-en italic">Q.</span>
                  {item.q}
                </span>
                <ChevronRight size={18} className="text-stone-400" />
              </button>
              <div className="px-5 pb-5 pt-0 text-stone-600 text-sm leading-relaxed border-t border-stone-100 mt-0">
                <p className="pt-4 flex gap-3">
                  <span className="text-lg text-gold font-serif-en italic">A.</span>
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QASection;
