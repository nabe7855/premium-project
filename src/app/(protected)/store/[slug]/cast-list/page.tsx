import { Metadata } from 'next';
import Hero from '@/components/sections/casts/ui/Hero';
import Footer from '@/components/sections/casts/ui/Footer';
import CastList from '@/components/sections/casts/casts/CastList';
import DiagnosisSection from '@/components/sections/casts/casts/DiagnosisSection';
import { getRandomTodayCast } from '@/lib/getRandomTodayCast'; // ✅ DBからランダムキャスト取得

interface Props {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// ✅ ページごとのSEO情報を生成
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = params;
  const search = searchParams.search as string;
  const tags = searchParams.tags as string;
  const mbti = searchParams.mbti as string;

  let title = `${slug} - キャスト一覧`;
  let description = `${slug}の魅力的なキャストをご紹介。`;

  if (search) title += ` - "${search}"`;
  if (mbti) title += ` - ${mbti}タイプ`;
  if (tags) title += ` - ${tags.split(',').slice(0, 2).join('・')}`;

  return {
    title: `${title} | Strawberry Boys`,
    description,
  };
}

// ✅ ページ本体
export default async function CastListPage({ params }: Props) {
  // 本日出勤キャストをランダムに1人取得
  const randomCast = await getRandomTodayCast(params.slug);

  return (
    <>
      {/* ✅ Heroセクションにキャストを渡す */}
      <Hero cast={randomCast} /> 
      
      <div className="bg-gradient-to-br from-secondary via-white to-neutral-100 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 font-serif text-2xl font-bold text-neutral-800 sm:text-3xl md:text-4xl">
            {params.slug} - キャスト一覧
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600">
            心とろける極上のひとときを、あなたに。
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DiagnosisSection />
      </div>

      {/* ✅ 店舗のキャスト一覧 */}
      <CastList storeSlug={params.slug} />

      {/* ✅ フッター */}
      <Footer /> 
    </>
  );
}
