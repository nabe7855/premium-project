import { EditableImage } from '@/components/admin/EditableImage';
import { ForbiddenConfig, ForbiddenItem } from '@/lib/store/firstTimeConfig';
import { 
  AlertCircle, Ban, Beer, ShieldAlert, UserMinus, 
  Skull, Zap, Hand, MicOff, CameraOff, 
  Smartphone, HeartOff, Flame, Trash2, XCircle, 
  Lock, Shield, Info, HelpCircle, AlertTriangle,
  ArrowUp, ArrowDown, Plus, X
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

const iconMap: any = {
  Ban,
  AlertCircle,
  UserMinus,
  Beer,
  ShieldAlert,
  Skull,
  Zap,
  Hand,
  MicOff,
  CameraOff,
  Smartphone,
  HeartOff,
  Flame,
  Trash2,
  XCircle,
  Lock,
  Shield,
  Info,
  HelpCircle,
  AlertTriangle,
};

const iconList = Object.keys(iconMap);

interface IconSelectorProps {
  currentIcon: string;
  onSelect: (iconName: string) => void;
  onClose: () => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ currentIcon, onSelect, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-64 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
      <div className="mb-3 flex items-center justify-between border-b pb-2">
        <span className="text-sm font-bold text-gray-700">アイコンを選択</span>
        <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      <div 
        ref={scrollRef}
        className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1"
      >
        {iconList.map((iconName) => {
          const Icon = iconMap[iconName];
          return (
            <button
              key={iconName}
              onClick={() => onSelect(iconName)}
              className={`flex aspect-square items-center justify-center rounded-xl transition-all ${
                currentIcon === iconName 
                  ? 'bg-red-100 text-[#FF4B5C] ring-2 ring-[#FF4B5C]' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`}
            >
              <Icon className="h-6 w-6" />
            </button>
          );
        })}
      </div>
    </div>
  );
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
  const [activeIconSelector, setActiveIconSelector] = useState<number | null>(null);

  // config が undefined の場合でも mergeConfig によってデフォルトが渡されるため、
  // ここでの個別の Fallback は不要です。
  const data = config;
  if (!data) return null;

  const handleTextUpdate = (key: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      onUpdate('forbidden', key, e.currentTarget.innerText);
    }
  };

  const handleItemsUpdate = (newItems: ForbiddenItem[]) => {
    if (onUpdate) {
      onUpdate('forbidden', 'items', newItems);
    }
  };

  const handleItemValueUpdate = (index: number, key: string, value: string) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [key]: value };
    handleItemsUpdate(newItems);
  };

  const handleAddItem = () => {
    const newItem: ForbiddenItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: '新しい禁止事項',
      description: '説明文を入力してください',
      icon: 'Ban'
    };
    handleItemsUpdate([...data.items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index);
    handleItemsUpdate(newItems);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === data.items.length - 1)) return;
    const newItems = [...data.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    handleItemsUpdate(newItems);
  };

  if (data.isVisible === false && !isEditing) return null;

  return (
    <section id="forbidden" className={`bg-gray-50 py-16 md:py-24 ${!data.isVisible ? 'opacity-50' : ''}`}>
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
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <>
              <h2
                contentEditable={isEditing}
                onBlur={(e) => handleTextUpdate('heading', e)}
                suppressContentEditableWarning
                className="mb-2 text-3xl font-black text-gray-900 md:text-4xl outline-none focus:ring-2 focus:ring-pink-200 rounded"
              >
                {data.heading}
              </h2>
              <p
                contentEditable={isEditing}
                onBlur={(e) => handleTextUpdate('subHeading', e)}
                suppressContentEditableWarning
                className="text-sm font-bold tracking-widest text-[#FF4B5C] outline-none focus:ring-2 focus:ring-pink-200 rounded"
              >
                {data.subHeading}
              </p>
              {isEditing && (
                <button
                  onClick={() => {}} // This is handled by input onChange below
                  className="mt-4 relative inline-flex cursor-pointer items-center gap-2 rounded-md bg-stone-100 px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-stone-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  画像ヘッダーを使用する
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onImageUpload?.('forbidden', file);
                    }}
                  />
                </button>
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
                className="group relative flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-lg md:flex-row md:p-8"
              >
                {/* 項目操作ボタン（編集モードのみ） */}
                {isEditing && (
                  <div className="absolute -left-12 top-1/2 flex -translate-y-1/2 flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100 md:opacity-40">
                    <button
                      onClick={() => handleMoveItem(index, 'up')}
                      disabled={index === 0}
                      className="rounded-full bg-white p-1 shadow hover:bg-gray-50 disabled:opacity-30"
                    >
                      <ArrowUp className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="rounded-full bg-white p-1 shadow hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMoveItem(index, 'down')}
                      disabled={index === data.items.length - 1}
                      className="rounded-full bg-white p-1 shadow hover:bg-gray-50 disabled:opacity-30"
                    >
                      <ArrowDown className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                )}

                {/* アイコン（タップで編集） */}
                <div className="relative">
                  <div 
                    onClick={() => isEditing && setActiveIconSelector(index)}
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#FF4B5C] transition-all ${isEditing ? 'cursor-pointer hover:bg-red-100 hover:scale-105 active:scale-95 shadow-sm' : ''}`}
                  >
                    <IconComponent className="h-8 w-8" />
                    {isEditing && (
                      <div className="absolute -right-1 -top-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5">
                        <Plus className="h-2 w-2 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* アイコンセレクターポップオーバー */}
                  {isEditing && activeIconSelector === index && (
                    <IconSelector 
                      currentIcon={item.icon}
                      onSelect={(iconName) => {
                        handleItemValueUpdate(index, 'icon', iconName);
                        setActiveIconSelector(null);
                      }}
                      onClose={() => setActiveIconSelector(null)}
                    />
                  )}
                </div>

                <div className="text-center md:text-left flex-1 min-w-0">
                  <h3
                    contentEditable={isEditing}
                    onBlur={(e) => handleItemValueUpdate(index, 'title', e.currentTarget.innerText)}
                    suppressContentEditableWarning
                    className="mb-2 text-xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-pink-200 rounded px-1"
                  >
                    {item.title}
                  </h3>
                  <p
                    contentEditable={isEditing}
                    onBlur={(e) => handleItemValueUpdate(index, 'description', e.currentTarget.innerText)}
                    suppressContentEditableWarning
                    className="leading-relaxed text-gray-600 whitespace-pre-wrap outline-none focus:ring-2 focus:ring-pink-200 rounded px-1"
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* 項目追加ボタン（編集モードのみ） */}
          {isEditing && (
            <button
              onClick={handleAddItem}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-6 transition-all hover:border-pink-300 hover:bg-pink-50/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-110">
                <Plus className="h-6 w-6 text-pink-500" />
              </div>
              <span className="text-sm font-bold text-gray-500 group-hover:text-pink-600">新しい項目を追加する</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
