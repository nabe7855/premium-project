
import React from 'react';
import { DollarSign, ShieldCheck, Calendar, Sparkles, Heart, UserPlus } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <DollarSign className="w-8 h-8 text-amber-500" />,
      title: "高水準のバック率",
      description: "基本50%からスタートし、最大70%まで昇給。指名料は100%バック。福岡エリアでも最高クラスの報酬体系を整えています。"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-amber-500" />,
      title: "100%女性客・安全経営",
      description: "お客様は全員女性。法令を遵守し、性的な挿入行為は一切禁止。物理的・精神的な負担が少ないソフトなサービスが中心です。"
    },
    {
      icon: <Calendar className="w-8 h-8 text-amber-500" />,
      title: "完全自由シフト",
      description: "週1日・1日2時間からOK。24時間の中で好きな時に働けます。昼職との掛け持ちや、空いた時間だけの副業も大歓迎です。"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-amber-500" />,
      title: "未経験でも安心の研修",
      description: "マッサージ技術から女性へのエスコート術まで、専属講師が丁寧にレクチャー。経験ゼロからでも自信を持ってデビューできます。"
    },
    {
      icon: <Heart className="w-8 h-8 text-amber-500" />,
      title: "万全の身バレ対策",
      description: "源氏名制度の導入はもちろん、ネット上に顔出ししないプロフィール管理も可能。身内や本業への配慮も徹底的にサポートします。"
    },
    {
      icon: <UserPlus className="w-8 h-8 text-amber-500" />,
      title: "オープニング特典",
      description: "今ならオープニングキャスト限定の入店祝い金や特別バックアップを実施中。新しい店舗を一緒に盛り上げてくれる仲間を探しています。"
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-sm font-bold text-amber-500 tracking-widest uppercase mb-4">Features</h2>
        <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-serif">
          当店で働く<span className="text-amber-500">6つのメリット</span>
        </p>
        <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-white hover:shadow-xl transition-all duration-300 group"
          >
            <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-amber-50 transition-colors">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
