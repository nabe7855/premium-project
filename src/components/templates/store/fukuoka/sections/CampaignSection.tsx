import { Camera, ChevronRight, Gift, Instagram, Plus, Trash2, Zap } from 'lucide-react';
import React from 'react';
import SectionTitle from '../components/SectionTitle';

import { CampaignConfig } from '@/lib/store/storeTopConfig';

const defaultCampaigns: any[] = [
  {
    id: 1,
    title: '初回限定キャンペーン',
    desc: '全コース¥2,000 OFF！初めての方も安心してお試しいただけます。ご予約時にサイトを見たとお伝えください。',
    badge: 'Limited',
    color: 'primary',
    icon: 'Gift',
    imageUrl:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    title: 'SNSフォロー特典',
    desc: '公式Instagramをフォロー＆DMで指名料が1回無料に。最新の出勤情報や限定動画も配信中です。',
    badge: 'Campaign',
    color: 'secondary',
    icon: 'Instagram',
    imageUrl:
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    title: '深夜割スタート',
    desc: '23時以降のご予約で、アロマオイルオプションをサービス中。一日の疲れを極上の香りで癒やしませんか。',
    badge: 'NEW',
    color: 'primary',
    icon: 'Zap',
    imageUrl:
      'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=800',
  },
];

interface CampaignSectionProps {
  config?: CampaignConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const CampaignSection: React.FC<CampaignSectionProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const campaigns = config?.items || defaultCampaigns;

  const handleTextUpdate = (key: string, value: string) => {
    if (onUpdate) {
      onUpdate('campaign', key, value);
    }
  };

  const handleItemUpdate = (index: number, key: string, value: string) => {
    if (onUpdate) {
      const newItems = [...campaigns];
      newItems[index] = { ...newItems[index], [key]: value };
      onUpdate('campaign', 'items', newItems);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload('campaign', file, index, 'imageUrl');
    }
  };

  const addItem = () => {
    if (onUpdate) {
      const newId = campaigns.length > 0 ? Math.max(...campaigns.map((i: any) => i.id)) + 1 : 1;
      const newItem = {
        id: newId,
        title: '新キャンペーン',
        desc: '説明文を入力してください',
        badge: 'NEW',
        color: 'primary',
        icon: 'Gift',
        imageUrl: defaultCampaigns[0].imageUrl,
      };
      onUpdate('campaign', 'items', [...campaigns, newItem]);
    }
  };

  const removeItem = (index: number) => {
    if (onUpdate) {
      const newItems = campaigns.filter((_: any, i: number) => i !== index);
      onUpdate('campaign', 'items', newItems);
    }
  };

  return (
    <section
      id="campaign"
      className="bg-primary-50/50 border-primary-100/50 border-y py-16 transition-all duration-300 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="group/title relative">
          <SectionTitle
            en={config?.subHeading || 'News & Campaigns'}
            ja={config?.heading || '最新情報・キャンペーン'}
          />
          {isEditing && (
            <div className="absolute right-0 top-0 flex gap-2">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleTextUpdate('heading', e.currentTarget.innerText)}
                className="hidden"
              />
              <div className="rounded border bg-white/80 px-2 py-1 text-[10px] text-slate-400">
                表示テキストは直接クリックして編集
              </div>
            </div>
          )}
        </div>

        <div className="scrollbar-hide flex snap-x gap-8 overflow-x-auto px-6 pb-8 md:grid md:grid-cols-3 md:px-0">
          {campaigns.map((camp: any, idx: number) => (
            <div
              key={camp.id}
              className="border-primary-100/20 group relative flex min-w-[300px] snap-center flex-col overflow-hidden rounded-[2.5rem] border bg-white shadow-sm transition-all duration-500 hover:shadow-xl md:min-w-0"
            >
              {isEditing && (
                <button
                  onClick={() => removeItem(idx)}
                  className="absolute right-4 top-4 z-50 rounded-full bg-red-500 p-2 text-white shadow-lg transition-transform hover:scale-110"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="relative h-48 overflow-hidden md:h-56">
                <img
                  src={camp.imageUrl}
                  alt={camp.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute left-4 top-4">
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={isEditing}
                    onBlur={(e) => handleItemUpdate(idx, 'badge', e.currentTarget.innerText)}
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-lg ${camp.color === 'primary' ? 'bg-primary-500 text-white' : 'bg-pink-400 text-white'} ${isEditing ? 'cursor-text outline-none' : ''}`}
                  >
                    {camp.badge}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 rounded-xl bg-white/20 p-2 text-white backdrop-blur-md">
                  {camp.icon === 'Gift' ? (
                    <Gift size={20} />
                  ) : camp.icon === 'Instagram' ? (
                    <Instagram size={20} />
                  ) : (
                    <Zap size={20} />
                  )}
                </div>

                {isEditing && (
                  <label className="absolute inset-0 z-40 flex cursor-pointer flex-col items-center justify-center bg-black/30 text-white opacity-0 transition-opacity hover:opacity-100">
                    <Camera size={40} className="mb-2" />
                    <span className="text-xs font-bold">画像を変更</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, idx)}
                    />
                  </label>
                )}
              </div>

              <div className="flex flex-grow flex-col p-6 text-left md:p-8">
                <h3
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => handleItemUpdate(idx, 'title', e.currentTarget.innerText)}
                  className={`mb-4 font-serif text-lg font-bold leading-snug tracking-wide text-slate-800 md:text-xl ${isEditing ? 'min-h-[1.2rem] rounded px-1 outline-none hover:bg-slate-50' : ''}`}
                >
                  {camp.title}
                </h3>
                <p
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => handleItemUpdate(idx, 'desc', e.currentTarget.innerText)}
                  className={`mb-6 line-clamp-3 flex-grow text-xs leading-relaxed text-slate-500 md:text-sm ${isEditing ? 'rounded px-1 outline-none hover:bg-slate-50' : ''}`}
                >
                  {camp.desc}
                </p>
                {!isEditing && (
                  <div className="flex items-center justify-between border-t border-neutral-50 pt-4">
                    <span className="text-primary-400 group-hover:text-primary-600 text-[10px] font-bold uppercase tracking-widest transition-colors">
                      Read More
                    </span>
                    <div className="bg-primary-50 rounded-full p-2 transition-transform group-hover:translate-x-1">
                      <ChevronRight size={16} className="text-primary-500" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isEditing && (
            <button
              onClick={addItem}
              className="border-primary-200 hover:border-primary-400 group flex min-w-[300px] snap-center flex-col items-center justify-center gap-4 overflow-hidden rounded-[2.5rem] border-2 border-dashed bg-white/50 p-8 transition-all hover:bg-white md:min-w-0"
            >
              <div className="bg-primary-100 text-primary-500 rounded-full p-4 transition-transform group-hover:scale-110">
                <Plus size={32} />
              </div>
              <span className="group-hover:text-primary-600 font-bold text-slate-400">
                キャンペーンを追加
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CampaignSection;
