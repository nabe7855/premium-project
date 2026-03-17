import CastDiaryContent from '@/components/sections/diary/CastDiaryContent';
import Header from '@/components/templates/store/fukuoka/sections/Header';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';

export default async function CastDiaryPage({
  params,
}: {
  params: { slug: string; castName: string };
}) {
  const { slug, castName } = params;
  const result = await getStoreTopConfig(slug);
  const topConfig = result.success ? (result.config as StoreTopPageConfig) : null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-pink-50 to-white">
      {/* Header (Server fetched config ensures it renders immediately) */}
      {topConfig?.header.isVisible && <Header config={topConfig.header} />}

      <div className="flex-grow pt-24 sm:pt-28 md:pt-32">
        <CastDiaryContent slug={slug} castName={castName} />
      </div>

      {/* Footer */}
      {slug === 'yokohama' && topConfig?.footer && <YokohamaFooter config={topConfig.footer} />}
      {slug === 'fukuoka' && topConfig?.footer && <FukuokaFooter config={topConfig.footer} />}
    </div>
  );
}
