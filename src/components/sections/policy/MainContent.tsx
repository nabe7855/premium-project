'use client';

import React from 'react';
import { Book, Mail, Lock, UserMinus, Trash2 } from 'lucide-react';

export const MainContent: React.FC = () => {
  const sections = [
    {
      icon: <Book className="text-red-600" size={20} />,
      title: '基本方針',
      content:
        '当店は、お客様のプライバシーおよび個人情報の保護にあたり、適用される法令およびその他の規範を遵守いたします。',
    },
    {
      icon: <Mail className="text-red-600" size={20} />,
      title: '個人情報の収集と利用目的',
      content:
        '当店は、お客様からのお問い合わせ時に、お名前、メールアドレス、電話番号などの個人情報をご登録いただく場合がございますが、これらの情報はご提供いただいた目的以外には使用いたしません。お客様からお預かりした個人情報は、当店からのご連絡、業務のご案内、ご質問への回答などに利用いたします。',
    },
    {
      icon: <Lock className="text-red-600" size={20} />,
      title: 'セキュリティ管理体制',
      content:
        '当店は、その管理下にある個人情報の紛失、誤用、改変を防止するため、厳重なセキュリティ対策を実施しています。個人情報は、一般の利用者がアクセスできない安全な環境下に保管され、SSL暗号化通信により送受信時の安全性も確保されています。',
    },
    {
      icon: <UserMinus className="text-red-600" size={20} />,
      title: '第三者への情報開示について',
      content:
        '当店は、次の場合を除き、お客様の同意なしに、委託先以外の第三者に個人情報を開示・提供することはありません：（1）法律の定めまたは法的手続きにより開示が必要な場合、（2）お客様の生命・身体または財産の保護に必要な場合。',
    },
    {
      icon: <Trash2 className="text-red-600" size={20} />,
      title: '個人情報の保管・削除について',
      content:
        '個人情報は、利用目的の達成に必要な期間のみ保管し、不要になった場合は速やかに削除いたします。退会手続き完了後は、法令等で定められた保管期間を除き、お客様の個人データは速やかに削除いたします。',
    },
  ];

  return (
    <section className="bg-white px-4 py-8">
      <div className="mx-auto max-w-sm sm:max-w-2xl lg:max-w-4xl">
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} rounded-lg p-4`}
            >
              <div className="mb-3 flex items-start">
                <div className="mr-3 mt-1 flex-shrink-0">{section.icon}</div>
                <h3 className="font-sans text-lg font-bold leading-tight text-gray-800 sm:text-xl">
                  {section.title}
                </h3>
              </div>
              <div className="ml-8">
                <p className="font-serif text-sm leading-relaxed text-gray-700 sm:text-base">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
