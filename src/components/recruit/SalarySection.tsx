
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SectionTitle } from './Common';

const SalarySection: React.FC = () => {
  return (
    <section id="salary" className="py-20 bg-stone-900 px-4 text-white">
      <div className="max-w-5xl mx-auto">
        <SectionTitle title="確かな収入が、自信を生む。" subtitle="INCOME MODEL" light />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-gold/50 transition-all flex flex-col items-center">
            <p className="text-stone-400 font-bold mb-4 uppercase text-xs tracking-widest">W-JOB / SIDE</p>
            <h3 className="text-xl font-bold mb-2">週末のみ副業タイプ</h3>
            <div className="text-4xl font-black text-gold my-4">15<span className="text-sm font-medium ml-1">万円〜</span></div>
            <p className="text-stone-400 text-sm text-center">土日のみの出勤でも、月収15万円以上のプラスを確保可能です。</p>
          </div>
          <div className="bg-white/10 p-8 rounded-3xl border-2 border-gold relative flex flex-col items-center scale-105 shadow-2xl">
            <div className="absolute -top-4 bg-gold text-stone-900 font-black px-4 py-1 rounded-full text-xs">MOST POPULAR</div>
            <p className="text-stone-300 font-bold mb-4 uppercase text-xs tracking-widest">REGULAR STAFF</p>
            <h3 className="text-xl font-bold mb-2">週5日レギュラー</h3>
            <div className="text-5xl font-black text-white my-4">60<span className="text-sm font-medium ml-1 text-gold">万円〜</span></div>
            <p className="text-stone-300 text-sm text-center">本業として安定して稼ぎたい方向け。平均月収60万円を目指せます。</p>
          </div>
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-strawberry/50 transition-all flex flex-col items-center">
            <p className="text-stone-400 font-bold mb-4 uppercase text-xs tracking-widest">TOP RUNNER</p>
            <h3 className="text-xl font-bold mb-2">トップランナー</h3>
            <div className="text-4xl font-black text-strawberry my-4">100<span className="text-sm font-medium ml-1">万円超</span></div>
            <p className="text-stone-400 text-sm text-center">指名・各種バックをフル活用し、月収100万円を超えるスタッフも多数在籍。</p>
          </div>
        </div>
        <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
          <p className="text-stone-300 text-sm font-bold flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-gold" /> 完全歩合制 / 完全日払い対応
          </p>
          <p className="text-xs text-stone-500">※ノルマ、罰金、衣装代などの不当な天引きは一切ありません。</p>
        </div>
      </div>
    </section>
  );
};

export default SalarySection;
