import { getAllCasts } from '@/lib/getAllCasts';
import { Cast } from '@/types/cast';
import CastCard from '@/components/cards/CastCard';

const CastListPage = async () => {
  const casts: Cast[] = await getAllCasts();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">キャスト一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {casts.map((cast) => (
          <CastCard
            key={cast.id}
            customID={cast.customID}
            name={cast.name}
            catchCopy={cast.catchCopy || ''}
            age={cast.age || null}
            height={cast.height || null}
            weight={cast.weight || null}
            type=""
            imageUrl={
              cast.Image && cast.Image[0]?.url
                ? process.env.NEXT_PUBLIC_STRAPI_API_URL + cast.Image[0].url
                : ''
            }
            reviewCount={0}
            sns={{ line: '', twitter: '', instagram: '' }}
          />
        ))}
      </div>
    </div>
  );
};

export default CastListPage;
