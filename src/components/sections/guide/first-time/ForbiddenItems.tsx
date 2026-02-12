import { ForbiddenConfig } from '@/lib/store/firstTimeConfig';
import { AlertCircle, Ban, Beer, ShieldAlert, UserMinus } from 'lucide-react';
import React from 'react';

const iconMap: any = {
  Ban,
  AlertCircle,
  UserMinus,
  Beer,
  ShieldAlert,
};

interface ForbiddenItemsProps {
  config?: ForbiddenConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
}

export const ForbiddenItems: React.FC<ForbiddenItemsProps> = ({ config, isEditing, onUpdate }) => {
  const data = config || {
    heading: '安心・安全のために',
    subHeading: 'FORBIDDEN ITEMS',
    items: [
      {
        id: '1',
        title: '性的サービスの要求',
        description:
          '当店は健全なリラクゼーション・マッサージを提供する店舗です。それ以外の目的でのご利用は固くお断りしております。',
        icon: 'Ban',
      },
      {
        id: '2',
        title: 'セラピストへの嫌がらせ',
        description:
          '言葉や行動によるセクシャルハラスメント、暴力、暴言などは絶対におやめください。',
        icon: 'AlertCircle',
      },
      {
        id: '3',
        title: '店外での接触要求',
        description:
          'セラピストとの店外での接触、個人的な連絡先の交換、SNS等での執拗なコンタクトは禁止しております。',
        icon: 'UserMinus',
      },
      {
        id: '4',
        title: '過度の飲酒状態でのご利用',
        description: '安全のため、泥酔状態でのご利用はお断りさせていただく場合がございます。',
        icon: 'Beer',
      },
      {
        id: '5',
        title: '違法行為・公序良俗に反する行為',
        description:
          'その他、法律に抵触する恐れのある行為や、運営が不適切と判断した場合は即刻中断させていただきます。',
        icon: 'ShieldAlert',
      },
    ],
    isVisible: true,
  };

  const handleTextUpdate = (key: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      onUpdate('forbidden', key, e.currentTarget.innerText);
    }
  };

  const handleItemUpdate = (index: number, key: string, value: string) => {
    if (onUpdate) {
      const newItems = [...data.items];
      newItems[index] = { ...newItems[index], [key]: value };
      onUpdate('forbidden', 'items', newItems);
    }
  };

  if (data.isVisible === false && !isEditing) return null;

  return (
    <section
      id="forbidden"
      className={`bg-gray-50 py-16 md:py-24 ${!data.isVisible ? 'opacity-50' : ''}`}
    >
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2
            contentEditable={isEditing}
            onBlur={(e) => handleTextUpdate('heading', e)}
            suppressContentEditableWarning
            className="mb-2 text-3xl font-black text-gray-900 md:text-4xl"
          >
            {data.heading}
          </h2>
          <p
            contentEditable={isEditing}
            onBlur={(e) => handleTextUpdate('subHeading', e)}
            suppressContentEditableWarning
            className="text-sm font-bold tracking-widest text-[#FF4B5C]"
          >
            {data.subHeading}
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-4">
          {data.items.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Ban;
            return (
              <div
                key={item.id}
                className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg md:flex-row md:p-8"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#FF4B5C]">
                  <IconComponent className="h-8 w-8" />
                </div>
                <div className="text-center md:text-left">
                  <h3
                    contentEditable={isEditing}
                    onBlur={(e) => handleItemUpdate(index, 'title', e.currentTarget.innerText)}
                    suppressContentEditableWarning
                    className="mb-2 text-xl font-bold text-gray-900"
                  >
                    {item.title}
                  </h3>
                  <p
                    contentEditable={isEditing}
                    onBlur={(e) =>
                      handleItemUpdate(index, 'description', e.currentTarget.innerText)
                    }
                    suppressContentEditableWarning
                    className="leading-relaxed text-gray-600"
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
