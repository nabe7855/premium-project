
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SectionTitle, StrawberryChan } from './Common';

const TargetSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionTitle title="求めるのは、新しい自分への渇望。" subtitle="TARGETS" />
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img src="https://picsum.photos/seed/customer/800/1000" alt="Customer" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xs font-bold tracking-widest text-gold mb-1">CUSTOMER BASE</p>
              <h3 className="text-xl font-black mb-2">品格あるお客様がメイン</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                自立した大人の女性、頑張る自分へのご褒美を求める方々。心地よい空間と癒やしを大切にする優雅なお客様が、あなたのパートナーです。
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-stone-50 p-6 rounded-2xl border-l-4 border-strawberry">
              <h4 className="font-black text-lg mb-2">応募条件</h4>
              <p className="text-sm text-stone-600 mb-4">20歳〜45歳の方（未経験大歓迎）</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-stone-700 font-medium">
                  <CheckCircle2 size={16} className="text-strawberry" /> インフルエンサー・俳優優遇
                </li>
                <li className="flex items-center gap-2 text-sm text-stone-700 font-medium">
                  <CheckCircle2 size={16} className="text-strawberry" /> 自分磨きに意欲的な方
                </li>
                <li className="flex items-center gap-2 text-sm text-stone-700 font-medium">
                  <CheckCircle2 size={16} className="text-strawberry" /> 誠実なコミュニケーションができる方
                </li>
              </ul>
            </div>
            <StrawberryChan text="容姿だけじゃなくて、あなたの『らしさ』を活かせる場所だよ！" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetSection;
