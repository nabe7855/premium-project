import { DiaryConfig } from '@/lib/store/storeTopConfig';
import NextImage from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';
import SectionTitle from '../components/SectionTitle';

interface DiarySectionProps {
  config?: DiaryConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const DiarySection: React.FC<DiarySectionProps> = ({ config, isEditing }) => {
  const params = useParams();
  const slug = params?.slug || 'tokyo';

  if (!config || (!config.isVisible && !isEditing)) return null;

  return (
    <section
      id="diary"
      className={`bg-white py-16 md:py-24 ${!config.isVisible && isEditing ? 'opacity-40' : ''}`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle en={config.subHeading} ja={config.heading} />

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-8 scrollbar-hide md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:px-0">
          {config.items.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="group min-w-[240px] snap-center overflow-hidden rounded-2xl bg-neutral-50 transition-all duration-500 hover:shadow-lg md:min-w-0"
            >
              <div className="relative aspect-square overflow-hidden">
                <NextImage
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 240px, 25vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0"></div>
                <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-slate-800 backdrop-blur">
                  {item.castName}
                </div>
              </div>
              <div className="p-4">
                <p className="mb-1 text-[9px] font-medium text-slate-400">{item.date}</p>
                <h3 className="line-clamp-2 text-xs font-bold leading-relaxed text-slate-700">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:mt-12">
          <a
            href={`/store/${slug}/diary`}
            className="inline-flex items-center gap-2 border-b border-red-300 pb-1 text-xs font-bold uppercase tracking-widest text-slate-600 transition-colors hover:border-red-500 hover:text-slate-900"
          >
            Show All Diary
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default DiarySection;
