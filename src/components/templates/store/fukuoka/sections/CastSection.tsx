import { Camera, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import SectionTitle from '../components/SectionTitle';

import { CastConfig } from '@/lib/store/storeTopConfig';

const defaultCastList: any[] = [
  {
    id: 1,
    name: '蓮 (レン)',
    age: 26,
    height: 178,
    comment: '優しく包み込みます',
    status: '本日出勤',
    tags: ['聞き上手', '高身長'],
    imageUrl: 'https://picsum.photos/seed/cast1/300/400',
  },
  {
    id: 2,
    name: 'ハルト',
    age: 24,
    height: 175,
    comment: '笑顔で癒やします',
    status: '本日出勤',
    tags: ['爽やか', 'マッサージ◎'],
    imageUrl: 'https://picsum.photos/seed/cast2/300/400',
  },
  {
    id: 3,
    name: 'ユウキ',
    age: 28,
    height: 182,
    comment: '大人の癒しを',
    status: '',
    tags: ['落ち着き', '色気'],
    imageUrl: 'https://picsum.photos/seed/cast3/300/400',
  },
  {
    id: 4,
    name: 'ソラ',
    age: 22,
    height: 174,
    comment: '弟キャラです',
    status: '残りわずか',
    tags: ['癒し系', '甘え上手'],
    imageUrl: 'https://picsum.photos/seed/cast4/300/400',
  },
];

interface CastSectionProps {
  config?: CastConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const CastSection: React.FC<CastSectionProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const castList = config?.items || defaultCastList;

  const handleItemUpdate = (index: number, key: string, value: any) => {
    if (onUpdate) {
      const newItems = [...castList];
      if (key === 'age' || key === 'height') {
        newItems[index] = {
          ...newItems[index],
          [key]: parseInt(value.replace(/[^0-9]/g, '')) || 0,
        };
      } else if (key === 'tags') {
        newItems[index] = {
          ...newItems[index],
          [key]: value
            .split(',')
            .map((t: string) => t.trim())
            .filter((t: string) => t),
        };
      } else {
        newItems[index] = { ...newItems[index], [key]: value };
      }
      onUpdate('cast', 'items', newItems);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload('cast', file, index, 'imageUrl');
    }
  };

  const addItem = () => {
    if (onUpdate) {
      const newId = castList.length > 0 ? Math.max(...castList.map((i: any) => i.id)) + 1 : 1;
      const newItem = {
        id: newId,
        name: 'New Cast',
        age: 20,
        height: 170,
        comment: '一言コメント',
        status: '',
        tags: ['New'],
        imageUrl: defaultCastList[0].imageUrl,
      };
      onUpdate('cast', 'items', [...castList, newItem]);
    }
  };

  const removeItem = (index: number) => {
    if (onUpdate) {
      const newItems = castList.filter((_: any, i: number) => i !== index);
      onUpdate('cast', 'items', newItems);
    }
  };

  return (
    <section id="cast" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          en={config?.subHeading || 'Therapists'}
          ja={config?.heading || '本日出勤のセラピスト'}
        />

        <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 md:mx-0 md:grid md:grid-cols-4 md:gap-8 md:px-0">
          {castList.map((cast: any, idx: number) => (
            <div
              key={cast.id}
              className="group relative flex min-w-[280px] snap-center flex-col overflow-hidden rounded-[2rem] border border-neutral-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl md:min-w-0"
            >
              {isEditing && (
                <button
                  onClick={() => removeItem(idx)}
                  className="absolute right-4 top-4 z-50 rounded-full bg-red-500 p-2 text-white shadow-lg transition-transform hover:scale-110"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={cast.imageUrl}
                  alt={cast.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>

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

                <div className="absolute bottom-6 left-6 text-left text-white">
                  <p className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest opacity-80">
                    <span
                      contentEditable={isEditing}
                      suppressContentEditableWarning={isEditing}
                      onBlur={(e) => handleItemUpdate(idx, 'height', e.currentTarget.innerText)}
                      className={`outline-none ${isEditing ? 'rounded px-1 hover:bg-white/20' : ''}`}
                    >
                      {cast.height}
                    </span>
                    <span>cm / </span>
                    <span
                      contentEditable={isEditing}
                      suppressContentEditableWarning={isEditing}
                      onBlur={(e) => handleItemUpdate(idx, 'age', e.currentTarget.innerText)}
                      className={`outline-none ${isEditing ? 'rounded px-1 hover:bg-white/20' : ''}`}
                    >
                      {cast.age}
                    </span>
                    <span>age</span>
                  </p>
                  <h3
                    contentEditable={isEditing}
                    suppressContentEditableWarning={isEditing}
                    onBlur={(e) => handleItemUpdate(idx, 'name', e.currentTarget.innerText)}
                    className={`font-serif text-2xl font-bold tracking-widest outline-none ${isEditing ? 'rounded px-1 hover:bg-white/20' : ''}`}
                  >
                    {cast.name}
                  </h3>
                </div>
              </div>
              <div className="flex flex-grow flex-col p-6 text-left">
                <div className="mb-4 flex flex-wrap gap-2">
                  {isEditing ? (
                    <div className="w-full">
                      <p className="mb-1 text-[10px] text-slate-400">タグ (カンマ区切り)</p>
                      <span
                        contentEditable={isEditing}
                        suppressContentEditableWarning={isEditing}
                        onBlur={(e) => handleItemUpdate(idx, 'tags', e.currentTarget.innerText)}
                        className="block w-full rounded-md border border-neutral-100 bg-neutral-50 px-2 py-1 text-[9px] font-bold tracking-wider text-slate-500 outline-none hover:bg-white"
                      >
                        {cast.tags?.join(', ')}
                      </span>
                    </div>
                  ) : (
                    cast.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-md border border-pink-100/50 bg-pink-50 px-2 py-1 text-[9px] font-bold tracking-wider text-pink-400"
                      >
                        #{tag}
                      </span>
                    ))
                  )}
                </div>
                <p
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => handleItemUpdate(idx, 'comment', e.currentTarget.innerText)}
                  className={`mb-6 flex-grow text-xs italic leading-relaxed text-slate-500 outline-none ${isEditing ? 'min-h-[1.5em] rounded px-1 hover:bg-neutral-50' : ''}`}
                >
                  "{cast.comment}"
                </p>
                {!isEditing && (
                  <button className="hover:bg-primary-500 hover:border-primary-500 w-full rounded-2xl border border-neutral-100 bg-neutral-50 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 transition-all hover:text-white">
                    Profile Detail
                  </button>
                )}
              </div>
            </div>
          ))}

          {isEditing && (
            <button
              onClick={addItem}
              className="border-primary-200 text-primary-300 hover:text-primary-500 hover:border-primary-400 flex min-h-[400px] flex-col items-center justify-center rounded-[2.rem] border-2 border-dashed bg-white/50 p-8 transition-all"
            >
              <Plus size={40} className="mb-2" />
              <span className="text-xs font-bold">セラピストを追加</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CastSection;
