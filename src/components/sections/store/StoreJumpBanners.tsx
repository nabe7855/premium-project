'use client';

import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { supabase } from '@/lib/supabaseClient';

interface StoreInfo {
  slug: string;
  name: string;
  use_external_url: boolean;
  external_url: string | null;
}

interface StoreJumpBannersProps {
  currentStoreSlug?: string;
}

function BannerItem({ store }: { store: StoreInfo }) {
  const [imgError, setImgError] = useState(false);
  
  const linkHref = store.use_external_url && store.external_url 
    ? store.external_url 
    : `/store/${store.slug}`;

  // 画像が存在しない場合は安全策として非表示にする
  if (imgError) {
    return null; 
  }

  return (
    <a 
      href={linkHref}
      className="group relative block w-full overflow-hidden rounded-xl shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
      aria-label={`${store.name}店のページへ`}
    >
      <div className="relative aspect-[3/1] w-full bg-slate-50">
        <NextImage
          src={`/images/banners/store-jumps/${store.slug}.png`}
          alt={`${store.name}店バナー`}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
          sizes="(max-width: 640px) 50vw, 50vw"
          onError={() => setImgError(true)}
        />
      </div>
    </a>
  );
}

export default function StoreJumpBanners({ currentStoreSlug }: StoreJumpBannersProps) {
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStores() {
      try {
        const { data, error } = await supabase
          .from('stores')
          .select('slug, name, use_external_url, external_url')
          .eq('is_active', true);
        
        if (error) {
          console.error('Error fetching stores for jump banners:', error);
          return;
        }

        if (data) {
          // 現在閲覧中の店舗と、slugが空の無効な店舗を除外
          const otherStores = data.filter(store => store.slug !== currentStoreSlug && store.slug !== '');
          setStores(otherStores);
        }
      } catch (err) {
        console.error('Failed to load store banners:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStores();
  }, [currentStoreSlug]);

  if (isLoading || stores.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-transparent px-4 py-6 md:py-8">
      <div className="mx-auto max-w-[1000px]">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:gap-6">
          {stores.map((store) => (
            <BannerItem key={store.slug} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
}
