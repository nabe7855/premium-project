import HotelDetailClient from '@/components/lovehotels/HotelDetailClient';
import Layout from '@/components/lovehotels/Layout';
import { MOCK_HOTELS } from '@/data/lovehotels';
import { stores } from '@/data/stores';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    slug: string;
    area: string;
    hotelId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hotel = MOCK_HOTELS.find((h) => h.id === params.hotelId);
  if (!hotel) return { title: 'Hotel Not Found' };

  return {
    title: `${hotel.name} | ${hotel.area}のおすすめホテル | Strawberry Boys`,
    description: `${hotel.name}をご利用の際におすすめな、${hotel.area}のホテル情報をご紹介します。`,
  };
}

export async function generateStaticParams() {
  const paths: { slug: string; area: string; hotelId: string }[] = [];

  Object.keys(stores).forEach((slug) => {
    // 実際にはその店舗に対応する県内のホテルのみを生成するのが効率的ですが
    // ここでは網羅的に生成します
    MOCK_HOTELS.forEach((hotel) => {
      // エリアIDを逆引き（簡易）
      const areaId =
        hotel.city === '新宿区'
          ? 'shinjuku'
          : hotel.city === '名古屋市中区'
            ? 'nagoya-naka'
            : hotel.city === '福岡市博多区'
              ? 'fukuoka-hakata'
              : 'area';

      paths.push({
        slug,
        area: areaId,
        hotelId: hotel.id,
      });
    });
  });
  return paths;
}

export default function StoreHotelDetailPage({ params }: Props) {
  const hotel = MOCK_HOTELS.find((h) => h.id === params.hotelId);
  if (!hotel) notFound();

  return (
    <Layout>
      <HotelDetailClient hotel={hotel} />
    </Layout>
  );
}
