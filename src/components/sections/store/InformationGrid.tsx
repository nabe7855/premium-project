import React from 'react';
import { CreditCard, Calendar, Bot, Briefcase } from 'lucide-react';
import { Store } from '@/types/store';

interface InformationGridProps {
  store: Store;
}

const InformationGrid: React.FC<InformationGridProps> = ({ store }) => {
  const informationItems = [
    {
      icon: CreditCard,
      title: '料金・ご利用案内',
      description: '詳しい料金プランとご利用方法をご確認いただけます',
      href: `/${store.id}/pricing`,
    },
    {
      icon: Calendar,
      title: '出勤スケジュール',
      description: 'キャストの出勤予定を確認してご予約ください',
      href: `/${store.id}/schedule`,
    },
    {
      icon: Bot,
      title: 'AI診断',
      description: 'あなたにぴったりのキャストをAIが診断します',
      href: `/${store.id}/ai-matching`,
    },
    {
      icon: Briefcase,
      title: '求人募集',
      description: '私たちと一緒に働きませんか？詳細はこちら',
      href: `/${store.id}/recruitment`,
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-noto">
          <span className={`text-${store.colors.primary}`}>Information</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {informationItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-4 bg-${store.colors.primary}/10 rounded-2xl mb-4 group-hover:bg-${store.colors.primary} transition-colors duration-300`}>
                  <IconComponent className={`h-8 w-8 text-${store.colors.primary} group-hover:text-white transition-colors duration-300`} />
                </div>
                <h3 className="text-lg font-semibold mb-2 font-noto group-hover:text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium">
                  <span className={`text-${store.colors.primary} group-hover:underline`}>
                    詳細を見る →
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InformationGrid;