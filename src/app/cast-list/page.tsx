import { getAllCasts } from '@/lib/getAllCasts';
import { Cast } from '@/types/cast';
import CastCard from '@/components/cards/CastCard';

const CastListPage = async () => {
  let casts: Cast[] = [];

  try {
    casts = await getAllCasts();
  } catch (error) {
    console.error('キャスト取得エラー:', error);
    return <div>キャスト情報の取得に失敗しました。</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-pink-700">🍓 キャスト一覧</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
        {casts.map((cast) => (
          <CastCard
            key={cast.id}
            customID={cast.customID}
            name={cast.name}
            catchCopy={cast.catchCopy}
            age={cast.age}
            height={cast.height}
            weight={cast.weight}
            imageUrl={cast.imageUrl ?? '/no-image.png'}
            isNew={cast.isNew}
          />
        ))}
      </div>
    </div>
  );
};

export default CastListPage;
