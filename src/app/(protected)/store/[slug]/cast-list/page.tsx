import CastList from '@/components/sections/casts/casts/CastList';
import DiagnosisSection from '@/components/sections/casts/casts/DiagnosisSection';
import BrandHero from '@/components/sections/casts/ui/BrandHero'; // ✅ 追加
import Footer from '@/components/sections/casts/ui/Footer';
import Hero from '@/components/sections/casts/ui/Hero';
import { getRandomTodayCast } from '@/lib/getRandomTodayCast';
import { Metadata } from 'next';

import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { notFound } from 'next/navigation';

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
  const store = getStoreData(params.slug);
  if (!store) {
    notFound();
  }

  // 店舗トップ設定を取得
  const topConfigResult = await getStoreTopConfig(params.slug);
  const topConfig = topConfigResult.success
    ? (topConfigResult.config as StoreTopPageConfig)
    : DEFAULT_STORE_TOP_CONFIG;

  // 本日出勤キャストをランダムに1人取得
  const randomCast = await getRandomTodayCast(params.slug);

  const shopName = topConfig?.footer?.shopInfo?.name || store.name;

  return (
    <>
      {store.template === 'fukuoka' ? (
        <FukuokaHeader config={topConfig.header} />
      ) : store.template === 'yokohama' ? (
        <YokohamaHeader config={topConfig.header} />
      ) : null}

      {/* ゴージャスなブランドHero */}
      <BrandHero />

      {/* ✅ 本日のおすすめキャスト */}
      <Hero cast={randomCast} />

      {/* セクション：見出し */}
      <div className="bg-gradient-to-br from-secondary/20 via-white to-neutral-100 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-neutral-800 sm:text-3xl md:text-4xl">
            {shopName} - キャスト一覧
          </h2>
          <p className="mx-auto max-w-2xl text-base text-neutral-600 sm:text-lg">
            心とろける極上のひとときを、あなたに。
          </p>
        </div>
      </div>

      {/* 相性診断セクション */}
      <div id="diagnosis" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DiagnosisSection />
      </div>

      {/* ✅ 店舗のキャスト一覧 */}
      <div id="casts">
        <CastList storeSlug={params.slug} />
      </div>

      {/* フッター */}
      {store.template === 'fukuoka' ? (
        <FukuokaFooter config={topConfig.footer} />
      ) : store.template === 'yokohama' ? (
        <YokohamaFooter config={topConfig.footer} />
      ) : (
        <Footer />
      )}
    </>
  );
}
