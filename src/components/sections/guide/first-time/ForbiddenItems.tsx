import { EditableImage } from '@/components/admin/EditableImage';
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
  onImageUpload?: (section: string, file: File) => void;
}

export const ForbiddenItems: React.FC<ForbiddenItemsProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
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
          {data.imageUrl ? (
            <div className="relative mx-auto mb-4 max-w-2xl">
              <EditableImage
                isEditing={isEditing}
                src={data.imageUrl}
                alt="Forbidden Items"
                onUpload={(file) => onImageUpload?.('forbidden', file)}
                className="h-auto w-full object-contain"
              />
              {isEditing && (
                <button
                  onClick={() => onUpdate?.('forbidden', 'imageUrl', '')}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <>
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
              {isEditing && (
                <div className="mt-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-stone-100 px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-stone-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    画像ヘッダーを使用する
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onImageUpload?.('forbidden', file);
                      }}
                    />
                  </label>
                </div>
              )}
            </>
          )}
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
