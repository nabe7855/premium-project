import HotelCard from '@/components/sweetstay/HotelCard';
import { getHotels, getPrefectureDetails, mapDbHotelToHotel } from '@/lib/lovehotelApi';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    prefecture: string;
  };
}

export default async function SweetStayAreaPage({ params }: Props) {
  const prefId = params.prefecture;

  // Try to find if this prefecture ID works
  const dbHotels = (await getHotels({ prefectureId: prefId })) || [];
  const hotels = dbHotels.map(mapDbHotelToHotel);

  if (hotels.length === 0 && prefId !== 'kanagawa' && prefId !== 'fukuoka') {
    notFound();
  }

  // Get city list for this prefecture
  const { prefectureName, cities: cityDetails, description } = await getPrefectureDetails(prefId);

  return (
    <div className="bg-white py-24 duration-500 animate-in fade-in md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-xs font-black uppercase italic tracking-widest text-rose-500">
              Local Expertise
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-gray-900 md:text-7xl">
              {prefectureName}のホテル
            </h1>
            <p className="mt-8 text-lg font-medium leading-relaxed text-gray-600">
              {description ||
                `${prefectureName}で厳選されたプロ推奨のホテル。エリアや設備、女子会やビジネスなど「利用目的」に合わせて、あなたにとって最高の場所を見つけましょう。`}
            </p>
          </div>

          <div className="hidden h-14 w-1 bg-rose-500/10 md:block"></div>

          <div className="text-right">
            <div className="mb-2 text-sm font-black uppercase leading-none tracking-widest text-gray-900">
              {hotels.length} Hotels
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
              Available Selection
            </div>
          </div>
        </div>

        {/* City Filter Index */}
        {cityDetails.length > 0 && (
          <div className="mb-24 flex flex-wrap gap-3">
            {cityDetails.map((city) => (
              <a
                key={city.id}
                href={`/sweetstay/area/${prefId}/${city.id.toLowerCase()}`}
                className="flex h-12 items-center rounded-2xl bg-gray-50 px-6 text-sm font-black text-gray-900 transition-all hover:bg-rose-500 hover:text-white hover:shadow-xl hover:shadow-rose-100 active:scale-95"
              >
                {city.name}
              </a>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
          {hotels.length === 0 && (
            <div className="col-span-full py-32 text-center text-gray-300">
              このエリアのホテル情報は準備中です。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
