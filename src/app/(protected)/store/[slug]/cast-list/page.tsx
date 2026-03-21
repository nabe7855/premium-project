import CastList from '@/components/sections/casts/casts/CastList';
import DiagnosisSection from '@/components/sections/casts/casts/DiagnosisSection';
import Hero from '@/components/sections/casts/ui/Hero';
import MatchingBanner from '@/components/sections/casts/ui/MatchingBanner';
import { getTodayCasts } from '@/lib/getRandomTodayCast';
import { Metadata } from 'next';

import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

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

  // 本日出勤キャストを複数取得（カルーセル用）
  const todayCasts = await getTodayCasts(params.slug);

  const shopName = topConfig?.footer?.shopInfo?.name || store.name;

  return (
    <>
      {store.template === 'fukuoka' ? (
        <FukuokaHeader config={topConfig.header} />
      ) : store.template === 'yokohama' ? (
        <YokohamaHeader config={topConfig.header} />
      ) : null}

      {/* ✅ 本日のおすすめキャスト（カルーセル表示） */}
      <Hero casts={todayCasts} />


      {/* 相性診断ページへの誘導バナー */}
      <div id="diagnosis" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <MatchingBanner storeSlug={params.slug} />
      </div>

      {/* ✅ 店舗のキャスト一覧 */}
      <div id="casts">
        <Suspense fallback={<div className="py-16 text-center">読み込み中...</div>}>
          <CastList storeSlug={params.slug} />
        </Suspense>
      </div>

      {/* フッター */}
      {store.template === 'yokohama' ? (
        <YokohamaFooter config={topConfig.footer} />
      ) : (
        <FukuokaFooter config={topConfig.footer} />
      )}
    </>
  );
}
