import HotelCard from '@/components/sweetstay/HotelCard';
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

  return (
    <div className="duration-500 animate-in fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-24 md:py-32">
        <div className="absolute right-0 top-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-rose-50 opacity-60 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-96 w-96 rounded-full bg-pink-50 opacity-60 blur-3xl"></div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-xs font-black uppercase italic tracking-widest text-rose-500">
              The Professional Standard
            </div>
            <h1 className="mb-8 text-6xl font-black leading-none tracking-tighter text-gray-900 md:text-8xl">
              Love, Stay, <br />
              <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                Sweet Life.
              </span>
            </h1>
            <p className="mb-12 max-w-xl text-xl font-medium leading-relaxed text-gray-400">
              現役セラピストが「プロの視点」で選んだ、本当に使いやすく心地よいホテルのまとめメディア。
              単なる場所探しではない、上質なステイ体験をお届けします。
            </p>

            <div className="mb-12 flex flex-col items-center gap-2 rounded-[2.5rem] border border-rose-50 bg-white p-2 shadow-2xl shadow-rose-100 md:flex-row">
              <div className="flex w-full flex-grow items-center gap-4 px-6 py-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-rose-500"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="エリア、ホテル名、駅名..."
                  className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-300"
                />
              </div>
              <div className="hidden h-8 w-px bg-gray-100 md:block"></div>
              <div className="flex w-full items-center gap-4 px-6 py-4 md:w-auto">
                <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-gray-300">
                  Plan
                </span>
                <select className="cursor-pointer bg-transparent text-sm font-bold text-gray-900 outline-none">
                  <option>宿泊</option>
                  <option>休憩</option>
                </select>
              </div>
              <button className="h-14 w-full rounded-3xl bg-rose-500 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-600 active:scale-95 md:w-40">
                SEARCH
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/sweetstay/guide"
                className="flex h-12 items-center rounded-2xl border border-gray-100 bg-white px-8 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all hover:bg-gray-50 active:scale-95"
              >
                初めての方へ
              </Link>
              <Link
                href="/sweetstay/coupon"
                className="flex h-12 items-center rounded-2xl border border-gray-100 bg-white px-8 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all hover:bg-gray-50 active:scale-95"
              >
                クーポン一覧
              </Link>
            </div>
          </div>
        </div>
      </section>

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
