import HotelCard from '@/components/sweetstay/HotelCard';
import SweetStayHero from '@/components/sweetstay/SweetStayHero';
import { getHotels, mapDbHotelToHotel } from '@/lib/lovehotelApi';
import Link from 'next/link';

export const revalidate = 3600; // 1 hour cache

export default async function SweetStayPortalPage() {
  // Fetch a selection of hotels for the portal
  const dbHotels = (await getHotels({ take: 6 })) || [];
  const featuredHotels = dbHotels.slice(0, 6).map(mapDbHotelToHotel);

  const areas = [
    { id: 'Kanagawa', name: '横浜', count: 276, link: '/sweetstay/area/kanagawa' },
    { id: 'Fukuoka', name: '福岡', count: 180, link: '/sweetstay/area/fukuoka' },
    { id: 'Tokyo', name: '東京', count: 50, link: '/sweetstay/area/tokyo' },
  ];

  // Using the generated premium image
  const heroBackgroundImage = '/sweet_stay_hero_bg_1772669990312.png';

  return (
    <div className="duration-500 animate-in fade-in">
      {/* Premium Hero Section */}
      <SweetStayHero backgroundImage={heroBackgroundImage} />

      {/* Featured Picks */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-rose-500">
                Pick Of The Professionals
              </div>
              <h2 className="text-4xl font-black tracking-tight text-gray-900">
                プロの目利きが選ぶ、
                <br />
                今泊まるべきホテル
              </h2>
            </div>
            <Link
              href="/sweetstay/search"
              className="hidden text-sm font-black text-gray-400 transition-colors hover:text-rose-500 md:block"
            >
              VIEW ALL HOTELS →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* Area Navigation */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 text-center md:px-6">
          <div className="mb-16">
            <div className="mb-4 inline-block text-[10px] font-black uppercase tracking-widest text-gray-400">
              Explore Locations
            </div>
            <h2 className="text-4xl font-black tracking-tight text-gray-900">エリアから探す</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {areas.map((area) => (
              <Link
                key={area.id}
                href={area.link}
                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-10 transition-all hover:border-rose-500 hover:shadow-2xl hover:shadow-gray-50"
              >
                <div className="relative z-10 flex flex-col items-center">
                  <h3 className="mb-2 text-2xl font-black text-gray-900 transition-colors group-hover:text-rose-500">
                    {area.name}
                  </h3>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                    {area.count} Hotels Registered
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 text-gray-50 transition-colors group-hover:text-rose-50">
                  <span className="select-none text-8xl font-black italic">
                    {area.name.charAt(0)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Integration Banner */}
      <section className="relative overflow-hidden bg-gray-900 py-32">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-rose-600/20 to-transparent"></div>
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 flex h-16 w-16 rotate-12 transform items-center justify-center rounded-3xl bg-white shadow-xl shadow-rose-900/50">
              <span className="text-3xl font-black text-rose-600">❤</span>
            </div>
            <h2 className="mb-8 max-w-2xl text-5xl font-black leading-tight text-white">
              出会いから滞在まで。
              <br />
              あなたの時間をデザインする。
            </h2>
            <p className="mb-12 max-w-xl text-lg font-medium text-gray-400">
              Sweet Stayはイケオ・イケジョと完全に連携。
              セラピストたちが推奨するホテルで、最高のマッチング体験を。
            </p>
            <div className="flex gap-4">
              <Link
                href="/ikeo"
                className="flex h-12 items-center rounded-xl bg-rose-600 px-8 text-xs font-black text-white transition-colors hover:bg-rose-500"
              >
                Ikeo for Men
              </Link>
              <Link
                href="/ikejo"
                className="flex h-12 items-center rounded-xl bg-white px-8 text-xs font-black text-gray-900 transition-colors hover:bg-gray-100"
              >
                Ikejo for Women
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
