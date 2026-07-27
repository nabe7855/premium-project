import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AreaLpClient, { AreaDetailInfo } from '@/components/sections/area/AreaLpClient';
import { getCastsByStore } from '@/lib/getCastsByStore';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import FukuokaMobileStickyButton from '@/components/templates/store/fukuoka/sections/MobileStickyButton';
import YokohamaMobileStickyButton from '@/components/templates/store/yokohama/sections/MobileStickyButton';

// 出張対応エリア詳細データマップ
const AREA_MAP: Record<string, AreaDetailInfo> = {
  'fukuoka-hakata': {
    slug: 'fukuoka',
    areaSlug: 'hakata',
    name: '博多',
    cityName: '福岡',
    description: '博多駅周辺（筑紫口・博多口）の主要ホテルやご自宅へ出張セラピストがお伺いします。出張費・交通費もわかりやすい明朗会計。',
    features: ['博多駅徒歩圏内の全ホテル対応', '24時間即日派遣可能', '完全個室で秘密厳守'],
    recommendedHotels: ['博多駅筑紫口周辺ビジネスホテル', '博多駅博多口シティホテル', '博多エリア各種ラブホテル', 'ご指定のご自宅・マンション'],
    faqs: [
      { question: '博多駅近くのホテルでも利用できますか？', answer: 'はい、博多駅筑紫口・博多口周辺の全てのビジネスホテル・シティホテル・ラブホテルに対応しております。' },
      { question: '初めてで不安なのですが大丈夫ですか？', answer: 'ストロベリーボーイズは女性初心者様を大歓迎しております。丁寧で優しいセラピストがご希望に合わせてエスコートいたします。' },
    ],
  },
  'fukuoka-tenjin': {
    slug: 'fukuoka',
    areaSlug: 'tenjin',
    name: '天神',
    cityName: '福岡',
    description: '天神・親富孝通り・大名エリアの指定ホテルや自宅へイケメンセラピストを派遣。お買物帰りや仕事終わりのリフレッシュに最適です。',
    features: ['天神・大名・今泉エリア即対応', '洗練された人気キャスト在籍', '明朗会計・安心サポート'],
    recommendedHotels: ['天神駅周辺シティホテル', '大名・今泉エリアデザイナーズホテル', '天神エリアラブホテル', 'ご自宅・指定マンション'],
    faqs: [
      { question: '天神で当日の予約は可能ですか？', answer: 'はい、当日の急なご予約も対応可能です。LINEまたはWeb予約フォームより出勤状況をご確認いただけます。' },
      { question: '利用料金以外に追加料金は発生しますか？', answer: '基本コース料金と規定の出張交通費以外、指名料や不当な追加費用は一切かかりません。' },
    ],
  },
  'fukuoka-nakasu': {
    slug: 'fukuoka',
    areaSlug: 'nakasu',
    name: '中洲',
    cityName: '福岡',
    description: '中洲・川端川沿いエリアのホテルやご指定の場所へ出張。最高級の接客と癒やしのセラピーをお届けします。',
    features: ['中洲・中洲川端駅すぐ', 'ナイトタイム即日派遣対応', '上質な完全プライベート空間'],
    recommendedHotels: ['中洲川端周辺ラグジュアリーホテル', '中洲エリア各種ホテル', '天神・中洲近郊ご自宅'],
    faqs: [
      { question: '深夜帯の利用も対応していますか？', answer: 'はい、深夜の時間帯の出張派遣・ご予約にも柔軟に対応しております。' },
    ],
  },
  'fukuoka-yakuin': {
    slug: 'fukuoka',
    areaSlug: 'yakuin',
    name: '薬院',
    cityName: '福岡',
    description: '薬院・平尾エリアのお洒落なご自宅やホテルへ出張。落ち着いた雰囲気の中で特別なひとときをお過ごしいただけます。',
    features: ['薬院・平尾エリア密着', '完全プライベート厳守', '事前Web予約で快適利用'],
    recommendedHotels: ['薬院駅周辺ホテル', '渡辺通エリアホテル', 'ご自宅・マンション'],
    faqs: [
      { question: '自宅への出張時にご近所にバレませんか？', answer: 'セラピストは私服で目立たないよう細心の注意を払ってお伺いしますのでご安心ください。' },
    ],
  },
  'yokohama-kannai': {
    slug: 'yokohama',
    areaSlug: 'kannai',
    name: '関内',
    cityName: '横浜',
    description: '関内・伊勢佐木町エリアのホテルやご自宅へ出張セラピストを派遣。横浜店自慢のイケメンセラピストが極上の癒やしを提供します。',
    features: ['関内駅・伊勢佐木長者町エリア即対応', '厳選されたイケメンキャスト', '安心明朗会計・完全予約制'],
    recommendedHotels: ['関内駅周辺ビジネスホテル', '伊勢佐木町エリアラブホテル', '馬車道・日本大通りエリアホテル', 'ご自宅'],
    faqs: [
      { question: '関内エリアでの出張費用はいくらですか？', answer: '横浜店の標準出張交通費が適用されます。予約時に明確な合計金額をご案内いたします。' },
    ],
  },
  'yokohama-minatomirai': {
    slug: 'yokohama',
    areaSlug: 'minatomirai',
    name: 'みなとみらい',
    cityName: '横浜',
    description: 'みなとみらい・桜木町エリアの高級シティホテルや高層ホテルへ出張。夜景とともに最高のロマンチックな癒やしをお届けします。',
    features: ['みなとみらい高級ホテル対応', '接客マナー徹底の高品質キャスト', '洗練された癒やしの時間'],
    recommendedHotels: ['みなとみらいエリア各種シティホテル', '桜木町駅前ホテル', '横浜港周辺リゾートホテル'],
    faqs: [
      { question: 'みなとみらいの高級ホテルでも利用できますか？', answer: 'はい、みなとみらい地区の主要ホテルに対応しております。お部屋番号をご連絡いただければセラピストがお伺いします。' },
    ],
  },
  'yokohama-sakuragicho': {
    slug: 'yokohama',
    areaSlug: 'sakuragicho',
    name: '桜木町',
    cityName: '横浜',
    description: '桜木町・野毛エリア周辺の指定ホテルやご自宅へ迅速に出張。観光やお仕事帰りのプライベートタイムを華やかに彩ります。',
    features: ['桜木町駅徒歩圏対応', '当日即日ご予約受付中', '秘密厳守・丁寧な対応'],
    recommendedHotels: ['桜木町駅周辺ホテル', '野毛・日ノ出町エリアホテル', 'ご自宅'],
    faqs: [
      { question: '当日急に予約することは可能ですか？', answer: 'はい、セラピストの空き状況に応じて当日予約が可能です。' },
    ],
  },
};

const TARGET_AREAS = Object.values(AREA_MAP);

interface AreaPageProps {
  params: {
    slug: string;
    areaSlug: string;
  };
}

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const key = `${params.slug}-${params.areaSlug}`;
  const areaInfo = AREA_MAP[key];

  if (!areaInfo) {
    return { title: 'ページが見つかりません' };
  }

  const title = `【公式】${areaInfo.name}の女性用風俗・女風｜ストロベリーボーイズ${areaInfo.cityName}店【出張セラピー】`;
  const description = `${areaInfo.name}（${areaInfo.cityName}）で女性用風俗・女風・出張ホストをお探しならストロベリーボーイズ。${areaInfo.description}`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://www.sutoroberrys.jp/store/${params.slug}/area/${params.areaSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.sutoroberrys.jp/store/${params.slug}/area/${params.areaSlug}`,
      siteName: 'Strawberry Boys',
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return TARGET_AREAS.map((a) => ({
    slug: a.slug,
    areaSlug: a.areaSlug,
  }));
}

import { getHotels, mapDbHotelToHotel } from '@/lib/lovehotelApi';

const STORE_LOCATION: Record<string, { prefectureId: string; cityId?: string }> = {
  fukuoka: { prefectureId: 'Fukuoka' },
  yokohama: { prefectureId: 'Kanagawa', cityId: 'Yokohama-shi' },
};

export default async function AreaLPPage({ params }: AreaPageProps) {
  const key = `${params.slug}-${params.areaSlug}`;
  const areaInfo = AREA_MAP[key];

  if (!areaInfo) {
    notFound();
  }

  const loc = STORE_LOCATION[params.slug] || { prefectureId: 'Fukuoka' };

  // 並列フェッチ (キャスト、設定、エリア対応ホテル)
  const [casts, topConfigResult, dbHotels] = await Promise.all([
    getCastsByStore(params.slug),
    getStoreTopConfig(params.slug, { skipCasts: true }),
    getHotels({ prefectureId: loc.prefectureId, cityId: loc.cityId }),
  ]);

  const topConfig = topConfigResult.success ? (topConfigResult.config as StoreTopPageConfig) : null;
  const hotels = (dbHotels || []).map(mapDbHotelToHotel);

  // JSON-LD (FAQ & Service)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${areaInfo.name}出張女性用風俗サービス - ストロベリーボーイズ${areaInfo.cityName}店`,
    provider: {
      '@type': 'Organization',
      name: 'Strawberry Boys',
      url: 'https://www.sutoroberrys.jp',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: `${areaInfo.name}（${areaInfo.cityName}）`,
    },
    description: areaInfo.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ヘッダー */}
      {params.slug === 'yokohama' && topConfig?.header && <YokohamaHeader config={topConfig.header} />}
      {params.slug === 'fukuoka' && topConfig?.header && <FukuokaHeader config={topConfig.header} />}

      <main className="min-h-screen">
        <AreaLpClient areaInfo={areaInfo} casts={casts} hotels={hotels} storeSlug={params.slug} />
      </main>

      {/* フッター */}
      {params.slug === 'yokohama' && topConfig?.footer && <YokohamaFooter config={topConfig.footer} />}
      {params.slug === 'fukuoka' && topConfig?.footer && <FukuokaFooter config={topConfig.footer} />}

      {/* モバイル追従予約ボタン */}
      {params.slug === 'fukuoka' && (
        <FukuokaMobileStickyButton
          config={topConfig?.footer?.bottomNav}
          isVisible={topConfig?.footer?.isBottomNavVisible}
        />
      )}
      {params.slug === 'yokohama' && (
        <YokohamaMobileStickyButton
          config={topConfig?.footer?.bottomNav}
          isVisible={topConfig?.footer?.isBottomNavVisible}
        />
      )}
    </>
  );
}
