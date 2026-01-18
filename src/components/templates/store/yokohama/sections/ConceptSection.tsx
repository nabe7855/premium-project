'use client';
import { ConceptConfig } from '@/lib/store/storeTopConfig';
import { CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ConceptSectionProps {
  config?: ConceptConfig;
}

const defaultConcepts = [
  {
    title: '厳選セラピスト',
    desc: '容姿だけでなく、高いホスピタリティと社会人としてのマナーを兼ね備えた男性のみを採用。厳しい研修をクリアしたプロフェッショナルが伺います。',
    imageUrl:
      'https://images.unsplash.com/photo-1519735812324-ecb585a06a26?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: '女性目線の安心感',
    desc: '女性スタッフによる運営・管理を徹底。女性ならではの細やかな配慮と、万全েরセキュリティ体制で、初めての方でも安心してご利用いただけます。',
    imageUrl:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: '完全プライベート',
    desc: 'ご自宅やホテルなど、ご指定の場所がプライベートサロンに。周りの目を気にせず、心ゆくまでリラックスできる時間をご提供します。',
    imageUrl:
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: '明朗会計',
    desc: '不透明な追加料金は一切ございません。WEBサイトに記載の料金プランに基づき、事前に正確な金額をご提示いたします。',
    imageUrl:
      'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=1000',
  },
];

const ConceptSection: React.FC<ConceptSectionProps> = ({ config }) => {
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const items = config?.items || defaultConcepts;
  const heading = config?.heading || '安心と癒やしを、すべての女性の日常に。';
  const subHeading = config?.subHeading || 'Our Concept';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentConceptIndex((prev) => (prev + 1) % items.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <section id="concept" className="bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Content Side */}
          <div className="order-2 lg:order-1">
            <span className="text-primary-500 text-xs font-bold uppercase tracking-[0.3em]">
              {subHeading}
            </span>
            <h2 className="mb-8 mt-4 font-serif text-3xl font-bold leading-tight text-slate-800 md:text-5xl">
              {heading}
            </h2>

            <div className="space-y-4">
              {items.map((concept, idx) => (
                <div
                  key={idx}
                  className={`cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                    idx === currentConceptIndex
                      ? 'border-primary-200 shadow-primary-100/20 bg-white shadow-lg'
                      : 'border-transparent bg-transparent hover:bg-white/50'
                  }`}
                  onClick={() => setCurrentConceptIndex(idx)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 rounded-full p-2 ${
                        idx === currentConceptIndex
                          ? 'bg-primary-500 text-white'
                          : 'bg-primary-50 text-primary-400'
                      }`}
                    >
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h3
                        className={`mb-2 text-lg font-bold ${
                          idx === currentConceptIndex ? 'text-slate-800' : 'text-slate-500'
                        }`}
                      >
                        {concept.title}
                      </h3>
                      {idx === currentConceptIndex && (
                        <p className="text-sm leading-relaxed text-slate-500 duration-500 animate-in fade-in slide-in-from-top-2">
                          {concept.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Side */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-2xl">
              {items.map((concept, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    idx === currentConceptIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={concept.imageUrl}
                    alt={concept.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;
