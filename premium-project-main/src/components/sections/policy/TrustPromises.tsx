'use client';
import React from 'react';
import { Lock, UserX, Phone } from 'lucide-react';

export const TrustPromises: React.FC = () => {
  const promises = [
    {
      icon: <Lock className="text-red-600" size={20} />,
      title: 'お客様の情報は厳重に保護します',
      description: '最新のセキュリティ技術により、個人情報を安全に管理しています',
    },
    {
      icon: <UserX className="text-red-600" size={20} />,
      title: '第三者への開示は一切行いません',
      description: '法令で定められた場合を除き、お客様の同意なく情報を共有することはありません',
    },
    {
      icon: <Phone className="text-red-600" size={20} />,
      title: 'ご不明な点はいつでもお気軽にご相談ください',
      description: '専門スタッフが丁寧にお答えいたします',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-pink-50 px-4 py-8">
      <div className="mx-auto max-w-sm sm:max-w-2xl lg:max-w-4xl">
        <h2 className="mb-6 text-center font-sans text-xl font-bold text-gray-800 sm:text-2xl">
          信頼性の3つの約束
        </h2>

        <div className="space-y-4 sm:grid sm:grid-cols-1 sm:gap-4 lg:grid-cols-3">
          {promises.map((promise, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-start">
                <div className="mr-3 mt-1 flex-shrink-0">{promise.icon}</div>
                <h3 className="font-sans text-sm font-bold leading-tight text-gray-800 sm:text-base">
                  {promise.title}
                </h3>
              </div>
              <p className="ml-8 font-serif text-sm leading-relaxed text-gray-600 sm:text-base">
                {promise.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
