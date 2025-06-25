// src/app/store/[slug]/cast-list/page.tsx

import { getCastsByStoreSlug } from '@/lib/getCastsByStoreSlug';
import { Cast } from '@/types/cast';
import CastCard from '@/components/cards/CastCard';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

export async function generateStaticParams() {
  return [
    { store: 'tokyo' },
    { store: 'osaka' },
    { store: 'nagoya' },
  ];
}

interface StoreCastListPageProps {
  params: {
    store: string;
  };
}

// ✅ 同期関数
const StoreCastListPage = ({ params }: StoreCastListPageProps) => {
  return <PageContent store={params.store} />;
};

// ✅ 非同期処理
const PageContent = async ({ store }: { store: string }) => {
  let casts: Cast[] = [];

  try {
    casts = await getCastsByStoreSlug(store);
  } catch (error) {
    console.error('キャスト取得エラー:', error);
    return notFound();
  }

  // ✅ stillwork === true のキャストのみ抽出
  const activeCasts = casts.filter((cast) => cast.stillwork === true);

  if (activeCasts.length === 0) {
    return <div className="p-4 text-gray-500">この店舗には現在キャストがいません。</div>;
  }

  const sortedCasts = [...activeCasts].sort((a, b) => {
    if (a.isReception && !b.isReception) return 1;
    if (!a.isReception && b.isReception) return -1;
    return 0;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-pink-700">
        🍓 {store} 店キャスト一覧
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
        {sortedCasts.map((cast) => (
          <CastCard
            key={cast.id}
            slug={cast.slug}
            storeSlug={store}
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
