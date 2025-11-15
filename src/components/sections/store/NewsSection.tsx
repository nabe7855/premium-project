'use client';

import React, { useState } from 'react';
import { Calendar, Users, BookOpen, Tv } from 'lucide-react';
import { NewsItem, Store } from '@/types/store';

interface NewsSectionProps {
  store: Store;
  news: NewsItem[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ store, news }) => {
  const [activeTab, setActiveTab] = useState<string>('new-staff');

  const tabs = [
    { id: 'new-staff', label: '新人紹介', icon: Users },
    { id: 'event', label: 'イベント', icon: Calendar },
    { id: 'diary', label: '日記更新', icon: BookOpen },
    { id: 'media', label: 'メディア', icon: Tv },
  ];

  const filteredNews = news.filter((item) => item.category === activeTab);

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center font-noto text-3xl font-bold md:text-4xl">
          News & <span className={`text-${store.colors.primary}`}>Topics</span>
        </h2>

        {/* Tab navigation */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 rounded-full px-4 py-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? `bg-${store.colors.primary} text-white`
                    : `text-${store.colors.primary} hover:bg-${store.colors.primary}/10`
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-sm md:text-base">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* News content */}
        <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
          {filteredNews.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">現在お知らせはありません</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredNews.map((item) => (
                <article
                  key={item.id}
                  className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between">
                    <h3 className="mb-2 font-noto text-lg font-semibold text-gray-900 md:mb-0 md:text-xl">
                      {item.title}
                    </h3>
                    <time className="text-sm text-gray-500">{item.date}</time>
                  </div>
                  <p className="mb-4 leading-relaxed text-gray-600">{item.excerpt}</p>
                  <button className={`text-${store.colors.primary} font-medium hover:underline`}>
                    詳細を見る →
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
