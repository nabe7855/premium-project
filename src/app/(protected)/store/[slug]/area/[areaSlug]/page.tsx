import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// 第一弾の実装対象エリア
const TARGET_AREAS = [
  { slug: 'fukuoka', areaSlug: 'tenjin', name: '天神' },
  { slug: 'fukuoka', areaSlug: 'hakata', name: '博多' },
  { slug: 'fukuoka', areaSlug: 'nakasu', name: '中洲' },
  { slug: 'yokohama', areaSlug: 'kannai', name: '関内' },
  { slug: 'yokohama', areaSlug: 'minatomirai', name: 'みなとみらい' },
];

interface AreaPageProps {
  params: {
    slug: string;
    areaSlug: string;
  };
}

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const areaInfo = TARGET_AREAS.find(
    (a) => a.slug === params.slug && a.areaSlug === params.areaSlug
  );

  if (!areaInfo) {
    return { title: 'ページが見つかりません' };
  }

  const title = `${areaInfo.name}の女性用風俗｜ストロベリーボーイズ`;
  
  return {
    title,
    description: `${areaInfo.name}エリアの女性用風俗・出張ホストはストロベリーボーイズにお任せください。`,
    // TODO: コンテンツ入稿完了後に noindex を外す（または index: true に変更）
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `https://www.sutoroberrys.jp/store/${params.slug}/area/${params.areaSlug}`,
    },
  };
}

export function generateStaticParams() {
  return TARGET_AREAS.map((a) => ({
    slug: a.slug,
    areaSlug: a.areaSlug,
  }));
}

export default async function AreaLPPage({ params }: AreaPageProps) {
  const areaInfo = TARGET_AREAS.find(
    (a) => a.slug === params.slug && a.areaSlug === params.areaSlug
  );

  if (!areaInfo) {
    notFound();
  }

  // TODO: 本実装ではCMSまたはDBからエリア別LPのコンテンツ（本文、FAQ、セラピスト）を取得して表示する
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          {areaInfo.name}エリアの女性用風俗・出張ホスト
        </h1>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-600 mb-6">
            現在、{areaInfo.name}エリア特設ページは準備中です。<br/>
            公開までもうしばらくお待ちください。
          </p>
          <a 
            href={`/store/${params.slug}`} 
            className="inline-block bg-rose-500 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-600 transition"
          >
            店舗トップへ戻る
          </a>
        </div>
      </div>
    </div>
  );
}
