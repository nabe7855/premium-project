
import React from 'react';
import { Users, Award, ShieldCheck } from 'lucide-react';
import { SectionTitle } from './Common';

const BrandStrength: React.FC = () => {
  return (
    <section id="trust" className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <SectionTitle title="8年続くには、理由がある。" subtitle="BRAND PRIDE" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-stone-50 border border-stone-100 group hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-strawberry text-white rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-6 transition-transform">
              <Users size={32} />
            </div>
            <h3 className="font-black text-xl mb-4">業界屈指の集客力</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              広告費を惜しまず、あなたの魅力を最大限にアピール。待機時間を最小限に抑え、安定した高収入を実現します。
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-stone-50 border border-stone-100 group hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gold text-white rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:-rotate-6 transition-transform">
              <Award size={32} />
            </div>
            <h3 className="font-black text-xl mb-4">最高水準の還元率</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              セラピストの皆様が第一。業界トップクラスのバック率で、あなたの努力を正当に評価し還元します。
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-stone-50 border border-stone-100 group hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-stone-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-6 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <h3 className="font-black text-xl mb-4">完全身バレ対策</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              源氏名、エリアブロック、顔出しNGなど徹底したプライバシー保護をお約束。秘密を厳守し、安心して働ける環境です。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStrength;
