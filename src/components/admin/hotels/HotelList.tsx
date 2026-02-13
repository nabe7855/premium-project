'use client';

import { deleteHotel, getAreas, getCities, getHotels, getPrefectures } from '@/lib/lovehotelApi';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PencilIcon, PlusIcon } from '../admin-assets/Icons';

export default function HotelList() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterRating, setFilterRating] = useState('');

  // Location Filters
  const [prefectures, setPrefectures] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);

  const [filterPrefecture, setFilterPrefecture] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterArea, setFilterArea] = useState('');

  // Sort
  const [sortConfig, setSortConfig] = useState<{ column: string; ascending: boolean }>({
    column: 'created_at',
    ascending: false,
  });

  // Load Prefectures on mount
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const data = await getPrefectures();
        setPrefectures(data);
      } catch (e) {
        console.error(e);
      }
    };
    loadPrefs();
  }, []);

  // Load Cities when Prefecture changes
  useEffect(() => {
    const loadCitiesData = async () => {
      if (!filterPrefecture) {
        setCities([]);
        setFilterCity('');
        return;
      }
      try {
        const data = await getCities(filterPrefecture);
        setCities(data);
        setFilterCity(''); // Reset city selection
      } catch (e) {
        console.error(e);
      }
    };
    loadCitiesData();
  }, [filterPrefecture]);

  // Load Areas when City changes
  useEffect(() => {
    const loadAreasData = async () => {
      if (!filterCity) {
        setAreas([]);
        setFilterArea('');
        return;
      }
      try {
        const data = await getAreas(filterCity);
        setAreas(data);
        setFilterArea(''); // Reset area selection
      } catch (e) {
        console.error(e);
      }
    };
    loadAreasData();
  }, [filterCity]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      loadHotels();
    }, 500);
    return () => clearTimeout(timer);
  }, [
    filterKeyword,
    filterStatus,
    filterMinPrice,
    filterMaxPrice,
    filterRating,
    filterPrefecture,
    filterCity,
    filterArea,
    sortConfig,
  ]);

  const loadHotels = async () => {
    setLoading(true);
    try {
      const data = await getHotels({
        keyword: filterKeyword,
        status: filterStatus.length > 0 ? filterStatus : undefined,
        minRestPrice: filterMinPrice ? Number(filterMinPrice) : undefined,
        maxRestPrice: filterMaxPrice ? Number(filterMaxPrice) : undefined,
        minRating: filterRating ? Number(filterRating) : undefined,
        prefectureId: filterPrefecture || undefined,
        cityId: filterCity || undefined,
        areaId: filterArea || undefined,
        sort: sortConfig,
      });
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

  const toggleSort = (column: string) => {
    setSortConfig((prev) => ({
      column,
      ascending: prev.column === column ? !prev.ascending : true,
    }));
  };

  const toggleStatusFilter = (status: string) => {
    setFilterStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  };

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

      {/* Filter Bar */}
      <div className="space-y-4 rounded-xl border border-white/10 bg-brand-secondary p-4">
        {/* Row 1: Keyword & Status */}
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ホテル名、住所で検索..."
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: '公開中', value: 'published', color: 'bg-green-500/20 text-green-400' },
              { label: '下書き', value: 'draft', color: 'bg-yellow-500/20 text-yellow-400' },
              { label: '非公開', value: 'unpublished', color: 'bg-gray-500/20 text-gray-400' },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => toggleStatusFilter(status.value)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all sm:flex-none ${
                  filterStatus.includes(status.value)
                    ? status.color + ' ring-1 ring-inset ring-current'
                    : 'bg-brand-primary text-brand-text-secondary hover:bg-white/5'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Location Filters */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <select
            className="w-full rounded-lg border border-white/10 bg-brand-primary px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            value={filterPrefecture}
            onChange={(e) => setFilterPrefecture(e.target.value)}
          >
            <option value="">都道府県を選択</option>
            {prefectures.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-lg border border-white/10 bg-brand-primary px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            disabled={!filterPrefecture}
          >
            <option value="">市区町村を選択</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-lg border border-white/10 bg-brand-primary px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            disabled={!filterCity}
          >
            <option value="">エリアを選択</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Row 3: Price & Rating */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-xs text-brand-text-secondary">休憩料金:</span>
            <input
              type="number"
              placeholder="Min"
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-accent sm:w-24"
              value={filterMinPrice}
              onChange={(e) => setFilterMinPrice(e.target.value)}
            />
            <span className="text-white">~</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-accent sm:w-24"
              value={filterMaxPrice}
              onChange={(e) => setFilterMaxPrice(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="shrink-0 text-xs text-brand-text-secondary">最低評価:</span>
            <select
              className="w-full rounded-lg border border-white/10 bg-brand-primary px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-accent sm:w-auto"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <option value="">指定なし</option>
              <option value="3">★3以上</option>
              <option value="4">★4以上</option>
              <option value="4.5">★4.5以上</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-brand-text-secondary">読み込み中...</div>
      ) : (
        <div className="space-y-4">
          {/* Mobile Card Layout (Visible on small screens) */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="rounded-xl border border-white/10 bg-brand-secondary p-4 shadow-lg"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span
                    className={`rounded px-2 py-1 text-[10px] font-bold ${
                      hotel.status === 'published'
                        ? 'bg-green-500/20 text-green-400'
                        : hotel.status === 'draft'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {hotel.status === 'published'
                      ? '公開中'
                      : hotel.status === 'draft'
                        ? '下書き'
                        : '非公開'}
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-400">★</span>
                    <span className="font-bold text-white">{hotel.rating}</span>
                    <span className="text-xs text-brand-text-secondary">
                      ({hotel.review_count})
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="line-clamp-1 text-lg font-bold text-white">{hotel.name}</h3>
                  <p className="line-clamp-1 text-xs text-brand-text-secondary">{hotel.address}</p>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2 border-t border-white/5 pt-4 text-xs">
                  <div>
                    <p className="mb-1 text-brand-text-secondary">エリア</p>
                    <p className="truncate text-white">
                      {hotel.lh_prefectures?.name} / {hotel.lh_cities?.name}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-brand-text-secondary">価格 (休憩/宿泊)</p>
                    <p className="text-white">
                      ¥{hotel.min_price_rest?.toLocaleString()} / ¥
                      {hotel.min_price_stay?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-white/5 pt-3">
                  <Link
                    href={`/admin/admin/hotels/${hotel.id}`}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-white/10 py-2 text-sm font-bold text-white transition-all hover:bg-white/20"
                  >
                    <PencilIcon />
                    <span>編集</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(hotel.id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-400/10 py-2 text-sm font-bold text-red-400 transition-all hover:bg-red-400/20"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>削除</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout (Hidden on small screens) */}
          <div className="hidden overflow-hidden rounded-xl border border-white/10 bg-brand-secondary shadow-xl lg:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-brand-text-secondary">
                  <th
                    className="cursor-pointer px-6 py-4 font-semibold hover:text-white"
                    onClick={() => toggleSort('status')}
                  >
                    ステータス{' '}
                    {sortConfig.column === 'status' && (sortConfig.ascending ? '▲' : '▼')}
                  </th>
                  <th
                    className="cursor-pointer px-6 py-4 font-semibold hover:text-white"
                    onClick={() => toggleSort('name')}
                  >
                    ホテル名 {sortConfig.column === 'name' && (sortConfig.ascending ? '▲' : '▼')}
                  </th>
                  <th className="px-6 py-4 font-semibold">エリア</th>
                  <th
                    className="cursor-pointer px-6 py-4 font-semibold hover:text-white"
                    onClick={() => toggleSort('min_price_rest')}
                  >
                    価格 (休憩/宿泊){' '}
                    {sortConfig.column === 'min_price_rest' && (sortConfig.ascending ? '▲' : '▼')}
                  </th>
                  <th
                    className="cursor-pointer px-6 py-4 font-semibold hover:text-white"
                    onClick={() => toggleSort('rating')}
                  >
                    評価 {sortConfig.column === 'rating' && (sortConfig.ascending ? '▲' : '▼')}
                  </th>
                  <th className="px-6 py-4 text-right font-semibold">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {hotels.map((hotel) => (
                  <tr key={hotel.id} className="text-white transition-colors hover:bg-white/5">
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs ${
                          hotel.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : hotel.status === 'draft'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {hotel.status === 'published'
                          ? '公開中'
                          : hotel.status === 'draft'
                            ? '下書き'
                            : '非公開'}
                      </span>
                    </td>
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
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
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
              </tbody>
            </table>
          </div>

          {hotels.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-brand-secondary p-10 text-center text-brand-text-secondary">
              ホテルが見つかりませんでした
            </div>
          )}
        </div>
      )}
    </div>
  );
}
