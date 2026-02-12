import { Ban, ImageOff, ShieldAlert, UserMinus } from 'lucide-react';
import React from 'react';

export const ForbiddenItems: React.FC = () => {
  const items = [
    {
      title: '写真・動画撮影の禁止',
      desc: 'キャストのプライバシー保護のため、無断での写真撮影や動画撮影、録音行為は固くお断りしております。',
      icon: <ImageOff className="h-6 w-6" />,
    },
    {
      title: '過度な身体的負担',
      desc: 'キャストが苦痛を感じる行為や、怪我を負わせる可能性のある行為、公序良俗に反する行為は禁止です。',
      icon: <Ban className="h-6 w-6" />,
    },
    {
      title: '個人情報の交換禁止',
      desc: 'キャストと直接の連絡先（LINE、電話番号等）を交換すること、およびSNSでの接触は禁止事項となります。',
      icon: <UserMinus className="h-6 w-6" />,
    },
    {
      title: '薬物・アルコールの強要',
      desc: '違法薬物の使用や、キャストへの過度な飲酒の強要は即時サービス停止の対象となります。',
      icon: <ShieldAlert className="h-6 w-6" />,
    },
  ];

  return (
    <section id="forbidden" className="bg-stone-50 py-20">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-black text-gray-800 md:text-4xl">
            安心・安全のための<span className="text-[#FF4B5C]">禁止事項</span>
          </h2>
          <p className="font-medium text-gray-500">
            皆様に気持ちよくご利用いただくため、以下の行為はご遠慮いただいております。
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="group flex gap-4 rounded-3xl border border-stone-100 bg-white p-6 shadow-sm transition-all hover:shadow-md md:p-8"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#FF4B5C] transition-colors group-hover:bg-[#FF4B5C] group-hover:text-white">
                {item.icon}
              </div>
              <div>
                <h3 className="mb-2 font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
