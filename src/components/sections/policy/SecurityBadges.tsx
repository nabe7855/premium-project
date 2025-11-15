'use client';
import React from 'react';
import { Shield, Lock, Award } from 'lucide-react';

export const SecurityBadges: React.FC = () => {
  const badges = [
    {
      icon: <Lock className="text-green-600" size={18} />,
      title: 'SSL暗号化通信',
      description: '通信内容は暗号化されています',
    },
    {
      icon: <Shield className="text-blue-600" size={18} />,
      title: '個人情報保護法遵守',
      description: '個人情報保護法に完全準拠',
    },
    {
      icon: <Award className="text-purple-600" size={18} />,
      title: '個人情報保護宣言',
      description: 'プライバシー保護を宣言',
    },
  ];

  return (
    <section className="bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-sm sm:max-w-2xl lg:max-w-4xl">
        <div className="space-y-3 sm:grid sm:grid-cols-1 sm:gap-3 lg:grid-cols-3 lg:space-y-0">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center rounded-lg bg-white p-3 shadow-sm">
              <div className="mr-3 flex-shrink-0">{badge.icon}</div>
              <div className="min-w-0 flex-1">
                <h4 className="font-sans text-xs font-bold leading-tight text-gray-800 sm:text-sm">
                  {badge.title}
                </h4>
                <p className="font-serif text-xs leading-tight text-gray-600">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
