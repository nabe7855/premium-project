'use client';
import React from 'react';
import { Users, GraduationCap } from 'lucide-react';

const JobRequirements: React.FC = () => {
  const requirements = [
    {
      category: '応募資格',
      items: ['18歳以上の女性', '未経験者歓迎', '経験者優遇', '学歴不問'],
    },
    {
      category: '勤務地',
      items: ['都内主要エリア', '完全個室制', '最寄駅から徒歩5分以内'],
    },
    {
      category: '勤務時間',
      items: [
        '10:00〜24:00（自由シフト制）',
        '週2日から勤務OK',
        '1日3時間から働ける',
        '24時間前までシフト変更可能',
      ],
    },
    {
      category: '報酬',
      items: [
        '時給 5,000円〜',
        '経験・スキルに応じて昇給',
        '各種手当あり',
      ],
    },
  ];

  const benefits = [

    {
      icon: <GraduationCap className="h-6 w-6 text-blue-500" />,
      title: '研修・サポート',
      items: ['新人研修制度', 'マンツーマン指導', '定期スキルアップ研修', 'メンタルサポート'],
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: '働きやすい環境',
      items: ['専任スタッフ常駐', '働き方自由', '24時間サポート', 'プライバシー保護'],
    },
  ];

  return (
    <section id="requirements" className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-rounded text-3xl font-bold text-gray-800 md:text-4xl">
            募集要項
          </h2>
          <p className="font-serif text-xl text-gray-600">詳しい勤務条件と待遇について</p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {requirements.map((req, index) => (
              <div key={index} className="rounded-xl bg-gray-50 p-6">
                <h3 className="mb-4 font-rounded text-xl font-bold text-gray-800">
                  {req.category}
                </h3>
                <ul className="space-y-2">
                  {req.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center space-x-3">
                      <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mb-12 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 p-8">
            <h3 className="mb-6 text-center font-rounded text-2xl font-bold text-gray-800">
              福利厚生・サポート体制
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="rounded-lg bg-white p-6 text-center">
                  <div className="mb-4 flex justify-center">{benefit.icon}</div>
                  <h4 className="mb-3 text-lg font-semibold text-gray-800">{benefit.title}</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {benefit.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-800">面接から勤務開始までの流れ</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-white p-4 text-center">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-white">
                  1
                </div>
                <h4 className="mb-1 font-semibold text-gray-800">応募</h4>
                <p className="text-sm text-gray-600">WEBまたはお電話</p>
              </div>
              <div className="rounded-lg bg-white p-4 text-center">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-white">
                  2
                </div>
                <h4 className="mb-1 font-semibold text-gray-800">面接</h4>
                <p className="text-sm text-gray-600">専任スタッフが対応</p>
              </div>
              <div className="rounded-lg bg-white p-4 text-center">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-white">
                  3
                </div>
                <h4 className="mb-1 font-semibold text-gray-800">研修</h4>
                <p className="text-sm text-gray-600">充実した研修制度</p>
              </div>
              <div className="rounded-lg bg-white p-4 text-center">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-white">
                  4
                </div>
                <h4 className="mb-1 font-semibold text-gray-800">勤務開始</h4>
                <p className="text-sm text-gray-600">サポート体制万全</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobRequirements;
