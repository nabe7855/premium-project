'use client';

import { submitReview } from '@/lib/lovehotelApi';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';

const PHOTO_CATEGORIES = [
  { id: 'room', label: 'お部屋' },
  { id: 'exterior', label: '外観' },
  { id: 'plumbing', label: '水回り' },
  { id: 'floor', label: '床・内装' },
  { id: 'food', label: '食事・アメニティ' },
  { id: 'other', label: 'その他' },
];

export default function ReviewFormClient({ hotelId }: { hotelId: string }) {
  const router = useRouter();
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
    design: 5,
    facilities: 5,
    rooms: 5,
    value: 5,
    content: '',
  });

  const [tempPhotos, setTempPhotos] = useState<
    { id: string; file: File; data: string; category: string }[]
  >([]);
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
          hotelId: hotelId,
          userName: formData.userName || '匿名ユーザー',
          roomNumber: formData.roomNumber,
          stayType: formData.stayType,
          cost: formData.cost ? parseInt(formData.cost) : undefined,
          rating: formData.rating,
          cleanliness: formData.cleanliness,
          service: formData.service,
          design: formData.design,
          facilities: formData.facilities,
          rooms: formData.rooms,
          value: formData.value,
          content: formData.content,
        },
        tempPhotos.map((p) => ({ file: p.file, category: p.category })),
      );

      setIsFormOpen(false);
      setFormData({
        userName: '',
        roomNumber: '',
        stayType: 'rest',
        cost: '',
        rating: 5,
        cleanliness: 5,
        service: 5,
        design: 5,
        facilities: 5,
        rooms: 5,
        value: 5,
        content: '',
      });
      setTempPhotos([]);
      alert('口コミを投稿しました。ありがとうございました！');

      // Refresh the page to show the new review (since Sweet Stay uses Server Components)
      router.refresh();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('口コミの投稿に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">Reports & Reviews</h2>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            プロフェッショナルな視点とユーザー体験
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 rounded-2xl bg-rose-500 px-6 py-3 font-black text-white shadow-xl transition-all hover:bg-rose-600 active:scale-95 md:px-8"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
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
                    { key: 'design', label: 'デザイン' },
                    { key: 'facilities', label: '設備' },
                    { key: 'rooms', label: '部屋' },
                    { key: 'value', label: '価格' },
                  ].map((item) => (
                    <div key={item.key} className="text-center">
                      <div className="mb-1 text-[8px] font-black text-gray-400">{item.label}</div>
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
                  <div key={photo.id} className="group relative duration-300 animate-in zoom-in-50">
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
    </div>
  );
}
