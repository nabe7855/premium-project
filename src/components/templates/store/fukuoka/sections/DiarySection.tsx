import { DiaryConfig } from '@/lib/store/storeTopConfig';
import { supabase } from '@/lib/supabaseClient';
import NextImage from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import SectionTitle from '../components/SectionTitle';

interface DiarySectionProps {
  config?: DiaryConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

interface DisplayDiary {
  id: string;
  castName: string;
  title: string;
  image: string;
  date: string;
}

const DiarySection: React.FC<DiarySectionProps> = ({ config, isEditing }) => {
  const params = useParams();
  const slug = params?.slug || 'tokyo';
  const [diaries, setDiaries] = useState<DisplayDiary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select(
            `
            id,
            title,
            created_at,
            casts (
              name,
              cast_store_memberships (
                stores ( slug )
              )
            ),
            blog_images (
              image_url
            )
          `,
          )
          .order('created_at', { ascending: false });

        if (error) throw error;

        const filtered = data
          ?.filter((blog: any) => {
            const memberships = blog.casts?.cast_store_memberships || [];
            return memberships.some((m: any) => m.stores?.slug === slug);
          })
          .slice(0, 4)
          .map((blog: any) => ({
            id: blog.id,
            castName: blog.casts?.name || '不明なキャスト',
            title: blog.title,
            image:
              blog.blog_images?.[0]?.image_url ||
              'https://via.placeholder.com/400x300?text=No+Image',
            date: new Date(blog.created_at).toLocaleDateString('ja-JP').replace(/\//g, '.'),
          }));

        if (filtered && filtered.length > 0) {
          setDiaries(filtered);
        } else if (config?.items) {
          setDiaries(config.items.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching diaries:', err);
        if (config?.items) setDiaries(config.items.slice(0, 4));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiaries();
  }, [slug, config?.items]);

  if (!config || (!config.isVisible && !isEditing)) return null;

  return (
    <section
      id="diary"
      className={`bg-white py-16 md:py-24 ${!config.isVisible && isEditing ? 'opacity-40' : ''}`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle en={config.subHeading} ja={config.heading} />

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-8 scrollbar-hide md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:px-0">
          {diaries.map((item) => (
            <Link
              key={item.id}
              href={`/store/${slug}/diary/post/${item.id}`}
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
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:mt-12">
          <Link
            href={`/store/${slug}/diary/diary-list`}
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
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DiarySection;
