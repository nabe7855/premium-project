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
  onUpdate: _onUpdate,
  onImageUpload: _onImageUpload,
}) => {
  const castList = config?.items || defaultCastList;

  return (
    <section id="cast" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          en={config?.subHeading || 'Therapists'}
          ja={config?.heading || '本日出勤のセラピスト'}
        />

        <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 md:mx-0 md:grid md:grid-cols-4 md:gap-8 md:px-0">
          {castList.map((cast: any) => (
            <div
              key={cast.id}
              className="group relative flex min-w-[280px] snap-center flex-col overflow-hidden rounded-[2rem] border border-neutral-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl md:min-w-0"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={cast.imageUrl}
                  alt={cast.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>

                <div className="absolute bottom-6 left-6 text-left text-white">
                  <p className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest opacity-80">
                    <span className="outline-none">{cast.height}</span>
                    <span>cm / </span>
                    <span className="outline-none">{cast.age}</span>
                    <span>age</span>
                  </p>
                  <h3 className="font-serif text-2xl font-bold tracking-widest outline-none">
                    {cast.name}
                  </h3>
                </div>
              </div>
              <div className="flex flex-grow flex-col p-6 text-left">
                <div className="mb-4 flex flex-wrap gap-2">
                  {cast.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-md border border-pink-100/50 bg-pink-50 px-2 py-1 text-[9px] font-bold tracking-wider text-pink-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="mb-6 flex-grow text-xs italic leading-relaxed text-slate-500 outline-none">
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
        </div>
      </div>
    </section>
  );
};

export default CastSection;
