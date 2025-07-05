import { getCastsByStoreSlug } from '@/lib/getCastsByStoreSlug';
import { Cast } from '@/types/cast';
import CastCard from '@/components/cards/CastCard';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

// ✅ ビルド用に正しいキー名（slug）で返す
export async function generateStaticParams() {
  return [{ slug: 'tokyo' }, { slug: 'osaka' }, { slug: 'nagoya' }];
}

interface StoreCastListPageProps {
  params: {
    slug: string; // ✅ 修正済み
  };
}

// ✅ 同期関数：動的ルートパラメータを渡す
const StoreCastListPage = ({ params }: StoreCastListPageProps) => {
  return <PageContent store={params.slug} />;
};

// ✅ 実データ取得ロジック
const PageContent = async ({ store }: { store: string }) => {
  let casts: Cast[] = [];

  try {
    casts = await getCastsByStoreSlug(store);
  } catch (error) {
    console.error('キャスト取得エラー:', error);
    return notFound();
  }

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
      <h1 className="mb-4 text-2xl font-bold text-pink-700">🍓 {store} 店キャスト一覧</h1>
      <div className="grid grid-cols-2 items-stretch gap-4 md:grid-cols-3 lg:grid-cols-4">
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
