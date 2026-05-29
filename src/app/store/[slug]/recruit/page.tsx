import { getRecruitPageConfig } from '@/actions/recruit';
import { LandingPageConfig } from '@/components/recruit2/LandingPage';
import RecruitPageClient from '@/components/recruit2/RecruitPageClient';
import { Metadata } from 'next';

const STORE_META: Record<string, {
  city: string; cityKana: string; area: string; areaKw: string[];
}> = {
  tokyo:   { city: "東京",   cityKana: "とうきょう", area: "新宿・渋谷・池袋", areaKw: ["新宿","渋谷","池袋","東京駅","品川"] },
  honten:  { city: "東京",   cityKana: "とうきょう", area: "新宿・渋谷・池袋", areaKw: ["新宿","渋谷","池袋","東京駅","品川"] },
  yokohama:{ city: "横浜",   cityKana: "よこはま",   area: "みなとみらい・関内", areaKw: ["みなとみらい","関内","桜木町","新横浜"] },
  nagoya:  { city: "名古屋", cityKana: "なごや",     area: "栄・名古屋駅",     areaKw: ["栄","名駅","金山","伏見"] },
  osaka:   { city: "大阪",   cityKana: "おおさか",   area: "梅田・難波",       areaKw: ["梅田","難波","心斎橋","天王寺"] },
  fukuoka: { city: "福岡",   cityKana: "ふくおか",   area: "天神・博多",       areaKw: ["天神","博多","中洲"] },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const s = STORE_META[params.slug];
  if (!s) return {};
  const title = `${s.city}の女性用風俗セラピスト求人｜週1・未経験OK｜ストロベリーボーイズ${s.city}店`;
  const desc  = `${s.city}で女性用風俗セラピストを募集中。未経験歓迎・週1日〜・全額日払い・登録料0円。最短10日デビュー、平均月収55万円。LINEで30秒応募。`;
  return {
    title, description: desc,
    keywords: ["女性用風俗 求人", "女風 求人", "セラピスト 募集", s.city, ...s.areaKw, "出張ホスト 求人", "高収入"],
    alternates: { canonical: `https://www.sutoroberrys.jp/store/${params.slug}/recruit` },
    openGraph: {
      title, description: desc,
      url: `https://www.sutoroberrys.jp/store/${params.slug}/recruit`,
      siteName: "ストロベリーボーイズ",
      images: [{ url: `/ogp/recruit-${params.slug}.png`, width: 1200, height: 630 }],
      locale: "ja_JP", type: "website",
    },
    twitter: { card: "summary_large_image", title, description: desc, images: [`/ogp/recruit-${params.slug}.png`] },
  };
}

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
