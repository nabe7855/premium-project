import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Store } from '@/types/store';

interface StoreMessageProps {
  store: Store;
}

const StoreMessage: React.FC<StoreMessageProps> = ({ store }) => {
  const getMessage = () => {
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? '朝' : currentHour < 18 ? '昼' : '夜';
    
    switch (store.id) {
      case 'tokyo':
        return `${store.displayName}へようこそ。本日も素敵な${timeOfDay}をお過ごしください。心温まるひとときをお約束いたします。`;
      case 'osaka':
        return `${store.displayName}やでー！今日もめっちゃ楽しい時間にしよな。みんなで最高の${timeOfDay}を過ごそう！`;
      case 'nagoya':
        return `${store.displayName}にお越しいただき、ありがとうございます。特別な${timeOfDay}のひとときを、心を込めてご提供いたします。`;
      default:
        return `${store.displayName}へようこそ。本日も皆様を心よりお待ちしております。`;
    }
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-noto">
          Message from <span className={`text-${store.colors.primary}`}>{store.displayName}</span>
        </h2>

        <div className="relative">
          {/* Decorative background */}
          <div className={`absolute inset-0 ${store.colors.gradient} opacity-10 rounded-3xl transform rotate-1`}></div>
          <div className="absolute inset-0 bg-white rounded-3xl shadow-lg"></div>
          
          {/* Content */}
          <div className="relative p-8 md:p-12">
            <div className="flex items-start space-x-4 mb-6">
              <div className={`p-3 bg-${store.colors.primary} rounded-full`}>
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 font-noto">スタッフより</h3>
                <p className="text-gray-600 text-sm">本日のメッセージ</p>
              </div>
            </div>

            <div className="pl-16">
              <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-dancing font-medium">
                {getMessage()}
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <div className={`w-16 h-16 bg-${store.colors.primary} rounded-full`}></div>
            </div>
            <div className="absolute bottom-4 left-4 opacity-10">
              <div className={`w-12 h-12 bg-${store.colors.secondary} rounded-full`}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreMessage;