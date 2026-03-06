import HeroSlider from '@/components/sweetstay/HeroSlider';
import HotelCard from '@/components/sweetstay/HotelCard';
import QuickNav from '@/components/sweetstay/QuickNav';
import SecondaryBannerSlider from '@/components/sweetstay/SecondaryBannerSlider';
import TabelogSearch from '@/components/sweetstay/TabelogSearch';
import { getHotels, mapDbHotelToHotel } from '@/lib/lovehotelApi';
import { BookOpen, Heart, ShieldCheck, Sparkles, Star, Trophy, Users } from 'lucide-react';
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

  const reviewHighlights = [
    {
      id: 1,
      hotel: 'Hotel Glarev 新宿',
      author: 'セラピスト・Runa',
      avatar: '🍓',
      content:
        'とにかく内装が華やかで同伴でも絶対に外さない。特にサウナ付きの部屋は導線が完璧です...',
      rating: 5,
    },
    {
      id: 2,
      hotel: 'Boutique Hotel &',
      author: 'カップル利用・Kさん',
      avatar: '🥂',
      content: '記念日で利用。アメニティが高級ブランドで彼女も大喜びでした。リピート確定。',
      rating: 4.8,
    },
    {
      id: 3,
      hotel: 'SHINJUKU THE HOTEL',
      author: '女子会利用・Mina',
      avatar: '🎀',
      content: '4人でも広々！プロジェクターで推し活が最高に捗りました。また泊まりたい！',
      rating: 4.5,
    },
  ];

  const guidePillars = [
    {
      title: 'はじめてのラブホQ&A',
      desc: '入り方から精算まで完全ガイド',
      icon: <BookOpen className="text-cyan-500" />,
    },
    {
      title: '風俗嬢おすすめホテル',
      desc: 'プロが選ぶ"外さない"空間',
      icon: <ShieldCheck className="text-rose-500" />,
    },
    {
      title: '同伴・接客マニュアル',
      desc: 'スマートな利用のための必読コラム',
      icon: <Users className="text-indigo-500" />,
    },
    {
      title: '設備ランキング',
      desc: 'サウナ・露天風呂・SMルーム',
      icon: <Trophy className="text-amber-500" />,
    },
    {
      title: '料金・コスパ比較',
      desc: '賢く利用するための料金体系解説',
      icon: <Sparkles className="text-emerald-500" />,
    },
    {
      title: 'ラブホテルの歴史・文化',
      desc: 'AIO対策・知識を深めるメディア',
      icon: <Heart className="text-orange-500" />,
    },
  ];

  return (
    <div className="bg-[#FFF8F6] duration-500 animate-in fade-in">
      {/* Premium Hero Slider Section */}
      <HeroSlider />

      {/* Secondary SNS Banner Slider */}
      <SecondaryBannerSlider />

      {/* Tabelog-style Search Bar */}
      <TabelogSearch />

      {/* Quick Navigation Panel */}
      <div className="mt-8">
        <QuickNav />
      </div>

      {/* Reviews & Voices (Tabe-log Style) */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-rose-500">
                Real Voice & Reviews
              </div>
              <h2 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
                ゲストによる真実の評価。
                <br />
                信頼性にこだわったレビュープラットフォーム。
              </h2>
            </div>
            <Link
              href="/sweetstay/reviews"
              className="mt-6 text-sm font-black text-rose-500 transition-colors hover:text-rose-600 md:mt-0"
            >
              全ての口コミを見る →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {reviewHighlights.map((review) => (
              <div
                key={review.id}
                className="group relative rounded-[2rem] bg-white p-8 shadow-xl shadow-rose-100/30 transition-all hover:-translate-y-1"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-2xl">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{review.author}</p>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-black text-amber-600">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="mb-3 text-sm font-black text-rose-500">@{review.hotel}</h3>
                <p className="text-sm leading-relaxed text-gray-600">"{review.content}"</p>
                <Link
                  href={`/sweetstay/hotel/${review.id}`}
                  className="mt-4 inline-block text-[10px] font-black tracking-widest text-gray-300 transition-colors group-hover:text-rose-300"
                >
                  HOTEL DETAIL PAGE →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Picks */}
      <section className="bg-white/50 py-24 backdrop-blur-sm">
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

      {/* Guide & Media Pillars (SEO/AIO Strategy) */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Content Strategy
            </div>
            <h2 className="text-4xl font-black tracking-tight text-gray-900">
              ラブホテル攻略 & メディア
            </h2>
            <p className="mt-4 text-sm font-medium text-gray-500">
              知ればもっと楽しくなる。AIO対応の高品質コンテンツ群。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guidePillars.map((pillar, idx) => (
              <Link
                key={idx}
                href="/sweetstay/guide"
                className="group flex items-center gap-6 rounded-[2rem] bg-white p-6 shadow-lg shadow-gray-100 transition-all hover:shadow-2xl hover:shadow-rose-100 md:p-8"
              >
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-50 transition-colors group-hover:bg-rose-50">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 group-hover:text-rose-500">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">{pillar.desc}</p>
                </div>
              </Link>
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

      {/* Brand Integration Banner (Enhanced & Unified) */}
      <section className="relative overflow-hidden bg-white/40 py-32 backdrop-blur-md">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,139,167,0.1),transparent)]"></div>
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[3rem] bg-white shadow-2xl shadow-rose-200/50">
              <span className="text-4xl">🍓</span>
            </div>
            <h2 className="premium-gradient-text mb-8 max-w-4xl text-5xl font-black leading-[1.1] tracking-tight md:text-7xl">
              プロフェッショナルが
              <br />
              一目置く、価値ある滞在。
            </h2>
            <p className="mb-12 max-w-2xl text-lg font-medium leading-relaxed text-[#4A4A4A] md:text-xl">
              Sweet Stayはイケオ・イケジョと完全に連携。
              現役セラピスト・業界関係者のリアルな視点を取り入れた、大手の検索機能を超えた真に快適な空間をあなたへ。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/ikeo"
                className="flex h-16 items-center rounded-full bg-[#FF8BA7] px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-rose-200/50 transition-all hover:scale-105 active:scale-95"
              >
                Ikeo for Men
              </Link>
              <Link
                href="/ikejo"
                className="flex h-16 items-center rounded-full border-2 border-rose-100 bg-white px-8 text-[10px] font-black uppercase tracking-widest text-[#FF8BA7] shadow-xl shadow-rose-100/20 transition-all hover:scale-105 active:scale-95"
              >
                Ikejo for Women
              </Link>
              <Link
                href="/sweetstay/reviews"
                className="flex h-16 items-center rounded-full bg-slate-800 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200/50 transition-all hover:scale-105 active:scale-95"
              >
                Read Premium Reviews
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
