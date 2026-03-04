import { getHotelById, mapDbHotelToHotel } from '@/lib/lovehotelApi';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const dbHotel = await getHotelById(params.id);
    const hotel = mapDbHotelToHotel(dbHotel);
    return {
      title: `${hotel.name} | Sweet Stay`,
      description: `${hotel.name}の詳細情報、アメニティ、サービス、プロの目利きによる評価をご紹介します。`,
    };
  } catch (e) {
    return { title: 'Hotel Not Found' };
  }
}

export default async function SweetStayHotelDetailPage({ params }: Props) {
  let hotel;
  try {
    const dbHotel = await getHotelById(params.id);
    hotel = mapDbHotelToHotel(dbHotel);
  } catch (e) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero: Main Image */}
      <section className="relative h-[60vh] overflow-hidden bg-gray-900 md:h-[80vh]">
        {hotel.imageUrl && (
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className="h-full w-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-12 left-0 w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-rose-500 px-4 py-1.5 text-[10px] font-black uppercase italic tracking-widest text-white shadow-lg shadow-rose-900/40">
                Professional Choice
              </span>
              <span className="rounded-full border border-white/10 bg-white/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                {hotel.city || '横浜'}・{hotel.area || '中区'}
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white md:text-7xl">
              {hotel.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">
            {/* Left Column: Details */}
            <div className="lg:col-span-8">
              <div className="mb-16">
                <h2 className="mb-8 text-2xl font-black tracking-tight text-gray-900">
                  About This Hotel
                </h2>
                <p className="text-lg font-medium leading-[2] text-gray-500">
                  {hotel.description ||
                    'このホテルについての詳細な紹介文を、現在プロの目利きたちが執筆中です。現時点では、以下の充実したアメニティとサービス、そしてその立地の良さから多くの方に選ばれています。'}
                </p>
              </div>

              {/* Amenity & Services Grid */}
              <div className="mb-16 grid grid-cols-1 gap-12 border-t border-gray-100 pt-16 md:grid-cols-2">
                <div>
                  <h3 className="mb-8 text-sm font-black uppercase tracking-widest text-gray-900">
                    Amenities
                  </h3>
                  <ul className="space-y-4">
                    {hotel.amenities.map((amenity) => (
                      <li
                        key={amenity}
                        className="flex items-center gap-4 text-sm font-bold text-gray-500"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-rose-500">
                          ★
                        </div>
                        {amenity}
                      </li>
                    ))}
                    {hotel.amenities.length === 0 && (
                      <li className="text-sm font-bold text-gray-300">掲載準備中</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-8 text-sm font-black uppercase tracking-widest text-gray-900">
                    Services
                  </h3>
                  <ul className="space-y-4">
                    {hotel.services.map((service) => (
                      <li
                        key={service}
                        className="flex items-center gap-4 text-sm font-bold text-gray-500"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-rose-500">
                          ✔
                        </div>
                        {service}
                      </li>
                    ))}
                    {hotel.services.length === 0 && (
                      <li className="text-sm font-bold text-gray-300">掲載準備中</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar / Booking info */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-2xl shadow-gray-100">
                <div className="mb-8">
                  <div className="mb-2 text-[10px] font-black uppercase italic tracking-widest text-gray-300">
                    Official Price Guide
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[8px] font-black uppercase text-gray-400">Stay from</span>
                    <span className="text-3xl font-black text-gray-900">
                      ¥{hotel.stayPriceMinWeekday?.toLocaleString() || '---'}
                    </span>
                    <span className="text-xs font-bold text-gray-400">/ night</span>
                  </div>
                </div>

                <div className="mb-8 space-y-4 border-t border-gray-50 pt-8">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">所在地</span>
                    <span className="text-right text-gray-900">{hotel.address}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">電話番号</span>
                    <span className="text-gray-900">{hotel.phone}</span>
                  </div>
                </div>

                <a
                  href={hotel.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-16 w-full items-center justify-center rounded-2xl bg-gray-900 text-sm font-black text-white shadow-xl shadow-gray-100 transition-all hover:bg-rose-600 active:scale-95"
                >
                  公式サイトを見る
                </a>

                <div className="mt-8 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
                    Always Professional, Always Direct.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
