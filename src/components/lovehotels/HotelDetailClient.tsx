'use client';

import { SERVICES } from '@/data/lovehotels';
import { getReviews, submitReview } from '@/lib/lovehotelApi';
import { Hotel, Review } from '@/types/lovehotels';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const PHOTO_CATEGORIES = [
  { id: 'room', label: 'お部屋' },
  { id: 'exterior', label: '外観' },
  { id: 'plumbing', label: '水回り' },
  { id: 'floor', label: '床・内装' },
  { id: 'food', label: '食事・アメニティ' },
  { id: 'other', label: 'その他' },
];

export default function HotelDetailClient({ hotel }: { hotel: Hotel }) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [tempPhotos, setTempPhotos] = useState<
    { id: string; file: File; data: string; category: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews(hotel.id);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [hotel.id]);

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
              file: file,
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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate character count
    if (formData.content.length < 250) {
      alert(`感想文は250文字以上入力してください。（現在: ${formData.content.length}文字）`);
      return;
    }

    setIsSubmitting(true);

    try {
      await submitReview(
        {
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
        },
        tempPhotos.map((p) => ({ file: p.file, category: p.category })),
      );

      // Refresh list
      const updatedReviews = await getReviews(hotel.id);
      setReviews(updatedReviews);

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
      alert('口コミを投稿しました。ありがとうございました！');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('口コミの投稿に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: hotel.name,
    description: hotel.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hotel.address,
      addressLocality: hotel.city,
      addressRegion: hotel.prefecture,
      addressCountry: 'JP',
    },
    telephone: hotel.phone,
    url: hotel.website,
    image: hotel.imageUrl,
    starRating: {
      '@type': 'Rating',
      ratingValue: hotel.rating,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: hotel.rating,
      reviewCount: reviews.length || hotel.reviewCount || 1,
    },
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="relative h-[400px] md:h-[500px]">
        <img src={hotel.imageUrl} alt={hotel.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute left-8 top-8 z-10">
          <button
            onClick={() => router.back()}
            className="group mb-6 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm transition-all hover:border-rose-500 hover:bg-rose-500 hover:text-white active:scale-95"
          >
            ← 前のページへ戻る
          </button>
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
                <span className="text-2xl font-black">{hotel.rating.toFixed(1)}</span>
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

              <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-gray-50 p-6 transition-all hover:bg-gray-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    客室数
                  </span>
                  <p className="mt-1 text-2xl font-black text-gray-900">
                    {hotel.roomCount || '-'}室
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-6 transition-all hover:bg-gray-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    駐車場
                  </span>
                  <p className="mt-1 text-2xl font-black text-gray-900">完備</p>
                </div>
                <div className="col-span-2 rounded-2xl bg-rose-50 p-6 transition-all hover:bg-rose-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                    アクセス
                  </span>
                  <p className="mt-1 line-clamp-2 text-sm font-black text-rose-900">
                    {hotel.distanceFromStation || '最寄り駅より好アクセス'}
                  </p>
                </div>
              </div>

              <p className="mb-8 whitespace-pre-wrap text-lg font-medium leading-loose text-gray-600">
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

            <section>
              <h2 className="mb-6 border-l-8 border-rose-500 pl-4 text-2xl font-black tracking-tighter">
                PRICING & PLANS
              </h2>
              {hotel.priceDetails && hotel.priceDetails.length > 0 ? (
                <div className="space-y-8">
                  {hotel.priceDetails.map((cat: any, idx: number) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl"
                    >
                      <div className="bg-gray-950 px-8 py-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                          Category
                        </span>
                        <h3 className="text-lg font-black text-white">{cat.category}</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-gray-50 bg-gray-50/50">
                              <th className="whitespace-nowrap px-8 py-4 text-[10px] font-black tracking-widest text-gray-400">
                                プラン名
                              </th>
                              <th className="whitespace-nowrap px-8 py-4 text-[10px] font-black tracking-widest text-gray-400">
                                時間帯 / 滞在
                              </th>
                              <th className="whitespace-nowrap px-8 py-4 text-[10px] font-black tracking-widest text-gray-400">
                                料金
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {cat.plans.map((plan: any, pIdx: number) => (
                              <tr key={pIdx} className="transition-colors hover:bg-gray-50/80">
                                <td className="px-8 py-6">
                                  <p className="font-black text-gray-900">{plan.title}</p>
                                  {plan.note && (
                                    <p className="mt-1 text-[10px] font-bold text-rose-500">
                                      {plan.note}
                                    </p>
                                  )}
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex flex-col gap-1 text-sm font-bold text-gray-600">
                                    {plan.time && (
                                      <div className="flex items-center gap-1">
                                        <svg
                                          className="h-3 w-3 opacity-50"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                          ></path>
                                        </svg>
                                        {plan.time}
                                      </div>
                                    )}
                                    {plan.stay && (
                                      <div className="flex items-center gap-1">
                                        <svg
                                          className="h-3 w-3 opacity-50"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                          ></path>
                                        </svg>
                                        最大 {plan.stay}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <p className="text-2xl font-black text-rose-500">
                                    {plan.price ? `${plan.price}` : '-'}
                                  </p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-950 text-white">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">
                          利用タイプ
                        </th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">
                          平日 最安料金
                        </th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">
                          休日 最安料金
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-8 py-6">
                          <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
                            REST
                          </span>
                          <p className="mt-2 font-black text-gray-900">休憩</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-2xl font-black text-rose-500">
                            {hotel.restPriceMinWeekday
                              ? `¥${hotel.restPriceMinWeekday.toLocaleString()}〜`
                              : 'ASK'}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-2xl font-black text-rose-500">
                            {hotel.restPriceMinWeekend
                              ? `¥${hotel.restPriceMinWeekend.toLocaleString()}〜`
                              : 'ASK'}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-8 py-6">
                          <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">
                            STAY
                          </span>
                          <p className="mt-2 font-black text-gray-900">宿泊</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-2xl font-black text-rose-500">
                            {hotel.stayPriceMinWeekday
                              ? `¥${hotel.stayPriceMinWeekday.toLocaleString()}〜`
                              : 'ASK'}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-2xl font-black text-rose-500">
                            {hotel.stayPriceMinWeekend
                              ? `¥${hotel.stayPriceMinWeekend.toLocaleString()}〜`
                              : 'ASK'}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="bg-gray-50 px-8 py-4">
                    <p className="text-[10px] font-bold italic text-gray-400">
                      ※料金は時期やプランにより変動する場合があります。詳細はホテルへお問い合わせください。
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-6 border-l-8 border-rose-500 pl-4 text-2xl font-black tracking-tighter">
                GALLERY
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {hotel.images && hotel.images.length > 0 ? (
                  hotel.images.map((image, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square overflow-hidden rounded-[2rem] bg-gray-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                      <img
                        src={image.url}
                        alt={`${hotel.name} - ${image.category}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                        {PHOTO_CATEGORIES.find((c) => c.id === image.category)?.label || 'その他'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center font-bold italic text-gray-400">
                    画像はまだありません。
                  </div>
                )}
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
                                ✕
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
                      <textarea
                        className="w-full rounded-3xl border-2 border-transparent bg-gray-50 px-6 py-5 font-medium outline-none transition-all focus:border-rose-500 focus:bg-white"
                        rows={5}
                        placeholder="ホテルの感想を自由に記入してください"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      />
                      <div className="flex justify-end px-4">
                        <span
                          className={`text-[10px] font-black tracking-widest ${
                            formData.content.length < 250 ? 'text-rose-500' : 'text-green-500'
                          }`}
                        >
                          {formData.content.length} / 250文字以上
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-2xl bg-rose-500 py-5 text-sm font-black uppercase tracking-widest text-white shadow-2xl shadow-rose-200 transition-all hover:-translate-y-1 hover:bg-rose-600 active:scale-95 disabled:bg-gray-400"
                    >
                      {isSubmitting ? '投稿中...' : '口コミを投稿する'}
                    </button>
                  </form>
                </div>
              )}

              <div className="space-y-8">
                {isLoading ? (
                  <div className="py-20 text-center font-bold text-gray-400">
                    口コミを読み込み中...
                  </div>
                ) : reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
                    >
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-xl font-black text-rose-500">
                            {review.userName[0]}
                          </div>
                          <div>
                            <div className="font-black text-gray-900">{review.userName}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                              {review.date} • {review.stayType === 'rest' ? '休憩利用' : '宿泊利用'}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex text-yellow-400">
                            {'★★★★★'.split('').map((_, i) => (
                              <span
                                key={i}
                                className={i < review.rating ? 'opacity-100' : 'opacity-20'}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          {review.roomNumber && (
                            <span className="text-[10px] font-bold text-gray-400">
                              利用: {review.roomNumber}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Itemized Ratings */}
                      <div className="mb-6 grid grid-cols-2 gap-4 rounded-2xl bg-gray-50 p-4 sm:grid-cols-4">
                        {[
                          { label: '清掃', score: review.cleanliness },
                          { label: '接客', score: review.service },
                          { label: '部屋', score: review.rooms },
                          { label: '価格', score: review.value },
                        ].map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <span className="mb-1 text-[10px] font-black uppercase text-gray-400">
                              {item.label}
                            </span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((v) => (
                                <div
                                  key={v}
                                  className={`h-1.5 w-3 rounded-full ${v <= (item.score || 0) ? 'bg-rose-400' : 'bg-gray-200'}`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="mb-6 text-lg font-medium leading-loose text-gray-600">
                        {review.content}
                      </p>

                      {/* Review Photos */}
                      {review.photos && review.photos.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                          {review.photos.map((photo, idx) => (
                            <div
                              key={idx}
                              className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
                            >
                              <img
                                src={photo.url}
                                alt={`Review photo ${idx}`}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute bottom-2 left-2 rounded-full bg-black/40 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                                {PHOTO_CATEGORIES.find((c) => c.id === photo.category)?.label ||
                                  'その他'}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center font-bold text-gray-400">
                    まだ口コミはありません。最初の口コミを投稿しませんか？
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
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
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all hover:bg-rose-50 hover:text-rose-500"
                  >
                    Google Mapで見る
                  </a>
                </div>
                <div className="group">
                  <div className="mb-2 text-[10px] font-black uppercase text-rose-300">Phone</div>
                  <div className="text-xl font-black tracking-tighter text-gray-900">
                    {hotel.phone}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
