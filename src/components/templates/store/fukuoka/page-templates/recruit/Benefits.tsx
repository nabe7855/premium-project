
import React from 'react';
import { 
  CreditCard, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Shirt, 
  Scissors, 
  Smile, 
  ShieldAlert,
  Rocket,
  ShieldCheck
} from 'lucide-react';

const Benefits: React.FC = () => {
  const benefitItems = [
    { icon: <CreditCard />, title: "全額日払い可", desc: "稼いだ報酬はその日に支給。" },
    { icon: <MapPin />, title: "交通費支給", desc: "移動に関わる負担を軽減します。" },
    { icon: <Briefcase />, title: "Wワーク歓迎", desc: "副業としての働きやすさを追求。" },
    { icon: <GraduationCap />, title: "充実の研修", desc: "プロ講師による一流の技術指導。" },
    { icon: <Shirt />, title: "私服勤務OK", desc: "清潔感があればスタイルは自由。" },
    { icon: <Scissors />, title: "髪型・髭自由", desc: "自分らしさを活かせる職場です。" },
    { icon: <Smile />, title: "ノルマ一切なし", desc: "自分のペースで気楽に働けます。" },
    { icon: <ShieldAlert />, title: "24時間サポート", desc: "トラブル時は即スタッフが対応。" },
    { icon: <ShieldCheck />, title: "身バレ対策徹底", desc: "顔出し不要などプライバシーを保護。" },
    { icon: <Rocket />, title: "独立支援", desc: "将来の店舗運営を目指す方も応援。" }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-sm font-bold text-amber-500 tracking-widest uppercase mb-4">Welfare</h2>
        <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-serif">
          充実の待遇・サポート
        </p>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          あなたが安心してセラピストとして活動できるよう、業界最高水準の環境を整えました。不安なことはいつでも専属スタッフにご相談ください。
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        {benefitItems.map((item, index) => (
          <div 
            key={index} 
            className="group flex flex-col items-center p-6 bg-white border border-slate-100 rounded-2xl hover:border-amber-200 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-slate-50 text-amber-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all">
              {React.cloneElement(item.icon as React.ReactElement, { size: 24 })}
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-2 text-center">{item.title}</h3>
            <p className="text-[10px] md:text-xs text-slate-500 text-center leading-tight">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Trust Badge */}
      <div className="mt-16 p-8 bg-slate-900 rounded-[40px] flex flex-col md:flex-row items-center justify-between text-white border border-slate-800 shadow-2xl">
        <div className="flex items-center mb-6 md:mb-0">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mr-6 shrink-0">
             <ShieldAlert className="text-amber-500 w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold mb-1 font-serif italic">Safety & Compliance</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              当店は風営法に基づき適正に届け出を行い、透明性の高い経営を行っています。<br className="hidden md:block" />
              違法行為との関わりは一切なく、セラピストの安全を第一に考えています。
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <div className="inline-block px-6 py-3 border border-slate-700 rounded-full text-slate-400 text-xs font-bold tracking-widest uppercase">
            Official Registered
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
