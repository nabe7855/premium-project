import React from 'react';
// Added Calendar to the imports from lucide-react
import { Calendar, Zap } from 'lucide-react';

const SalarySimulation: React.FC = () => {
  return (
    <div className="container relative mx-auto px-4">
      {/* Decorative background circle */}
      <div className="absolute right-0 top-0 -z-10 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl"></div>

      <div className="mb-16 text-center">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-amber-500">
          Earnings
        </h2>
        <p className="mb-6 font-serif text-3xl font-bold italic text-white md:text-4xl">
          あなたの魅力が<span className="text-amber-500">ダイレクトに収入に。</span>
        </p>
        <p className="mx-auto max-w-2xl text-slate-400">
          業界トップクラスの歩合率と、確かな集客力。未経験からでも月収50万円以上を目指せるモデルケースをご紹介します。
        </p>
      </div>

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Model Cases */}
        <div className="space-y-6">
          <ModelCase
            title="副業・週末メイン Aさん"
            role="28歳 会社員"
            schedule="土日（月8日）× 1日4時間"
            income="240,000"
            details="週2日の勤務でも、リピーターを獲得すればこれだけの安定収入に。"
          />
          <ModelCase
            title="がっつりフルタイム Bさん"
            role="24歳 フリーター"
            schedule="週5日（月22日）× 1日6時間"
            income="650,000"
            details="研修で身につけた技術と指名数アップで、若くして高額所得者へ。"
          />
          <ModelCase
            title="深夜短時間 Cさん"
            role="35歳 既婚者"
            schedule="週3日（月12日）× 深夜3時間"
            income="320,000"
            details="空いた時間だけで効率よく。家族にバレず秘密の副収入。"
          />
        </div>

        {/* Breakdown Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 text-slate-900 shadow-2xl lg:p-12">
          <div className="absolute right-0 top-0 rounded-bl-3xl bg-amber-500 px-6 py-2 text-sm font-bold text-white">
            報酬例 (100分コース)
          </div>

          <h3 className="mb-8 flex items-center text-2xl font-bold">
            <Zap className="mr-2 text-amber-500" />
            報酬内訳の一例
          </h3>

          <div className="mb-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-slate-500">基本バック (50%スタート)</span>
              <span className="font-bold">¥12,000 〜</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-slate-500">指名料 (100%還元)</span>
              <span className="font-bold text-emerald-600">+ ¥3,000</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-slate-500">深夜/延長/交通手当等</span>
              <span className="font-bold text-emerald-600">+ ¥2,000 〜</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-bold">1接客あたりの合計報酬</span>
              <span className="text-3xl font-bold text-amber-500">¥17,000+</span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm italic leading-relaxed text-slate-600">
              ※ランクアップ制度により基本バック率は最大70%まで上昇します。
              ※最低保証日給制度もあり、待機時間中も安心して働けます。
            </p>
          </div>

          <div className="mt-8">
            <a
              href="#apply"
              className="block w-full rounded-xl bg-slate-900 py-4 text-center font-bold text-white shadow-lg transition-colors hover:bg-slate-800 active:scale-95"
            >
              詳しい給与システムを聞く
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ModelCaseProps {
  title: string;
  role: string;
  schedule: string;
  income: string;
  details: string;
}

const ModelCase: React.FC<ModelCaseProps> = ({ title, role, schedule, income, details }) => (
  <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-amber-500/50">
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h4 className="text-lg font-bold text-white">{title}</h4>
        <span className="text-xs font-medium uppercase tracking-widest text-amber-500">{role}</span>
      </div>
      <div className="text-right">
        <span className="mb-1 block text-xs text-slate-400">月収目安</span>
        <span className="text-2xl font-bold text-white">
          ¥{income}
          <span className="ml-1 text-xs font-normal text-slate-400">〜</span>
        </span>
      </div>
    </div>
    <div className="mb-3 flex items-center text-sm text-slate-400">
      <Calendar className="mr-2 h-4 w-4 text-slate-500" />
      {schedule}
    </div>
    <p className="text-xs leading-relaxed text-slate-500">{details}</p>
  </div>
);

export default SalarySimulation;
