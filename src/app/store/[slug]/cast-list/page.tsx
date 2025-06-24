// src/app/store/[slug]/cast-list/page.tsx

import { getCastsByStoreSlug } from '@/lib/getCastsByStoreSlug';
import { Cast } from '@/types/cast';
import CastCard from '@/components/cards/CastCard';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

export async function generateStaticParams() {
  return [
    { slug: 'tokyo' },
    { slug: 'osaka' },
    { slug: 'nagoya' },
  ];
}

interface StoreCastListPageProps {
  params: {
    slug: string;
  };
}

// ✅ ここは同期関数
const StoreCastListPage = ({ params }: StoreCastListPageProps) => {
  return <PageContent slug={params.slug} />;
};

// ✅ ここで非同期処理
const PageContent = async ({ slug }: { slug: string }) => {
  let casts: Cast[] = [];

  try {
    casts = await getCastsByStoreSlug(slug);
  } catch (error) {
    console.error('キャスト取得エラー:', error);
    return notFound();
  }

  if (!casts || casts.length === 0) {
    return <div className="p-4 text-gray-500">この店舗には現在キャストがいません。</div>;
  }

  const sortedCasts = [...casts].sort((a, b) => {
    if (a.isReception && !b.isReception) return 1;
    if (!a.isReception && b.isReception) return -1;
    return 0;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-pink-700">
        🍓 {slug} 店キャスト一覧
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
        {sortedCasts.map((cast) => (
          <CastCard
            key={cast.id}
            slug={cast.slug}
            storeSlug={slug}
            name={cast.name}
            catchCopy={cast.catchCopy}
            age={cast.age}
            height={cast.height}
            weight={cast.weight}
            imageUrl={cast.imageUrl ?? '/no-image.png'}
            isNew={cast.isNew}
            isReception={cast.isReception ?? false}
          />
        ))}
      </div>
    </div>
  );
};

export default StoreCastListPage;
