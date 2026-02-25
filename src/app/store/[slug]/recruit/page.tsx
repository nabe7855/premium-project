import { getRecruitPageConfig } from '@/actions/recruit';
import { LandingPageConfig } from '@/components/recruit2/LandingPage';
import RecruitPageClient from '@/components/recruit2/RecruitPageClient';

export default async function RecruitPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Fetch data on the server
  const result = await getRecruitPageConfig(slug);

  const initialData = {
    config: result.success ? (result.config as LandingPageConfig) : undefined,
    storeInfo: result.success ? result.storeInfo : null,
    topConfig: result.success ? result.topConfig : null,
  };

  return <RecruitPageClient initialData={initialData} slug={slug} />;
}
