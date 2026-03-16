import ReviewFormClient from '@/components/lovehotels/ReviewFormClient';
import { getHotelById, getReviews, mapDbHotelToHotel } from '@/lib/lovehotelApi';
import { Metadata } from 'next';
import Link from 'next/link';
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
  let reviews = [];
  try {
    const dbHotel = await getHotelById(params.id);
    hotel = mapDbHotelToHotel(dbHotel);
    reviews = await getReviews(params.id);
  } catch (e) {
    notFound();
  }

  const recommendedCount = reviews.filter(r => r.isRecommended).length;
  const recommendationRate = reviews.length > 0 
    ? Math.round((recommendedCount / reviews.length) * 100) 
    : 0;

  const reviewMetrics = [
    {
      label: '清掃',
      score:
        reviews.length > 0
          ? reviews.reduce((acc, r) => acc + (r.cleanliness || 0), 0) / reviews.length
          : 0,
    },
    {
      label: '接客',
      score:
        reviews.length > 0
          ? reviews.reduce((acc, r) => acc + (r.service || 0), 0) / reviews.length
          : 0,
    },
    {
      label: 'デザイン',
      score:
        reviews.length > 0
          ? reviews.reduce((acc, r) => acc + (r.design || 0), 0) / reviews.length
          : 0,
    },
    {
      label: '設備',
      score:
        reviews.length > 0
          ? reviews.reduce((acc, r) => acc + (r.facilities || 0), 0) / reviews.length
          : 0,
    },
    {
      label: 'コスパ',
      score:
        reviews.length > 0
          ? reviews.reduce((acc, r) => acc + (r.value || 0), 0) / reviews.length
          : 0,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hotel.address,
      addressLocality: hotel.city,
      addressRegion: hotel.prefecture,
    },
    telephone: hotel.phone,
    image: hotel.imageUrl,
    url: `https://www.sutoroberrys.jp/sweetstay/hotel/${hotel.id}`,
    amenityFeature: hotel.amenities.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="border-b border-gray-50 bg-white py-4">
        <div className="container mx-auto px-4 md:px-6">
          <ul className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <li>
              <Link href="/sweetstay" className="hover:text-rose-500">
                Sweet Stay
              </Link>
            </li>
            <li>
              <span className="text-gray-200">/</span>
            </li>
            <li>
              <Link
                href={`/sweetstay/area/${hotel.prefectureId?.toLowerCase()}`}
                className="hover:text-rose-500"
              >
                {hotel.prefecture}
              </Link>
            </li>
            <li>
              <span className="text-gray-200">/</span>
            </li>
            <li className="text-gray-900">{hotel.name}</li>
          </ul>
        </div>
      </nav>

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
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-rose-500 px-4 py-1.5 text-[10px] font-black uppercase italic tracking-widest text-white shadow-lg shadow-rose-900/40">
                Professional Choice
              </span>
              {hotel.purposes?.map((purpose) => (
                <span
                  key={purpose}
                  className="rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500"
                >
                  {purpose}
                </span>
              ))}
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
                <div className="prose prose-rose max-w-none">
                  <p className="text-lg font-medium leading-[2] text-gray-500">
                    {hotel.aiDescription ||
                      hotel.description ||
                      'このホテルについての詳細な紹介文を、現在プロの目利きたちが執筆中です。現時点では、以下の充実したアメニティとサービス、そしてその立地の良さから多くの方に選ばれています。'}
                  </p>
                </div>
              </div>

              {/* Detailed Price Table Section */}
              <div className="mb-16 border-t border-gray-100 pt-16">
                <h2 className="mb-8 text-2xl font-black tracking-tight text-gray-900">
                  料金システム
                </h2>
                <div className="overflow-hidden rounded-3xl border border-gray-100">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">
                          プラン
                        </th>
                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">
                          平日
                        </th>
                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">
                          週末・祝日
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm font-bold">
                      <tr>
                        <td className="px-6 py-6 text-gray-900">休憩 (Rest)</td>
                        <td className="px-6 py-6 text-gray-500">
                          ¥{hotel.restPriceMinWeekday?.toLocaleString() || '---'} 〜
                        </td>
                        <td className="px-6 py-6 text-gray-500">
                          ¥{hotel.restPriceMinWeekend?.toLocaleString() || '---'} 〜
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-6 text-gray-900">宿泊 (Stay)</td>
                        <td className="px-6 py-6 text-gray-500">
                          ¥{hotel.stayPriceMinWeekday?.toLocaleString() || '---'} 〜
                        </td>
                        <td className="px-6 py-6 text-gray-500">
                          ¥{hotel.stayPriceMinWeekend?.toLocaleString() || '---'} 〜
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-[10px] font-bold uppercase italic tracking-widest text-gray-300">
                  ※ 料金は部屋タイプや利用時間により変動します。詳細は公式サイトをご確認ください。
                </p>
              </div>

              {/* Amenity & Services Grid */}
              <div className="mb-16 grid grid-cols-1 gap-12 border-t border-gray-100 pt-16 md:grid-cols-2">
                <div>
                  <h3 className="mb-8 text-sm font-black uppercase tracking-widest text-gray-900">
                    Amenities
                  </h3>
                  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {hotel.amenities.map((amenity) => (
                      <li
                        key={amenity}
                        className="flex items-center gap-4 text-xs font-bold text-gray-500"
                      >
                        <div className="flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl bg-gray-50 text-rose-500">
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
                  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {hotel.services.map((service) => (
                      <li
                        key={service}
                        className="flex items-center gap-4 text-xs font-bold text-gray-500"
                      >
                        <div className="flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl bg-gray-50 text-rose-500">
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

              {/* Reviews Section */}
              <div className="mb-16 border-t border-gray-100 pt-16">
                <ReviewFormClient hotelId={hotel.id} />

                <div className="mb-12 flex items-center justify-end">
                  <div className="flex items-center gap-8">
                    {/* Itemized Bar Chart (Small) */}
                    <div className="hidden gap-6 border-r border-gray-100 pr-10 md:flex">
                      {reviewMetrics.map((m) => (
                        <div key={m.label} className="text-center">
                          <div className="text-[14px] font-black text-gray-900">
                            {m.score > 0 ? m.score.toFixed(1) : '-'}
                          </div>
                          <div className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Recommendation Rate */}
                    {reviews.length > 0 && (
                      <div className="flex flex-col items-center justify-center border-r border-gray-100 pr-10">
                        <div className="text-3xl font-black text-[#FF8BA7]">
                          {recommendationRate}%
                        </div>
                        <div className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                          Recommended
                        </div>
                      </div>
                    )}
                    <div className="text-right">
                      <div className="text-4xl font-black text-rose-500">
                        {hotel.rating?.toFixed(1) || '0.0'}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                        Total {reviews.length} Reviews
                      </div>
                    </div>
                  </div>
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-12">
                    {reviews.map((review) => {
                      const isPro = review.stayType === 'pro_report';
                      return (
                        <div
                          key={review.id}
                          className={`group relative rounded-[2.5rem] p-8 transition-all hover:shadow-2xl hover:shadow-gray-100 ${
                            isPro ? 'bg-rose-50/50 ring-1 ring-rose-100' : 'bg-gray-50'
                          }`}
                        >
                          {isPro && (
                            <div className="absolute -top-3 left-8 flex items-center gap-1 rounded-full bg-rose-500 px-4 py-1.5 text-[8px] font-black uppercase tracking-widest text-white shadow-lg shadow-rose-200">
                              Professional Report
                            </div>
                          )}
                          <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${
                                  isPro ? 'bg-rose-100 text-rose-500' : 'bg-white text-gray-400'
                                }`}
                              >
                                {isPro ? '👑' : '👤'}
                              </div>
                              <div>
                                <h4 className="font-black text-gray-900">{review.userName}</h4>
                                <div className="flex items-center gap-3">
                                  <div className="flex text-rose-500">
                                    {[...Array(5)].map((_, i) => (
                                      <span
                                        key={i}
                                        className={i < review.rating ? '' : 'opacity-20'}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                  {review.isRecommended && (
                                    <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[8px] font-black text-rose-500">
                                      <span>👍</span> RECOMMENDED
                                    </span>
                                  )}
                                  <span className="text-[10px] font-bold text-gray-400">
                                    {review.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="prose prose-sm mb-6 max-w-none font-medium leading-relaxed text-gray-600">
                            <p className="whitespace-pre-wrap">{review.content}</p>
                          </div>

                          {/* Detailed Scores */}
                          <div className="mb-6 flex flex-wrap gap-4 rounded-2xl bg-white/50 p-4">
                            {[
                              { label: '清掃', score: review.cleanliness },
                              { label: 'サービス', score: review.service },
                              { label: 'デザイン', score: review.design },
                              { label: '設備', score: review.facilities },
                              { label: 'コスパ', score: review.value },
                            ].map((s) => (
                              <div key={s.label} className="flex items-center gap-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                                  {s.label}
                                </span>
                                <span className="text-xs font-black text-gray-900">
                                  {s.score || '-'}
                                </span>
                              </div>
                            ))}
                          </div>

                          {review.photos && review.photos.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                              {review.photos.map((photo, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="h-32 min-w-[12rem] overflow-hidden rounded-2xl border border-white/50 bg-gray-200 shadow-sm transition-transform hover:scale-[1.02]"
                                >
                                  <img
                                    src={photo.url}
                                    alt="Review photo"
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-[2.5rem] bg-gray-50 py-24 text-center">
                    <div className="mb-6 animate-pulse text-5xl text-gray-200">✍</div>
                    <h4 className="text-lg font-black text-gray-900">No reviews yet</h4>
                    <p className="mt-2 text-sm font-bold text-gray-400">
                      現在、キャストとユーザーによるレビューを収集中です。
                      <br />
                      プロの目利きレポートを近日中に公開予定です。
                    </p>
                  </div>
                )}
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

                  {/* アクセス情報 */}
                  {(hotel.accessInfo?.stations?.length || hotel.distanceFromStation) && (
                    <div className="border-t border-gray-50 pt-4">
                      <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Access
                      </div>
                      {hotel.accessInfo?.stations?.length ? (
                        <ul className="space-y-1">
                          {hotel.accessInfo.stations.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs font-bold text-gray-700">
                              <span className="mt-0.5 text-rose-400">🚃</span>
                              <span>{s}</span>
                            </li>
                          ))}
                          {hotel.accessInfo.interchanges?.map((ic, i) => (
                            <li key={`ic-${i}`} className="flex items-start gap-2 text-xs font-bold text-gray-700">
                              <span className="mt-0.5 text-blue-400">🚗</span>
                              <span>{ic}</span>
                            </li>
                          ))}
                          {hotel.accessInfo.parking && (
                            <li className="flex items-start gap-2 text-xs font-bold text-gray-700">
                              <span className="mt-0.5 text-green-500">🅿</span>
                              <span>駐車場: {hotel.accessInfo.parking}</span>
                            </li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-xs font-bold text-gray-700">{hotel.distanceFromStation}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-8 space-y-4">
                  <a
                    href={hotel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-16 w-full items-center justify-center rounded-2xl bg-gray-900 text-sm font-black text-white shadow-xl shadow-gray-100 transition-all hover:bg-rose-600 active:scale-95"
                  >
                    公式サイトを開く
                  </a>
                  <button className="flex h-16 w-full items-center justify-center rounded-2xl border border-rose-500 bg-white text-sm font-black text-rose-500 transition-all hover:bg-rose-50 active:scale-95">
                    ハピホテで空室確認
                  </button>
                </div>

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
