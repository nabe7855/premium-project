'use client';

import { deleteHotel, getHotels } from '@/lib/lovehotelApi';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PencilIcon, PlusIcon } from '../admin-assets/Icons';

export default function HotelList() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const data = await getHotels();
      setHotels(data);
    } catch (error) {
      console.error(error);
      toast.error('ホテルの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      await deleteHotel(id);
      toast.success('削除しました');
      loadHotels();
    } catch (error) {
      console.error(error);
      toast.error('削除に失敗しました');
    }
  };

  if (loading) return <div className="text-white">読み込み中...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">ホテル一覧</h2>
        <Link
          href="/admin/admin/hotels/new"
          className="flex items-center gap-2 rounded-lg bg-brand-accent px-4 py-2 text-white transition-opacity hover:opacity-90"
        >
          <PlusIcon />
          <span>新規追加</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-brand-secondary shadow-xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-brand-text-secondary">
              <th className="px-6 py-4 font-semibold">ホテル名</th>
              <th className="px-6 py-4 font-semibold">エリア</th>
              <th className="px-6 py-4 font-semibold">価格 (休憩/宿泊)</th>
              <th className="px-6 py-4 font-semibold">評価</th>
              <th className="px-6 py-4 text-right font-semibold">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {hotels.map((hotel) => (
              <tr key={hotel.id} className="text-white transition-colors hover:bg-white/5">
                <td className="px-6 py-4">
                  <div className="font-bold">{hotel.name}</div>
                  <div className="text-xs text-brand-text-secondary">{hotel.address}</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {hotel.lh_prefectures?.name} / {hotel.lh_cities?.name}{' '}
                  {hotel.lh_areas?.name ? `/ ${hotel.lh_areas.name}` : ''}
                </td>
                <td className="px-6 py-4 text-sm">
                  ¥{hotel.min_price_rest?.toLocaleString()} / ¥
                  {hotel.min_price_stay?.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span>{hotel.rating}</span>
                    <span className="text-xs text-brand-text-secondary">
                      ({hotel.review_count})
                    </span>
                  </div>
                </td>
                <td className="space-x-2 px-6 py-4 text-right">
                  <Link
                    href={`/admin/admin/hotels/${hotel.id}`}
                    className="inline-flex rounded-lg p-2 text-brand-text-secondary transition-all hover:bg-white/10 hover:text-white"
                  >
                    <PencilIcon />
                  </Link>
                  <button
                    onClick={() => handleDelete(hotel.id)}
                    className="inline-flex rounded-lg p-2 text-red-400 transition-all hover:bg-red-400/10 hover:text-red-300"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {hotels.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-brand-text-secondary">
                  ホテルが登録されていません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
