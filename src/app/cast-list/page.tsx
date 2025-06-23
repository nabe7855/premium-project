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
      <h1 className="text-2xl font-bold mb-4">キャスト一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {casts.map((cast) => {
          // ✅ 最初の画像のURLを取得（formats.large優先 → 通常のurl）
          const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL ?? '';
          const image = cast.Image[0];
          const imageUrl =
            image?.formats?.large?.url
              ? baseUrl + image.formats.large.url
              : image?.url
              ? baseUrl + image.url
              : '';

          return (
            <CastCard
              key={cast.id}
              customID={cast.customID}
              name={cast.name}
              catchCopy={cast.catchCopy ?? ''}
              age={cast.age ?? null}
              height={cast.height ?? null}
              weight={cast.weight ?? null}
              type=""
              imageUrl={imageUrl}
              reviewCount={0}
              sns={{ line: '', twitter: '', instagram: '' }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CastListPage;
