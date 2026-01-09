'use client';

import {
  createHotel,
  deleteStorageImages,
  getAmenities,
  getAreas,
  getCities,
  getHotelById,
  getPrefectures,
  getServices,
  updateHotel,
  uploadHotelImage,
} from '@/lib/lovehotelApi';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PlusIcon } from '../admin-assets/Icons';

interface HotelFormProps {
  id?: string;
}

export default function HotelForm({ id }: HotelFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Master data
  const [prefectures, setPrefectures] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [allAmenities, setAllAmenities] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState<any>({
    name: '',
    prefecture_id: '',
    city_id: '',
    area_id: '',
    address: '',
    phone: '',
    website: '',
    image_url: '', // Legacy single image
    rest_price_min_weekday: '',
    rest_price_max_weekday: '',
    rest_price_min_weekend: '',
    rest_price_max_weekend: '',
    stay_price_min_weekday: '',
    stay_price_max_weekday: '',
    stay_price_min_weekend: '',
    stay_price_max_weekend: '',
    description: '',
    distance_from_station: '',
    room_count: '',
    place_id: '',
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Image state
  const [images, setImages] = useState<
    { id?: string; url?: string; file?: File; category: string; previewUrl?: string }[]
  >([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    loadMasters();
    if (id) loadHotel();
  }, [id]);

  useEffect(() => {
    if (formData.prefecture_id) loadCities(formData.prefecture_id);
    else setCities([]);
  }, [formData.prefecture_id]);

  useEffect(() => {
    if (formData.city_id) loadAreas(formData.city_id);
    else setAreas([]);
  }, [formData.city_id]);

  const loadMasters = async () => {
    try {
      const [prefs, amens, servs] = await Promise.all([
        getPrefectures(),
        getAmenities(),
        getServices(),
      ]);
      setPrefectures(prefs);
      setAllAmenities(amens);
      setAllServices(servs);
    } catch (error) {
      console.error(error);
      toast.error('マスタデータの読み込みに失敗しました');
    }
  };

  const loadCities = async (prefId: string) => {
    try {
      const data = await getCities(prefId);
      setCities(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadAreas = async (cityId: string) => {
    try {
      const data = await getAreas(cityId);
      setAreas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadHotel = async () => {
    try {
      const hotel = await getHotelById(id!);
      setFormData({
        name: hotel.name || '',
        prefecture_id: hotel.prefecture_id || '',
        city_id: hotel.city_id || '',
        area_id: hotel.area_id || '',
        address: hotel.address || '',
        phone: hotel.phone || '',
        website: hotel.website || '',
        image_url: hotel.image_url || '',
        rest_price_min_weekday: hotel.rest_price_min_weekday || '',
        rest_price_max_weekday: hotel.rest_price_max_weekday || '',
        rest_price_min_weekend: hotel.rest_price_min_weekend || '',
        rest_price_max_weekend: hotel.rest_price_max_weekend || '',
        stay_price_min_weekday: hotel.stay_price_min_weekday || '',
        stay_price_max_weekday: hotel.stay_price_max_weekday || '',
        stay_price_min_weekend: hotel.stay_price_min_weekend || '',
        stay_price_max_weekend: hotel.stay_price_max_weekend || '',
        description: hotel.description || '',
        distance_from_station: hotel.distance_from_station || '',
        room_count: hotel.room_count || '',
        place_id: hotel.place_id || '',
      });
      setSelectedAmenities(hotel.lh_hotel_amenities.map((a: any) => a.amenity_id));
      setSelectedServices(hotel.lh_hotel_services.map((s: any) => s.service_id));
      setImages(
        hotel.lh_hotel_images.map((img: any) => ({
          id: img.id,
          url: img.url,
          category: img.category,
          previewUrl: img.url,
        })),
      );
    } catch (error) {
      console.error(error);
      toast.error('ホテル情報の読み込みに失敗しました');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        category: 'other',
        previewUrl: URL.createObjectURL(file),
      }));
      setImages([...images, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    const target = images[index];
    if (target.url) {
      setImagesToDelete([...imagesToDelete, target.url]);
    }
    if (target.previewUrl && !target.url) URL.revokeObjectURL(target.previewUrl);
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImageCategory = (index: number, category: string) => {
    const newImages = [...images];
    newImages[index].category = category;
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Current form data:', formData);

      // 0. Delete removed images from storage
      if (imagesToDelete.length > 0) {
        console.log('Deleting images from storage:', imagesToDelete);
        await deleteStorageImages(imagesToDelete);
      }

      console.log('Processing images...');

      // 1. Upload new files
      const finalImages: { url: string; category: string }[] = [];
      for (const img of images) {
        if (img.file) {
          const url = await uploadHotelImage(img.file);
          finalImages.push({ url, category: img.category });
        } else if (img.url) {
          finalImages.push({ url: img.url, category: img.category });
        }
      }

      const submitData = { ...formData };

      // Legacy price support: populate from Weekday Min
      if (submitData.rest_price_min_weekday) {
        submitData.min_price_rest = submitData.rest_price_min_weekday;
      }
      if (submitData.stay_price_min_weekday) {
        submitData.min_price_stay = submitData.stay_price_min_weekday;
      }

      if (!submitData.area_id) delete submitData.area_id;

      // Update legacy single image url to the first exterior image if exists
      if (finalImages.length > 0 && !submitData.image_url) {
        const exterior = finalImages.find((i) => i.category === 'exterior') || finalImages[0];
        submitData.image_url = exterior.url;
      }

      if (id) {
        await updateHotel(id, submitData, selectedAmenities, selectedServices, finalImages);
        toast.success('更新しました');
      } else {
        await createHotel(submitData, selectedAmenities, selectedServices, finalImages);
        toast.success('作成しました');
      }
      router.push('/admin/admin/hotels');
    } catch (error) {
      console.error(error);
      toast.error('保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(id)) setList(list.filter((i) => i !== id));
    else setList([...list, id]);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      <div className="space-y-6 rounded-xl border border-white/10 bg-brand-secondary p-6">
        <h2 className="mb-4 text-xl font-bold text-white">基本情報</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-brand-text-secondary">
              ホテル名 *
            </label>
            <input
              type="text"
              required
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-brand-text-secondary">
              都道府県 *
            </label>
            <select
              required
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              value={formData.prefecture_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prefecture_id: e.target.value,
                  city_id: '',
                  area_id: '',
                })
              }
            >
              <option value="">選択してください</option>
              {prefectures.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-brand-text-secondary">
              市区町村 *
            </label>
            <select
              required
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              value={formData.city_id}
              onChange={(e) => setFormData({ ...formData, city_id: e.target.value, area_id: '' })}
              disabled={!formData.prefecture_id}
            >
              <option value="">選択してください</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-brand-text-secondary">
              エリア
            </label>
            <select
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              value={formData.area_id}
              onChange={(e) => setFormData({ ...formData, area_id: e.target.value })}
              disabled={!formData.city_id}
            >
              <option value="">選択してください</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-brand-text-secondary">住所</label>
            <input
              type="text"
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-brand-text-secondary">
              Google Place ID
            </label>
            <input
              type="text"
              placeholder="例: ChIJN1t_tDeuEmsRUsoyG83VY2o"
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              value={formData.place_id}
              onChange={(e) => setFormData({ ...formData, place_id: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-brand-text-secondary">
              電話番号
            </label>
            <input
              type="tel"
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-brand-text-secondary">
              公式サイトURL
            </label>
            <input
              type="url"
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-brand-text-secondary">
              代表画像URL (省略可: 画像管理の1枚目が自動設定されます)
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-brand-text-secondary">
              アクセス
            </label>
            <input
              type="text"
              placeholder="例: 新宿駅より徒歩5分"
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              value={formData.distance_from_station}
              onChange={(e) => setFormData({ ...formData, distance_from_station: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-xl border border-white/10 bg-brand-secondary p-6">
        <h2 className="mb-4 text-xl font-bold text-white">画像管理</h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-brand-primary"
            >
              <img src={img.previewUrl} alt="preview" className="h-32 w-full object-cover" />
              <div className="space-y-2 p-2">
                <select
                  className="w-full rounded border border-white/10 bg-brand-secondary px-1 py-1 text-[10px] text-white"
                  value={img.category}
                  onChange={(e) => updateImageCategory(idx, e.target.value)}
                >
                  <option value="exterior">外観</option>
                  <option value="room">室風</option>
                  <option value="water">水回り</option>
                  <option value="interior">内装</option>
                  <option value="other">その他</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="w-full rounded bg-red-400/20 py-1 text-[10px] text-red-400 transition-colors hover:bg-red-400/30"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
          <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 transition-colors hover:bg-white/5">
            <PlusIcon />
            <span className="mt-2 text-xs text-brand-text-secondary">画像を追加</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      <div className="space-y-6 rounded-xl border border-white/10 bg-brand-secondary p-6">
        <h2 className="mb-4 text-xl font-bold text-white">詳細・料金</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* 休憩・宿泊区分け - 平日・休日・最安・最高 */}
          <div className="grid grid-cols-1 gap-6 md:col-span-3 md:grid-cols-2 lg:grid-cols-4">
            {/* 休憩 - 平日 */}
            <div className="space-y-4 rounded-lg bg-white/5 p-4">
              <h3 className="mb-2 text-sm font-bold text-white">休憩 (平日)</h3>
              <div>
                <label className="mb-1 block text-xs text-brand-text-secondary">最安値</label>
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-brand-primary px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  value={formData.rest_price_min_weekday || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, rest_price_min_weekday: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-brand-text-secondary">最高値</label>
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-brand-primary px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  value={formData.rest_price_max_weekday || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, rest_price_max_weekday: e.target.value })
                  }
                />
              </div>
            </div>

            {/* 休憩 - 休日 */}
            <div className="space-y-4 rounded-lg bg-white/5 p-4">
              <h3 className="mb-2 text-sm font-bold text-white">休憩 (休日)</h3>
              <div>
                <label className="mb-1 block text-xs text-brand-text-secondary">最安値</label>
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-brand-primary px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  value={formData.rest_price_min_weekend || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, rest_price_min_weekend: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-brand-text-secondary">最高値</label>
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-brand-primary px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  value={formData.rest_price_max_weekend || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, rest_price_max_weekend: e.target.value })
                  }
                />
              </div>
            </div>

            {/* 宿泊 - 平日 */}
            <div className="space-y-4 rounded-lg bg-white/5 p-4">
              <h3 className="mb-2 text-sm font-bold text-white">宿泊 (平日)</h3>
              <div>
                <label className="mb-1 block text-xs text-brand-text-secondary">最安値</label>
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-brand-primary px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  value={formData.stay_price_min_weekday || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, stay_price_min_weekday: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-brand-text-secondary">最高値</label>
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-brand-primary px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  value={formData.stay_price_max_weekday || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, stay_price_max_weekday: e.target.value })
                  }
                />
              </div>
            </div>

            {/* 宿泊 - 休日 */}
            <div className="space-y-4 rounded-lg bg-white/5 p-4">
              <h3 className="mb-2 text-sm font-bold text-white">宿泊 (休日)</h3>
              <div>
                <label className="mb-1 block text-xs text-brand-text-secondary">最安値</label>
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-brand-primary px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  value={formData.stay_price_min_weekend || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, stay_price_min_weekend: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-brand-text-secondary">最高値</label>
                <input
                  type="number"
                  className="w-full rounded border border-white/10 bg-brand-primary px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  value={formData.stay_price_max_weekend || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, stay_price_max_weekend: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-brand-text-secondary">
              客室数
            </label>
            <input
              type="number"
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              value={formData.room_count}
              onChange={(e) => setFormData({ ...formData, room_count: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-brand-text-secondary">説明文</label>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-6 rounded-xl border border-white/10 bg-brand-secondary p-6">
        <h2 className="mb-4 text-xl font-bold text-white">設備・サービス</h2>

        <div>
          <label className="mb-3 block text-sm font-medium text-brand-text-secondary">
            アメニティ
          </label>
          <div className="flex flex-wrap gap-2">
            {allAmenities.map((amen) => (
              <button
                key={amen.id}
                type="button"
                onClick={() => toggleItem(amen.id, selectedAmenities, setSelectedAmenities)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedAmenities.includes(amen.id)
                    ? 'scale-105 bg-brand-accent text-white shadow-lg'
                    : 'bg-white/5 text-brand-text-secondary hover:bg-white/10'
                }`}
              >
                {amen.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-brand-text-secondary">
            サービス
          </label>
          <div className="flex flex-wrap gap-2">
            {allServices.map((serv) => (
              <button
                key={serv.id}
                type="button"
                onClick={() => toggleItem(serv.id, selectedServices, setSelectedServices)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedServices.includes(serv.id)
                    ? 'scale-105 bg-brand-accent text-white shadow-lg'
                    : 'bg-white/5 text-brand-text-secondary hover:bg-white/10'
                }`}
              >
                {serv.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg bg-white/5 px-6 py-2 text-white transition-colors hover:bg-white/10"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-accent px-8 py-2 font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
        >
          {loading ? '保存中...' : id ? '更新する' : '登録する'}
        </button>
      </div>
    </form>
  );
}
