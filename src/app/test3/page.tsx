'use client';
import FilterSidebar from '@/components/lovehotels/FilterSidebar';
import HotelCard from '@/components/lovehotels/HotelCard';
import Layout from '@/components/lovehotels/Layout';
import PrefectureExplorer from '@/components/lovehotels/PrefectureExplorer';
import SearchHero from '@/components/lovehotels/SearchHero';
import { MOCK_FEATURES, MOCK_HOTELS, MOCK_REVIEWS, PREFECTURES, SERVICES } from '@/data/lovehotels';
import { FeatureArticle, Review } from '@/types/lovehotels';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Link,
  Route,
  HashRouter as Router,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

const PHOTO_CATEGORIES = [
  { id: 'room', label: 'お部屋' },
  { id: 'exterior', label: '外観' },
  { id: 'plumbing', label: '水回り' },
  { id: 'floor', label: '床・内装' },
  { id: 'food', label: '食事・アメニティ' },
  { id: 'other', label: 'その他' },
];

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const BackButton = ({ to, label }: { to?: string; label: string }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="group mb-6 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm transition-all hover:border-rose-500 hover:bg-rose-500 hover:text-white active:scale-95"
    >
      <svg
        className="h-4 w-4 transition-transform group-hover:-translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
};

const HomePage = () => (
  <div className="duration-500 animate-in fade-in">
    <SearchHero />
    <PrefectureExplorer />

    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">人気のホテル</h2>
          <button className="text-sm font-bold text-rose-500 hover:underline">すべて見る</button>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_HOTELS.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  </div>
);

const FeatureCard = ({ feature }: { feature: FeatureArticle }) => (
  <Link
    to={`/prefecture/${feature.prefectureId}/feature/${feature.id}`}
    className="group block overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all hover:shadow-2xl"
  >
    <div className="relative aspect-[16/9] overflow-hidden">
      <img
        src={feature.imageUrl}
        alt={feature.title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="mb-2 flex gap-2">
          {feature.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-black uppercase text-white backdrop-blur-md"
            >
              #{tag}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-black leading-tight text-white transition-colors group-hover:text-rose-300">
          {feature.title}
        </h3>
      </div>
    </div>
    <div className="p-5">
      <p className="line-clamp-2 text-sm font-medium leading-relaxed text-gray-500">
        {feature.summary}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
          {feature.date}
        </span>
        <span className="flex items-center gap-1 text-xs font-black text-rose-500">
          READ MORE
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  </Link>
);

const FeatureListPage = () => {
  const { prefId } = useParams<{ prefId: string }>();
  const prefecture = PREFECTURES.find((p) => p.id === prefId);
  const features = MOCK_FEATURES.filter((f) => f.prefectureId === prefId);

  if (!prefecture) {
    return (
      <div className="py-20 text-center font-bold text-gray-400">
        都道府県が見つかりませんでした
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <BackButton to={`/prefecture/${prefId}`} label={`${prefecture.name}へ戻る`} />

        <div className="mb-12">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-1 w-12 rounded-full bg-rose-500"></span>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-rose-500">
              Special Guide
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">
            {prefecture.name}の特集記事一覧
          </h1>
          <p className="mt-4 font-medium text-gray-500">
            地元のトレンドやおすすめの過ごし方を、編集部が詳しくレポート。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
          {features.length === 0 && (
            <div className="col-span-full rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
              <p className="font-bold italic text-gray-400">
                現在、このエリアの特集記事は準備中です。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PrefecturePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const prefecture = PREFECTURES.find((p) => p.id === id);
  const localFeatures = MOCK_FEATURES.filter((f) => f.prefectureId === id);

  if (!prefecture) {
    return (
      <div className="py-20 text-center font-bold text-gray-400">
        都道府県が見つかりませんでした
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <BackButton to="/" label="日本全土へ戻る" />

        <div className="mb-12">
          <div className="flex items-baseline gap-4">
            <h1 className="text-4xl font-black text-gray-900">{prefecture.name}</h1>
            <span className="font-bold text-gray-400">からホテルを探す</span>
          </div>
          <p className="mt-2 font-medium text-gray-500">
            {prefecture.count}件のホテルが登録されています
          </p>
        </div>

        {/* 特集セクション */}
        {localFeatures.length > 0 && (
          <section className="mb-20">
            <div className="mb-8 flex items-center justify-between border-l-8 border-rose-500 pl-4">
              <h2 className="text-2xl font-black tracking-tighter text-gray-900">ご当地特集記事</h2>
              <Link
                to={`/prefecture/${id}/features`}
                className="group flex items-center gap-1 text-xs font-black text-rose-500 hover:text-rose-600"
              >
                すべての記事を見る
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {localFeatures.slice(0, 3).map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          </section>
        )}

        <h2 className="mb-8 border-l-8 border-rose-500 pl-4 text-2xl font-black tracking-tighter text-gray-900">
          エリアから絞り込む
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {prefecture.cities.map((city) => (
            <div
              key={city.id}
              className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 transition-colors group-hover:text-rose-500">
                  {city.name}
                </h2>
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-500">
                  {city.count}件
                </span>
              </div>

              <div className="space-y-3">
                <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-300">
                  人気エリア
                </div>
                <div className="flex flex-wrap gap-2">
                  {city.areas?.map((area) => (
                    <button
                      key={area}
                      onClick={() => navigate(`/search?pref=${id}&city=${city.id}&area=${area}`)}
                      className="rounded-xl border border-transparent bg-gray-50 px-4 py-2 text-sm font-bold text-gray-600 transition-all hover:bg-rose-500 hover:text-white"
                    >
                      {area}
                    </button>
                  ))}
                  <button
                    onClick={() => navigate(`/search?pref=${id}&city=${city.id}`)}
                    className="rounded-xl border-2 border-rose-100 px-4 py-2 text-sm font-black text-rose-500 transition-all hover:bg-rose-50"
                  >
                    すべて見る
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-20">
          <h2 className="mb-8 border-l-8 border-rose-500 pl-4 text-2xl font-black tracking-tighter text-gray-900">
            このエリアで人気のホテル
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_HOTELS.filter((h) => h.prefecture === prefecture.name).map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const FeatureDetailPage = () => {
  const { prefId, featureId } = useParams<{ prefId: string; featureId: string }>();
  const feature = MOCK_FEATURES.find((f) => f.id === featureId);
  const relatedHotels = MOCK_HOTELS.filter((h) => feature?.relatedHotelIds.includes(h.id));

  if (!feature) {
    return (
      <div className="py-20 text-center font-bold text-gray-400">記事が見つかりませんでした</div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[60vh] overflow-hidden">
        <img src={feature.imageUrl} alt={feature.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
        <div className="absolute left-8 top-8 z-10">
          <BackButton to={`/prefecture/${prefId}/features`} label="記事一覧へ戻る" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto max-w-4xl">
            <h1 className="mb-4 text-3xl font-black leading-tight tracking-tighter text-gray-900 md:text-5xl">
              {feature.title}
            </h1>
            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
              <span>{feature.date}</span>
              <span className="h-1 w-1 rounded-full bg-gray-200"></span>
              <div className="flex gap-2">
                {feature.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-8 py-16">
        <div className="prose prose-rose prose-xl max-w-none space-y-8 font-medium leading-relaxed text-gray-700">
          {feature.content.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph.trim()}</p>
          ))}
        </div>

        {relatedHotels.length > 0 && (
          <div className="mt-20 border-t border-gray-100 pt-20">
            <h2 className="mb-10 text-2xl font-black tracking-tighter text-gray-900">
              この記事で紹介したホテル
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {relatedHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SearchResultsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const prefId = searchParams.get('pref');
  const prefecture = PREFECTURES.find((p) => p.id === prefId);
  const [sortBy, setSortBy] = useState('price_asc');

  const sortedHotels = useMemo(() => {
    let hotels = [...MOCK_HOTELS];

    // 都道府県が指定されている場合はフィルタリング
    if (prefecture) {
      hotels = hotels.filter((h) => h.prefecture === prefecture.name);
    }

    switch (sortBy) {
      case 'price_asc':
        return hotels.sort((a, b) => a.minPriceRest - b.minPriceRest);
      case 'price_desc':
        return hotels.sort((a, b) => b.minPriceRest - a.minPriceRest);
      case 'rating_desc':
        return hotels.sort((a, b) => b.rating - a.rating);
      case 'review_desc':
        return hotels.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'newest':
        return hotels.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      default:
        return hotels;
    }
  }, [sortBy, prefecture]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {prefecture ? (
          <BackButton to={`/prefecture/${prefId}`} label={`${prefecture.name}へ戻る`} />
        ) : (
          <BackButton to="/" label="トップへ戻る" />
        )}

        {/* 上部配置の開閉式フィルター */}
        <FilterSidebar onFilterChange={() => {}} />

        <div className="mb-8 mt-8 flex flex-col items-start justify-between gap-4 rounded-[2rem] border border-gray-100 bg-white px-8 py-5 shadow-sm md:flex-row md:items-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
            <span className="mr-2 font-black text-gray-900">{sortedHotels.length} 件</span>
            のホテルが見つかりました
          </p>
          <div className="flex w-full items-center gap-4 md:w-auto">
            <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-gray-300">
              並び替え:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full cursor-pointer rounded-xl border-none bg-gray-50 px-5 py-2.5 text-xs font-black outline-none focus:ring-2 focus:ring-rose-500 md:w-auto"
            >
              <option value="price_asc">料金が安い順</option>
              <option value="price_desc">料金が高い順</option>
              <option value="rating_desc">評価が高い順</option>
              <option value="review_desc">口コミ数が多い順</option>
              <option value="newest">新着順</option>
            </select>
          </div>
        </div>

        {/* ホテル一覧をワイドに表示 */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
          {sortedHotels.length === 0 && (
            <div className="col-span-full rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
              <p className="font-bold italic text-gray-400">
                条件に合うホテルが見つかりませんでした。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HotelDetailPage = () => {
  const hotel = MOCK_HOTELS[0];
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    userName: '',
    roomNumber: '',
    stayType: 'rest' as 'lodging' | 'rest',
    cost: '',
    rating: 5,
    cleanliness: 5,
    service: 5,
    rooms: 5,
    value: 5,
    content: '',
  });

  const [tempPhotos, setTempPhotos] = useState<{ id: string; data: string; category: string }[]>(
    [],
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempPhotos((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substr(2, 9),
              data: reader.result as string,
              category: 'room',
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updatePhotoCategory = (id: string, newCategory: string) => {
    setTempPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, category: newCategory } : p)));
  };

  const removePhoto = (id: string) => {
    setTempPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = {
      id: `r${Date.now()}`,
      hotelId: hotel.id,
      userName: formData.userName || '匿名ユーザー',
      roomNumber: formData.roomNumber,
      stayType: formData.stayType,
      cost: formData.cost ? parseInt(formData.cost) : undefined,
      rating: formData.rating,
      cleanliness: formData.cleanliness,
      service: formData.service,
      rooms: formData.rooms,
      value: formData.value,
      content: formData.content,
      date: new Date().toISOString().split('T')[0],
      photos: tempPhotos.map((p) => ({ url: p.data, category: p.category })),
    };

    setReviews([newReview, ...reviews]);
    setIsFormOpen(false);
    setFormData({
      userName: '',
      roomNumber: '',
      stayType: 'rest',
      cost: '',
      rating: 5,
      cleanliness: 5,
      service: 5,
      rooms: 5,
      value: 5,
      content: '',
    });
    setTempPhotos([]);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="relative h-[400px] md:h-[500px]">
        <img src={hotel.imageUrl} alt={hotel.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute left-8 top-8 z-10">
          <BackButton label="前のページへ戻る" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-12">
          <div className="container mx-auto">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-rose-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                Premium Hotel
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                {hotel.area}
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-black drop-shadow-md md:text-5xl">{hotel.name}</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex text-xl text-yellow-400">
                  {'★★★★★'.split('').map((_, i) => (
                    <span
                      key={i}
                      className={i < Math.floor(hotel.rating) ? 'opacity-100' : 'opacity-30'}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-2xl font-black">{hotel.rating}</span>
                <span className="text-sm opacity-70">({reviews.length}件の口コミ)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <section>
              <h2 className="mb-6 border-l-8 border-rose-500 pl-4 text-2xl font-black tracking-tighter">
                HOTEL INFO
              </h2>
              <p className="mb-8 text-lg font-medium leading-loose text-gray-600">
                {hotel.description}
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {SERVICES.map((service, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 rounded-2xl border p-3 transition-all ${hotel.services.includes(service) ? 'border-rose-100 bg-rose-50 text-rose-600' : 'border-gray-100 bg-gray-50 text-gray-300 opacity-50'}`}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-tight">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section id="reviews">
              <div className="mb-8 flex items-center justify-between border-l-8 border-rose-500 pl-4">
                <h2 className="text-2xl font-black tracking-tighter">REVIEWS</h2>
                <button
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className="flex items-center gap-2 rounded-2xl bg-rose-500 px-8 py-3 font-black text-white shadow-xl transition-all hover:bg-rose-600 active:scale-95"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  {isFormOpen ? 'キャンセル' : '口コミを投稿'}
                </button>
              </div>

              {isFormOpen && (
                <div className="mb-12 rounded-3xl border-2 border-rose-100 bg-white p-6 shadow-2xl duration-500 animate-in slide-in-from-top-4 md:p-10">
                  <form onSubmit={handleSubmitReview} className="space-y-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                          Username
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-2xl border-2 border-transparent bg-gray-50 px-5 py-3 font-bold outline-none transition-all focus:border-rose-500 focus:bg-white"
                          placeholder="匿名ユーザー"
                          value={formData.userName}
                          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                          Room Number
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-2xl border-2 border-transparent bg-gray-50 px-5 py-3 font-bold outline-none transition-all focus:border-rose-500 focus:bg-white"
                          placeholder="例: 201号室"
                          value={formData.roomNumber}
                          onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                          Cost (JPY)
                        </label>
                        <input
                          type="number"
                          className="w-full rounded-2xl border-2 border-transparent bg-gray-50 px-5 py-3 font-bold outline-none transition-all focus:border-rose-500 focus:bg-white"
                          placeholder="利用金額を入力"
                          value={formData.cost}
                          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-8 md:flex-row">
                      <div className="flex-1 space-y-4">
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                          Type of Stay
                        </label>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, stayType: 'rest' })}
                            className={`flex-1 rounded-2xl border-2 py-4 font-black transition-all ${formData.stayType === 'rest' ? 'border-rose-500 bg-rose-500 text-white shadow-lg' : 'border-gray-100 bg-white text-gray-400 hover:border-rose-200'}`}
                          >
                            休憩
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, stayType: 'lodging' })}
                            className={`flex-1 rounded-2xl border-2 py-4 font-black transition-all ${formData.stayType === 'lodging' ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg' : 'border-gray-100 bg-white text-gray-400 hover:border-indigo-200'}`}
                          >
                            宿泊
                          </button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="mb-4 block text-xs font-black uppercase tracking-widest text-gray-400">
                          Ratings
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { key: 'rating', label: '総合' },
                            { key: 'cleanliness', label: '清掃' },
                            { key: 'service', label: '接客' },
                            { key: 'rooms', label: '部屋' },
                            { key: 'value', label: '価格' },
                          ].map((item) => (
                            <div key={item.key} className="text-center">
                              <div className="mb-1 text-[8px] font-black text-gray-400">
                                {item.label}
                              </div>
                              <select
                                className="w-full rounded-lg border-none bg-gray-50 p-2 text-xs font-black outline-none focus:ring-2 focus:ring-rose-500"
                                value={(formData as any)[item.key]}
                                onChange={(e) =>
                                  setFormData({ ...formData, [item.key]: parseInt(e.target.value) })
                                }
                              >
                                {[5, 4, 3, 2, 1].map((v) => (
                                  <option key={v} value={v}>
                                    {v}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                          Photos & Categories
                        </label>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1 text-xs font-black text-rose-500 hover:text-rose-600"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          写真を追加
                        </button>
                      </div>

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {tempPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            className="group relative duration-300 animate-in zoom-in-50"
                          >
                            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-gray-100 bg-gray-50">
                              <img src={photo.data} className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removePhoto(photo.id)}
                                className="absolute right-2 top-2 rounded-full bg-rose-500 p-1 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                              >
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                            <select
                              className="mt-2 w-full cursor-pointer rounded-lg border-none bg-gray-50 p-2 text-[10px] font-black outline-none focus:ring-2 focus:ring-rose-500"
                              value={photo.category}
                              onChange={(e) => updatePhotoCategory(photo.id, e.target.value)}
                            >
                              {PHOTO_CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                        Comment
                      </label>
                      <textarea
                        className="h-40 w-full resize-none rounded-2xl border-2 border-transparent bg-gray-50 px-5 py-4 font-medium outline-none transition-all focus:border-rose-500 focus:bg-white"
                        placeholder="お部屋の清潔感やサービス、また利用したい点など自由に記入してください"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 py-5 text-lg font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:-translate-y-1 hover:shadow-rose-200/50 active:scale-95"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              )}

              <div className="space-y-10">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                      <div className="flex items-center gap-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-100 to-rose-200 text-2xl font-black text-rose-500 shadow-inner">
                          {review.userName[0]}
                        </div>
                        <div>
                          <div className="mb-1 flex flex-wrap items-center gap-3">
                            <span className="text-xl font-black tracking-tight text-gray-900">
                              {review.userName}
                            </span>
                            <span
                              className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${review.stayType === 'lodging' ? 'bg-indigo-50 text-indigo-500' : 'bg-green-50 text-green-500'}`}
                            >
                              {review.stayType === 'lodging' ? '宿泊' : '休憩'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold tracking-tighter text-gray-300">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl bg-rose-50 px-6 py-3">
                        <span className="text-3xl leading-none text-rose-500 drop-shadow-sm">
                          ★
                        </span>
                        <span className="–none text-2xl font-black text-rose-600">
                          {review.rating}.0
                        </span>
                      </div>
                    </div>

                    <p className="mb-8 text-lg font-medium italic leading-relaxed text-gray-700">
                      "{review.content}"
                    </p>

                    {review.photos && review.photos.length > 0 && (
                      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {review.photos.map((photo, i) => (
                          <div
                            key={i}
                            className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg"
                          >
                            <img
                              src={photo.url}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute left-2 top-2 rounded-lg bg-black/40 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                              {PHOTO_CATEGORIES.find((c) => c.id === photo.category)?.label ||
                                'その他'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
                <div className="relative">
                  <div className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                    Store Information
                  </div>
                  <div className="space-y-6">
                    <div className="group">
                      <div className="mb-2 text-[10px] font-black uppercase text-rose-300">
                        Location
                      </div>
                      <div className="mb-3 text-sm font-bold leading-relaxed text-gray-900">
                        {hotel.address}
                      </div>
                    </div>
                    <div className="group">
                      <div className="mb-2 text-[10px] font-black uppercase text-rose-300">
                        Phone
                      </div>
                      <div className="text-xl font-black tracking-tighter text-gray-900">
                        {hotel.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/prefecture/:id" element={<PrefecturePage />} />
          <Route path="/prefecture/:prefId/features" element={<FeatureListPage />} />
          <Route path="/prefecture/:prefId/feature/:featureId" element={<FeatureDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/hotel/:id" element={<HotelDetailPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
