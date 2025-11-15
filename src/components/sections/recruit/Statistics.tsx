'use client';
import React from 'react';
import { TrendingUp, Users, Shield, Award, Heart, Clock } from 'lucide-react';

const Statistics: React.FC = () => {
  const stats = [
    {
      icon: <Heart className="h-8 w-8 text-pink-500 lg:h-12 lg:w-12" />,
      value: '95%',
      label: '在籍セラピスト満足度',
      description: '働く環境への満足度',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-500 lg:h-12 lg:w-12" />,
      value: '¥5,000〜',
      label: '業界最高水準の給与',
      description: '経験・スキルに応じて',
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500 lg:h-12 lg:w-12" />,
      value: '100%',
      label: '専任スタッフ',
      description: '安心のサポート体制',
    },
    {
      icon: <Award className="h-8 w-8 text-purple-500 lg:h-12 lg:w-12" />,
      value: '98%',
      label: '研修完了率',
      description: '充実した研修制度',
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-500 lg:h-12 lg:w-12" />,
      value: '85%',
      label: '継続勤務率',
      description: '6ヶ月以上の継続率',
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-500 lg:h-12 lg:w-12" />,
      value: '週2日',
      label: '最低勤務日数',
      description: '自由度の高いシフト',
    },
  ];

  return (
    <section id="statistics" className="bg-gray-50 py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center lg:mb-12">
          <h2 className="mb-4 font-rounded text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
            Trust & Growth
          </h2>
          <p className="font-serif text-lg text-gray-600 lg:text-xl">数字が語る信頼と成長</p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md lg:p-6"
            >
              <div className="text-center">
                <div className="mb-3 flex justify-center lg:mb-4">{stat.icon}</div>
                <div className="mb-2 text-2xl font-bold text-gray-800 lg:text-3xl">
                  {stat.value}
                </div>
                <div className="mb-1 text-sm font-semibold text-gray-700 lg:text-lg">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500 lg:text-sm">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
