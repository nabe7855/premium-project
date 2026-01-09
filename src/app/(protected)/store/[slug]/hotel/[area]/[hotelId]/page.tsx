import HotelDetailClient from '@/components/lovehotels/HotelDetailClient';
import Layout from '@/components/lovehotels/Layout';
import { stores } from '@/data/stores';
import { getHotelById, mapDbHotelToHotel } from '@/lib/lovehotelApi';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 0;

interface Props {
  params: {
    slug: string;
    area: string;
    hotelId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const dbHotel = await getHotelById(params.hotelId);
    if (!dbHotel) return { title: 'Hotel Not Found' };
    const hotel = mapDbHotelToHotel(dbHotel);

    return {
      title: `${hotel.name} | ${hotel.area}のおすすめホテル | Strawberry Boys`,
      description: `${hotel.name}をご利用の際におすすめな、${hotel.area}のホテル情報をご紹介します。`,
    };
  } catch (error) {
    return { title: 'Hotel Details' };
  }
}

export default async function StoreHotelDetailPage({ params }: Props) {
  const store = stores[params.slug];
  if (!store) notFound();

  try {
    const dbHotel = await getHotelById(params.hotelId);
    if (!dbHotel) notFound();

    const hotel = mapDbHotelToHotel(dbHotel);

    return (
      <Layout>
        <HotelDetailClient hotel={hotel} />
      </Layout>
    );
  } catch (error) {
    console.error('[Page] Error fetching hotel:', error);
    notFound();
  }
}
