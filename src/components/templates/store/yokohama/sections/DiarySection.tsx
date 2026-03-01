import { DiaryConfig } from '@/lib/store/storeTopConfig';
import { supabase } from '@/lib/supabaseClient';
import NextImage from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import SectionTitle from '../components/SectionTitle';

interface DiarySectionProps {
  config?: DiaryConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
  storeSlug?: string;
}

interface DisplayDiary {
  id: string;
  castName: string;
  title: string;
  image: string;
  date: string;
}

const DiarySection: React.FC<DiarySectionProps> = ({
  config,
  isEditing,
  storeSlug = 'yokohama',
}) => {
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
            return memberships.some((m: any) => m.stores?.slug === storeSlug);
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
  }, [storeSlug, config?.items]);

  if (!config || !config.isVisible) return null;

  return (
    <section id="diary" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle en="Cast Diary" ja="セラピスト日記" />
        {isEditing && (
          <div className="border-primary-200 bg-primary-50 text-primary-600 mb-4 rounded border p-2 text-center text-xs">
            ※ 日記セクションの設定は管理者設定からのみ可能です
          </div>
        )}

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-8 scrollbar-hide md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:px-0">
          {diaries.map((item) => (
            <Link
              key={item.id}
              href={`/store/${storeSlug}/diary/post/${item.id}`}
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
            href={`/store/${storeSlug}/diary/diary-list`}
            className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95 sm:px-10"
          >
            <span>Show All Diary</span>
            <span className="text-[10px] opacity-70"> / 写メ日記一覧</span>
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DiarySection;
