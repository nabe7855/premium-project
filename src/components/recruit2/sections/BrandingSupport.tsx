'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Feature {
  title: string;
  desc: string;
}

interface BrandingSupportProps {
  isEditing?: boolean;
  onUpdate?: (key: string, value: any) => void;
  heading?: string;
  description?: string;
  features?: Feature[];
}

const DEFAULT_HEADING =
  '芸能・インフルエンサー活動との両立。\n私たちが選ばれるのは、\n圧倒的な『質』ゆえ。';

const DEFAULT_DESCRIPTION =
  '今の環境に満足していますか？あなたの実績を正当に評価し、前職を上回る最高の条件を約束します。福岡完全新規店だからこそ可能な、しがらみのないリスタートを。';

const DEFAULT_FEATURES: Feature[] = [
  {
    title: '最大級の還元率と移籍ボーナス',
    desc: '前職の給与・指名数を考慮。移籍に伴う準備金制度あり。あなたの実績を『数字』で100%評価します。',
  },
  {
    title: '芸能・インフルエンサー特化サポート',
    desc: '完全顔出しなし、SNS対策、アリバイ対策完備。活動に支障をきたさない徹底したプライバシー管理を約束します。',
  },
  {
    title: '富裕層・V.I.P客限定の集客力',
    desc: '業界屈指のブランド力で、客層の良さは折り紙付き。無駄な待機を減らし、短時間で効率よく稼げる環境です。',
  },
  {
    title: '次世代へのキャリアデザイン',
    desc: '店舗運営への参画、独立支援、あるいは芸能活動のバックアップ。単なる『キャスト』で終わらせない、次のステージへの投資を行います。',
  },
];

const BrandingSupport: React.FC<BrandingSupportProps> = ({
  isEditing = false,
  onUpdate,
  heading = DEFAULT_HEADING,
  description = DEFAULT_DESCRIPTION,
  features,
}) => {
  const navigate = useNavigate();
  const displayFeatures = features ?? DEFAULT_FEATURES;

  const handleFeatureUpdate = (idx: number, field: 'title' | 'desc', value: string) => {
    if (!onUpdate) return;
    const updated = displayFeatures.map((f, i) => (i === idx ? { ...f, [field]: value } : f));
    onUpdate('features', updated);
  };

  return (
    <section className="relative overflow-hidden bg-black py-24 text-white">
      {/* Decorative background elements - Champagne Bubbles */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-10 top-20 h-4 w-4 rounded-full bg-amber-200 blur-[2px]"></div>
        <div className="absolute left-1/4 top-1/2 h-8 w-8 rounded-full bg-amber-500/20 blur-[10px]"></div>
        <div className="absolute bottom-1/3 left-1/2 h-6 w-6 rounded-full bg-amber-100/40 blur-[4px]"></div>
        <div className="absolute right-1/3 top-1/4 h-3 w-3 rounded-full bg-amber-300/30 blur-[2px]"></div>
        <div className="absolute bottom-20 right-10 h-5 w-5 rounded-full bg-amber-400/20 blur-[5px]"></div>
      </div>
      <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full bg-amber-600/10 blur-[120px]"></div>
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-slate-800/20 blur-[120px]"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {isEditing ? (
            <h2
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdate?.('heading', e.currentTarget.innerText)}
              className="mb-8 cursor-text whitespace-pre-line rounded font-serif text-3xl font-light leading-tight tracking-wide text-white outline-none hover:bg-white/5 md:text-5xl lg:text-6xl"
            >
              {heading}
            </h2>
          ) : (
            <h2 className="mb-8 whitespace-pre-line font-serif text-3xl font-light leading-tight tracking-wide text-white md:text-5xl lg:text-6xl">
              {heading}
            </h2>
          )}

          {isEditing ? (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdate?.('description', e.currentTarget.innerText)}
              className="mx-auto mb-16 max-w-2xl cursor-text rounded text-lg font-light leading-relaxed text-slate-300 outline-none hover:bg-white/5 md:text-xl"
            >
              {description}
            </p>
          ) : (
            <p className="mx-auto mb-16 max-w-2xl text-lg font-light leading-relaxed text-slate-300 md:text-xl">
              {description}
            </p>
          )}

          <div className="grid grid-cols-1 gap-8 text-left md:grid-cols-2">
            {displayFeatures.map((f, i) => (
              <div
                key={i}
                className="group rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-amber-500/50 hover:bg-white/10"
              >
                {isEditing ? (
                  <h4
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleFeatureUpdate(i, 'title', e.currentTarget.innerText)}
                    className="mb-4 cursor-text rounded font-serif text-xl text-amber-50 outline-none hover:bg-white/5"
                  >
                    {f.title}
                  </h4>
                ) : (
                  <h4 className="mb-4 font-serif text-xl text-amber-50">{f.title}</h4>
                )}
                {isEditing ? (
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleFeatureUpdate(i, 'desc', e.currentTarget.innerText)}
                    className="cursor-text rounded text-base font-light leading-relaxed text-slate-400 outline-none hover:bg-white/5"
                  >
                    {f.desc}
                  </p>
                ) : (
                  <p className="text-base font-light leading-relaxed text-slate-400">{f.desc}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate('/form-full')}
              className="rounded-none border border-amber-600 bg-amber-600/20 px-12 py-5 font-serif text-lg text-amber-500 transition-all hover:bg-amber-600 hover:text-white active:scale-95"
            >
              優遇条件を詳しく確認する
            </button>
          </div>
          <p className="mt-8 text-xs text-slate-500">
            ※事務所所属の方のシークレット入店、スケジュール調整も柔軟に対応いたします
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandingSupport;
