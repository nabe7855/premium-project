'use client';
import { ConceptConfig } from '@/lib/store/storeTopConfig';
import { CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ConceptSectionProps {
  config?: ConceptConfig;
}

const concepts = [
  {
    title: '厳選セラピスト',
    desc: '容姿だけでなく、高いホスピタリティと社会人としてのマナーを兼ね備えた男性のみを採用。厳しい研修をクリアしたプロフェッショナルが伺います。',
    imageUrl:
      'https://images.unsplash.com/photo-1519735812324-ecb585a06a26?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: '女性目線の安心感',
    desc: '女性スタッフによる運営・管理を徹底。女性ならではの細やかな配慮と、万全のセキュリティ体制で、初めての方でも安心してご利用いただけます。',
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
  const items = config?.items || concepts;
  const heading = config?.heading || '安心と癒やしを、すべての女性の日常に。';
  const subHeading = config?.subHeading || 'Our Concept';
  const footerText =
    config?.footerText || '「自分へのご褒美」を、もっと身近で、もっと心地よいものに。';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentConceptIndex((prev) => (prev + 1) % concepts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mx-auto max-w-7xl overflow-hidden px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 items-center gap-12 md:gap-20 lg:grid-cols-2">
        {/* Image Side */}
        <div className="relative order-2 h-[400px] md:h-[600px] lg:order-1">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-pink-100 opacity-50 mix-blend-multiply blur-3xl filter"></div>
          <div className="bg-primary-100 absolute -bottom-10 -right-10 h-40 w-40 rounded-full opacity-50 mix-blend-multiply blur-3xl filter"></div>

          {items.map((concept, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 z-10 transform overflow-hidden rounded-[2rem] shadow-2xl transition-all duration-1000 ${
                idx === currentConceptIndex
                  ? 'translate-y-0 rotate-0 opacity-100'
                  : 'pointer-events-none translate-y-8 rotate-3 opacity-0'
              }`}
            >
              <img
                src={concept.imageUrl}
                alt={concept.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Content Side */}
        <div className="order-1 lg:order-2">
          <span className="text-primary-400 text-[10px] font-bold uppercase tracking-[0.4em] md:text-xs">
            {subHeading}
          </span>
          <h2 className="mb-6 mt-3 whitespace-pre-line font-serif text-2xl leading-snug text-slate-800 md:text-4xl">
            {heading}
          </h2>

          <div className="mb-8 space-y-4">
            {items.map((concept, idx) => (
              <div
                key={idx}
                className={`relative cursor-pointer rounded-[1.5rem] border p-4 transition-all duration-500 md:p-6 ${
                  idx === currentConceptIndex
                    ? 'border-primary-200 shadow-primary-50 scale-[1.02] bg-white shadow-lg'
                    : 'hover:border-primary-100 border-neutral-100 bg-white/50 hover:bg-white'
                }`}
                onClick={() => setCurrentConceptIndex(idx)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 rounded-xl p-2 transition-colors ${idx === currentConceptIndex ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-slate-400'}`}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h3
                      className={`mb-1 text-sm font-bold transition-colors md:text-base ${idx === currentConceptIndex ? 'text-slate-800' : 'text-slate-500'}`}
                    >
                      {concept.title}
                    </h3>
                    {idx === currentConceptIndex && (
                      <p className="text-xs leading-relaxed text-slate-500 duration-500 animate-in fade-in slide-in-from-top-2 md:text-sm">
                        {concept.desc}
                      </p>
                    )}
                  </div>
                </div>
                {idx === currentConceptIndex && (
                  <div className="bg-primary-100 absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-[1.5rem]">
                    <div className="bg-primary-500 h-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="border-l-4 border-pink-200 py-2 pl-4 text-xs italic text-slate-500 md:text-sm">
            {footerText}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;
