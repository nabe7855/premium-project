'use client';

import { EditableImage } from '@/components/admin/EditableImage';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BrandingSupportProps {
  isEditing?: boolean;
  onUpdate?: (key: string, value: any) => void;
  brandingImages?: {
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
  };
}

const BrandingSupport: React.FC<BrandingSupportProps> = ({
  isEditing = false,
  onUpdate,
  brandingImages,
}) => {
  const navigate = useNavigate();

  const features = [
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

  const handleUpload = (key: string) => (file: File) => {
    if (onUpdate) onUpdate(key, file);
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
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <h2 className="mb-8 font-serif text-3xl font-light leading-tight tracking-wide text-white md:text-5xl lg:text-6xl">
                芸能・インフルエンサー活動との両立。
                <br />
                私たちが選ばれるのは、
                <br />
                圧倒的な<span className="font-normal text-amber-500">『質』</span>ゆえ。
              </h2>
              <p className="mb-12 text-lg font-light leading-relaxed text-slate-300 md:text-xl">
                今の環境に満足していますか？あなたの実績を正当に評価し、前職を上回る最高の条件を約束します。福岡完全新規店だからこそ可能な、しがらみのないリスタートを。
              </p>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-amber-500/50 hover:bg-white/10"
                  >
                    <h4 className="mb-2 font-serif text-lg text-amber-50">{f.title}</h4>
                    <p className="text-sm font-light leading-relaxed text-slate-400">{f.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => navigate('/form-full')}
                  className="rounded-none border border-amber-600 bg-amber-600/20 px-10 py-5 font-serif text-lg text-amber-500 transition-all hover:bg-amber-600 hover:text-white active:scale-95"
                >
                  優遇条件を詳しく確認する
                </button>
              </div>
              <p className="mt-6 text-xs text-slate-500">
                ※事務所所属の方のシークレット入店、スケジュール調整も柔軟に対応いたします
              </p>
            </div>

            {/* Right Visuals */}
            <div className="relative lg:col-span-5">
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="aspect-[3/4] overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
                    <EditableImage
                      src={brandingImages?.image1 || '/キャストモデル１.png'}
                      className="h-full w-full object-cover brightness-75 filter transition-all duration-700 hover:brightness-100"
                      alt="Professional 1"
                      isEditing={isEditing}
                      onUpload={handleUpload('image1')}
                    />
                  </div>
                  <div className="aspect-square overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
                    <EditableImage
                      src={brandingImages?.image2 || '/キャストモデル２.png'}
                      className="h-full w-full object-cover brightness-75 filter transition-all duration-700 hover:brightness-100"
                      alt="Professional 2"
                      isEditing={isEditing}
                      onUpload={handleUpload('image2')}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="aspect-square overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
                    <EditableImage
                      src={brandingImages?.image3 || '/キャストモデル３.png'}
                      className="h-full w-full object-cover brightness-75 filter transition-all duration-700 hover:brightness-100"
                      alt="Professional 3"
                      isEditing={isEditing}
                      onUpload={handleUpload('image3')}
                    />
                  </div>
                  <div className="aspect-[3/4] overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
                    <EditableImage
                      src={
                        brandingImages?.image4 ||
                        'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=600'
                      }
                      className="h-full w-full object-cover brightness-75 filter transition-all duration-700 hover:brightness-100"
                      alt="Professional 4"
                      isEditing={isEditing}
                      onUpload={handleUpload('image4')}
                    />
                  </div>
                </div>
              </div>

              {/* Floating metrics badge */}
              <div className="animate-bounce-slow absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-3xl border-4 border-slate-950 bg-amber-600 p-6 text-white shadow-2xl">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-widest opacity-80">
                  Fan Retention Rate
                </div>
                <div className="font-serif text-3xl font-bold">94.2%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translate(-50%, -55%); }
          50% { transform: translate(-50%, -45%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default BrandingSupport;
