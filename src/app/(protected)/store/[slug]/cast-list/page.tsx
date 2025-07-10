import { Metadata } from 'next';
import CastList from '@/components/sections/casts/casts/CastList';
import Footer from '@/components/sections/casts/ui/Footer';
import DiagnosisSection from '@/components/sections/casts/casts/DiagnosisSection';

interface Props {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

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

export default function CastListPage({ params }: Props) {
  return (
    <>
      <div className="from-secondary bg-gradient-to-br via-white to-neutral-100 py-8 sm:py-12">
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
      <CastList storeSlug={params.slug} />
      <Footer />
    </>
  );
}
