
import React from 'react';
import { SectionTitle } from './Common';

const RequirementSection: React.FC = () => {
  return (
    <section id="req" className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionTitle title="募集要項" subtitle="REQUIREMENTS" />
        <div className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b border-stone-200">
                <th className="bg-stone-100 p-4 font-bold text-sm w-1/4 md:w-1/5">職種</th>
                <td className="p-4 text-sm font-medium">セラピスト（マッサージ・接客）</td>
              </tr>
              <tr className="border-b border-stone-200">
                <th className="bg-stone-100 p-4 font-bold text-sm">応募資格</th>
                <td className="p-4 text-sm font-medium">20歳〜45歳位まで。未経験者、主婦、ダブルワーク歓迎。</td>
              </tr>
              <tr className="border-b border-stone-200">
                <th className="bg-stone-100 p-4 font-bold text-sm">報酬</th>
                <td className="p-4 text-sm font-medium">完全歩合制（高バック率）。指名手当、各種ボーナス、全額日払い可。</td>
              </tr>
              <tr className="border-b border-stone-200">
                <th className="bg-stone-100 p-4 font-bold text-sm">時間</th>
                <td className="p-4 text-sm font-medium">10:00〜翌5:00の間で自由シフト制。週1日・3時間〜OK。</td>
              </tr>
              <tr>
                <th className="bg-stone-100 p-4 font-bold text-sm">待遇</th>
                <td className="p-4 text-sm font-medium">
                  <div className="flex flex-wrap gap-2">
                    {['即日払い', 'エリアブロック', '顔出し不要', '無料研修', '寮完備', '友人紹介ボーナス'].map(t => (
                      <span key={t} className="bg-white border border-stone-300 px-2 py-1 rounded text-[10px] md:text-xs">#{t}</span>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default RequirementSection;
