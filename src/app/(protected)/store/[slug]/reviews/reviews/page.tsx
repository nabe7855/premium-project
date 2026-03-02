'use client';

import FAQ from '@/components/sections/reviews/FAQ';
import ReviewList from '@/components/sections/reviews/ReviewList';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { HeaderConfig } from '@/lib/store/storeTopConfig';
import { useEffect, useState } from 'react';

export default function StoreReviewsPage({ params }: { params: { slug: string } }) {
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig | null>(null);

  useEffect(() => {
    getStoreTopConfig(params.slug).then((res) => {
      if (res.success && res.config?.header) {
        setHeaderConfig(res.config.header);
      }
    });
  }, [params.slug]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {params.slug === 'yokohama' && headerConfig && <YokohamaHeader config={headerConfig} />}
      {params.slug === 'fukuoka' && headerConfig && <FukuokaHeader config={headerConfig} />}

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* ✅ storeSlug を渡して ReviewList に任せる */}
        <ReviewList storeSlug={params.slug} />

        <FAQ />
      </main>

      <footer className="mt-12 bg-gray-800 py-8 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="mb-2">© 2024 ストロベリーボーイズ</p>
          <p className="text-sm text-gray-400">プライバシーポリシー | 利用規約 | お問い合わせ</p>
        </div>
      </footer>
    </div>
  );
}
