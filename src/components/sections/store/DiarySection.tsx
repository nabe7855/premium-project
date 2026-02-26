'use client';

import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DisplayDiary {
  id: string;
  castName: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}

export default function DiarySection() {
  const { store } = useStore();
  const params = useParams();
  const storeSlug = (params?.slug as string) || store.slug;
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
            content,
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

        // 当前店铺的过滤
        const filtered = data
          ?.filter((blog: any) => {
            const memberships = blog.casts?.cast_store_memberships || [];
            return memberships.some((m: any) => m.stores?.slug === storeSlug);
          })
          .slice(0, 3)
          .map((blog: any) => ({
            id: blog.id,
            castName: blog.casts?.name || '不明なキャスト',
            title: blog.title,
            excerpt: blog.content ? blog.content.slice(0, 60) + '...' : '',
            image:
              blog.blog_images?.[0]?.image_url ||
              'https://via.placeholder.com/400x300?text=No+Image',
            date: new Date(blog.created_at).toLocaleDateString('ja-JP'),
          }));

        if (filtered && filtered.length > 0) {
          setDiaries(filtered);
        } else {
          // Fallback to static data if no DB entries
          setDiaries(store.diaries.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching diaries:', err);
        setDiaries(store.diaries.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiaries();
  }, [storeSlug, store.diaries]);

  // 静的データがなく、DBにもデータがない場合は非表示（ただし fallback があるので基本表示される）
  if (!isLoading && diaries.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">写メ日記</h2>
          <p className="text-lg text-gray-600">キャストたちの日常をちょっとのぞき見</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {diaries.map((diary) => (
            <div
              key={diary.id}
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative">
                <img src={diary.image} alt={diary.title} className="h-48 w-full object-cover" />
                <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
                  {diary.castName}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{diary.date}</span>
                </div>

                <h3 className="mb-3 line-clamp-2 text-lg font-bold">{diary.title}</h3>

                <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">{diary.excerpt}</p>

                <Link href={`/store/${storeSlug}/diary/post/${diary.id}`}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-between text-${store.theme.primary} hover:bg-${store.theme.primaryLight}/20`}
                  >
                    続きを読む
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href={`/store/${storeSlug}/diary/diary-list`}>
            <Button
              className={`bg-gradient-to-r ${store.theme.gradient} hover:${store.theme.gradientHover} rounded-full px-8 py-3 text-lg font-semibold text-white`}
            >
              写メ日記をもっと見る
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
