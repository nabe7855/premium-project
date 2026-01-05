import { Award, CheckCircle2, Clock, MapPin, ShieldAlert, Users } from 'lucide-react';
import React from 'react';

const JobDetails: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-amber-500">
            Recruitment
          </h2>
          <p className="mb-6 font-serif text-3xl font-bold text-slate-900 md:text-4xl">
            プロフェッショナルへの道
          </p>
          <div className="mx-auto h-0.5 w-20 bg-amber-500"></div>
        </div>

        <div className="mb-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            <DetailRow
              icon={<Award className="h-5 w-5 text-amber-500" />}
              label="ポジション"
              content="エモーショナル・リラクゼーション・セラピスト"
            />
            <DetailRow
              icon={<Users className="h-5 w-5 text-amber-500" />}
              label="ターゲット層"
              content={
                <div className="space-y-2">
                  <p className="text-lg font-bold text-slate-900">
                    20代 〜 60代前半の方を幅広く選考
                  </p>
                  <p className="text-sm leading-relaxed text-slate-500">
                    ※昨今の多様なニーズに応えるため、若年層からミドル層まで「落ち着いた大人の魅力」を持つ方を歓迎します。
                    ※ご自身の経験が、お客様の深い共感を生む最大の武器となります。
                  </p>
                </div>
              }
            />
            <DetailRow
              icon={<Clock className="h-5 w-5 text-amber-500" />}
              label="ワークスタイル"
              content={
                <div className="space-y-2">
                  <p>24時間体制のフレキシブル・シフト制</p>
                  <p className="text-sm italic text-slate-500">
                    本業や家庭の時間を優先しながら、空いた時間を最大限に価値化。強制的な出勤やノルマは一切なく、個人のパフォーマンスを尊重します。
                  </p>
                </div>
              }
            />
            <DetailRow
              icon={<MapPin className="h-5 w-5 text-amber-500" />}
              label="活動エリア"
              content="福岡主要エリアを中心とした活動（リモート待機システム完備）"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-8">
            <h3 className="mb-6 flex items-center text-lg font-bold text-emerald-900">
              <CheckCircle2 className="mr-3 h-6 w-6 text-emerald-500" />
              求めるプロフェッショナル像
            </h3>
            <ul className="space-y-5">
              {[
                '徹底した衛生管理と清潔感を保持できる方',
                '高い傾聴力と、洗練された会話術を持つ方',
                'プロとしての自律性、規律を守れる方',
                '他者の幸福を自らの喜びと感じられるホスピタリティ',
                '常に自己研鑽を続け、自分磨きを楽しめる方',
                '他店での経験をさらなる高みへ繋げたい意欲のある方',
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start text-sm leading-relaxed text-emerald-800 md:text-base"
                >
                  <span className="mr-4 mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-100 p-8">
            <h3 className="mb-6 flex items-center text-lg font-bold text-slate-900">
              <ShieldAlert className="mr-3 h-6 w-6 text-slate-400" />
              選考が難しいケース
            </h3>
            <ul className="space-y-4">
              {[
                'プロとしての身だしなみ、礼儀を軽視する方',
                '自己中心的で、他者への想像力が欠如している方',
                '規律や時間を守ることが困難な、無責任な方',
                '顧客満足よりも金銭的報酬のみを優先される方',
                '感情のコントロールが難しく、不誠実な言動のある方',
                '出会い系のような「個人的目的」を混同される方',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start text-sm leading-relaxed text-slate-600">
                  <span className="mr-4 mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300"></span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center text-[11px] italic text-slate-400">
              ※ご自身のプロフェッショナリズムが、このステージに相応しいかをご一考の上エントリーください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  content: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, content }) => (
  <div className="flex flex-col p-8 sm:flex-row">
    <div className="mb-4 flex w-full items-center sm:mb-0 sm:w-1/4">
      <div className="mr-4 rounded-xl border border-slate-100 bg-slate-50 p-2.5 shadow-sm">
        {icon}
      </div>
      <span className="text-sm font-bold tracking-widest text-slate-800">{label}</span>
    </div>
    <div className="w-full text-slate-600 sm:w-3/4">{content}</div>
  </div>
);

export default JobDetails;
