import { fetchDailyCasts } from '@/actions/cast';
import { TodayCast } from '@/lib/getTodayCastsByStore';
import { CastConfig, CastItem } from '@/lib/store/storeTopConfig';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, RotateCcw, Search, Star } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import SectionTitle from '../components/SectionTitle';

interface CastSectionProps {
  config?: CastConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
  storeSlug?: string;
  todayCasts?: TodayCast[];
}

const CastSection: React.FC<CastSectionProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload: _onImageUpload,
  storeSlug = 'yokohama',
  todayCasts,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD

  // 初期データのマッピング
  const initialCasts = useMemo(() => {
    if (!todayCasts) return [];
    return todayCasts.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      age: c.age || 0,
      height: c.height || 0,
      weight: c.weight || 0,
      comment: c.catch_copy || '',
      status: '本日出勤',
      tags: c.tags || [],
      imageUrl: 
        c.main_image_url || 
        c.image_url || 
        'https://placehold.jp/24/cccccc/ffffff/300x400.png?text=No%20Image',
      schedule: [],
      mbtiType: c.mbti_name,
      faceType: c.face_name ? [c.face_name] : [],
      rating: c.rating,
      reviewCount: c.review_count,
      sexinessStrawberry: c.sexiness_strawberry,
      sexinessLevel: c.sexiness_level ?? 100,
      attendance: c.start_datetime && c.end_datetime 
        ? `${new Date(c.start_datetime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}〜${new Date(c.end_datetime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}`
        : 'お問い合わせください',
      isIchioshi: c.isIchioshi,
    }));
  }, [todayCasts]);

  const [fetchedCasts, setFetchedCasts] = useState<CastItem[]>(initialCasts);
  const [isLoading, setIsLoading] = useState(!todayCasts);
  const [sortKey, setSortKey] = useState<
    'default' | 'age-asc' | 'age-desc' | 'height-asc' | 'height-desc' | 'new'
  >('default');

  // 今日から10日分の日付を生成
  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const dayName = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
      arr.push({ date: dateStr, display: `${mm}/${dd}`, day: dayName, isToday: i === 0 });
    }
    return arr;
  }, []);

  // 初期選択を本日に設定
  useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      setSelectedDate(dates[0].date);
    }
  }, [dates, selectedDate]);

  // 日付変更時にデータフェッチ
  useEffect(() => {
    const loadCasts = async () => {
      if (!selectedDate) return;

      if (selectedDate === dates[0].date && todayCasts && todayCasts.length > 0) {
        setFetchedCasts(initialCasts);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchDailyCasts(storeSlug, selectedDate);

        const mappedCasts: CastItem[] = data.map((c: TodayCast) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          age: c.age || 0,
          height: c.height || 0,
          weight: c.weight || 0,
          comment: c.catch_copy || '',
          status: '本日出勤',
          tags: c.tags || [],
          imageUrl: 
            c.main_image_url || 
            c.image_url || 
            'https://placehold.jp/24/cccccc/ffffff/300x400.png?text=No%20Image',
          schedule: [selectedDate],
          mbtiType: c.mbti_name,
          faceType: c.face_name ? [c.face_name] : [],
          rating: c.rating,
          reviewCount: c.review_count,
          sexinessStrawberry: c.sexiness_strawberry,
          sexinessLevel: c.sexiness_level || 100,
          attendance: c.start_datetime && c.end_datetime 
            ? `${new Date(c.start_datetime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}〜${new Date(c.end_datetime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}`
            : 'お問い合わせください',
          isIchioshi: c.isIchioshi,
        }));
        setFetchedCasts(mappedCasts);
      } catch (e) {
        console.error('Failed to load casts', e);
        setFetchedCasts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCasts();
  }, [selectedDate, storeSlug, dates, todayCasts, initialCasts]);

  const displayCasts = fetchedCasts.length > 0 ? fetchedCasts : isLoading ? [] : [];

  const filteredCasts = useMemo(() => {
    let result = [...displayCasts];

    if (searchTerm) {
      result = result.filter((cast) => cast.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    switch (sortKey) {
      case 'age-asc':
        result.sort((a, b) => a.age - b.age);
        break;
      case 'age-desc':
        result.sort((a, b) => b.age - a.age);
        break;
      case 'height-asc':
        result.sort((a, b) => a.height - b.height);
        break;
      case 'height-desc':
        result.sort((a, b) => b.height - a.height);
        break;
      case 'new':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        break;
    }

    return result;
  }, [displayCasts, searchTerm, sortKey]);

  const resetFilters = () => {
    setSearchTerm('');
    if (dates.length > 0) setSelectedDate(dates[0].date);
    setSortKey('default');
  };

  return (
    <section id="cast" className="relative overflow-hidden bg-[#FFF9FA] py-16 md:py-24">
      {/* 背景装飾 */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-rose-100/30 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-rose-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          en={config?.subHeading || 'Strawberry Selection'}
          ja={config?.heading || '本日出勤のセラピスト'}
          imageUrl={config?.headingImageUrl}
          isEditing={isEditing}
          onUpdateEn={(val) => onUpdate?.('cast', 'subHeading', val)}
          onUpdateJa={(val) => onUpdate?.('cast', 'heading', val)}
          onImageUpload={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file && _onImageUpload) _onImageUpload('cast', file, 0, 'headingImageUrl');
            };
            input.click();
          }}
        />

        {isEditing && (
          <div className="mb-8 rounded-3xl border border-rose-100 bg-rose-50/50 p-4 text-center text-[10px] font-bold text-rose-400 backdrop-blur-sm">
            ※ キャスト情報の管理はダッシュボードから行えます
          </div>
        )}

        {/* 検索・フィルターエリア */}
        <div className="mb-12 space-y-8">
          <div className="rounded-[2.5rem] border border-rose-50/50 bg-white p-2 shadow-sm">
            <div className="flex gap-2 overflow-x-auto p-1 scrollbar-hide" role="tablist">
              {dates.map((d) => (
                <button
                  key={d.date}
                  role="tab"
                  aria-selected={selectedDate === d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`relative flex min-w-[70px] flex-col items-center justify-center rounded-[2rem] py-3 transition-all duration-300 ${
                    selectedDate === d.date
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                      : 'bg-transparent text-slate-500 hover:bg-rose-50'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    {d.isToday ? 'Today' : d.day}
                  </span>
                  <span className="text-lg font-black tracking-tight">{d.display}</span>
                  {selectedDate === d.date && (
                    <div className="absolute -bottom-1 h-1 w-4 rounded-full bg-white opacity-50" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="relative lg:col-span-7">
              <input
                type="text"
                placeholder="キャストの名前で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-[2rem] border-2 border-rose-50 bg-white py-4 pl-14 pr-6 text-sm font-bold text-slate-600 shadow-sm outline-none transition-all focus:border-rose-200"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-rose-300" />
              </div>
            </div>

            <div className="flex gap-2 lg:col-span-5">
              <div className="relative flex-1">
                <select
                  id="cast-sort"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as any)}
                  className="w-full appearance-none rounded-[2rem] border-2 border-rose-50 bg-white py-4 pl-6 pr-12 text-sm font-bold text-slate-600 shadow-sm outline-none transition-all focus:border-rose-200"
                >
                  <option value="default">並び替え：指定なし</option>
                  <option value="new">新着順</option>
                  <option value="age-asc">年齢が低い順</option>
                  <option value="age-desc">年齢が高い順</option>
                  <option value="height-desc">身長が高い順</option>
                  <option value="height-asc">身長が低い順</option>
                </select>
                <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2">
                  <ArrowUpDown className="h-4 w-4 text-rose-300" />
                </div>
              </div>
              <button
                onClick={resetFilters}
                className="flex items-center justify-center rounded-[2rem] border-2 border-rose-50 bg-white px-6 text-rose-300 transition-all hover:bg-rose-50 hover:text-rose-500"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* キャストカード一覧 */}
        <div className="md:px-0">
          <div className="grid grid-cols-2 gap-x-4 md:gap-x-10">
            {isLoading ? (
              <div className="col-span-full flex h-60 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500" />
              </div>
            ) : (
              <>
                {/* 左列 */}
                <div className="flex flex-col gap-y-10 md:gap-y-20">
                  <AnimatePresence mode="popLayout">
                    {filteredCasts
                      .filter((_, i) => i % 2 === 0)
                      .map((cast: CastItem) => (
                        <motion.div
                          key={cast.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4 }}
                          className="group relative flex flex-col overflow-hidden rounded-2xl border border-rose-50 bg-white shadow-soft transition-all duration-500 hover:shadow-luxury"
                        >
                          <Link
                            href={`/store/${storeSlug}/cast/${cast.slug || cast.id}`}
                            className="block h-full w-full"
                          >
                            <div className="relative aspect-[3/4] overflow-hidden">
                              <NextImage
                                src={cast.imageUrl}
                                alt={cast.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                              <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1.5">
                                <span className="flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-[9px] font-black text-white shadow-md">
                                  本日出勤
                                </span>
                                {cast.isIchioshi && (
                                  <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[9px] font-black text-white shadow-md">
                                    <Star className="h-2.5 w-2.5 fill-current" /> 店長一押し
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col p-4">
                              <div className="mb-2 flex items-end justify-between">
                                <h3 className="truncate text-base font-black text-slate-800 sm:text-lg">
                                  {cast.name}
                                </h3>
                                <span className="ml-2 flex-shrink-0 text-sm font-bold text-slate-400">
                                  {cast.age}歳
                                </span>
                              </div>

                              <div className="mb-3 flex flex-wrap gap-1.5">
                                {cast.mbtiType && (
                                  <span className="rounded-full border border-blue-100/50 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
                                    MBTI: {cast.mbtiType}
                                  </span>
                                )}
                                {cast.faceType && cast.faceType.length > 0 && (
                                  <span className="rounded-full border border-purple-100/50 bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-600">
                                    顔型: {cast.faceType.join(', ')}
                                  </span>
                                )}
                              </div>

                              {/* エロス係数 */}
                              <div className="mb-4 flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-500/80">
                                    エロス係数
                                  </span>
                                  <span className="text-[11px] font-bold text-rose-600">
                                    {cast.sexinessLevel ?? 100}%
                                  </span>
                                </div>
                                <div className="flex flex-col gap-[2px]">
                                  <div className="flex items-end gap-[1px] h-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((bar) => {
                                      const level = Math.ceil((cast.sexinessLevel ?? 100) / 10);
                                      const isActive = bar <= level;
                                      const getColor = () => {
                                        if (bar <= 4) return 'bg-emerald-400';
                                        if (bar <= 7) return 'bg-lime-400';
                                        if (bar <= 10) return 'bg-yellow-400';
                                        if (bar <= 13) return 'bg-orange-400';
                                        return 'bg-rose-500';
                                      };
                                      return (
                                        <div
                                          key={bar}
                                          className={`w-full rounded-sm transition-all duration-500 ${isActive ? getColor() : 'bg-neutral-100'}`}
                                          style={{ height: `${Math.min(100, (bar / 15) * 100 + 10)}%` }}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              {/* 評価セクション */}
                              {cast.reviewCount && cast.reviewCount > 0 ? (
                                <div className="mb-3 flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                  <span className="text-sm font-black text-slate-700">
                                    {(cast.rating || 0).toFixed(1)}
                                  </span>
                                  <span className="text-xs font-bold text-slate-400">
                                    ({cast.reviewCount})
                                  </span>
                                </div>
                              ) : (
                                <div className="mb-3 flex items-center gap-1 text-slate-400 text-[10px] font-bold border border-slate-200 bg-slate-50 px-2 py-0.5 rounded-md w-fit">
                                  評価はまだありません
                                </div>
                              )}

                              {/* 出勤時間 */}
                              <div className="mt-auto border-t border-rose-50 pt-3">
                                <div className="flex items-center justify-center gap-2 rounded-xl bg-orange-50/70 py-2.5">
                                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
                                  <span className="text-xs font-black tracking-widest text-orange-600">
                                    {cast.attendance}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>

                {/* 右列 (オフセットあり) */}
                <div className="mt-10 flex flex-col gap-y-10 md:mt-20 md:gap-y-20">
                  <AnimatePresence mode="popLayout">
                    {filteredCasts
                      .filter((_, i) => i % 2 === 1)
                      .map((cast: CastItem) => (
                        <motion.div
                          key={cast.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4 }}
                          className="group relative flex flex-col overflow-hidden rounded-2xl border border-rose-50 bg-white shadow-soft transition-all duration-500 hover:shadow-luxury"
                        >
                          <Link
                            href={`/store/${storeSlug}/cast/${cast.slug || cast.id}`}
                            className="block h-full w-full"
                          >
                            <div className="relative aspect-[3/4] overflow-hidden">
                              <NextImage
                                src={cast.imageUrl}
                                alt={cast.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                              <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1.5">
                                <span className="flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-[9px] font-black text-white shadow-md">
                                  本日出勤
                                </span>
                                {cast.isIchioshi && (
                                  <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[9px] font-black text-white shadow-md">
                                    <Star className="h-2.5 w-2.5 fill-current" /> 店長一押し
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col p-4">
                              <div className="mb-2 flex items-end justify-between">
                                <h3 className="truncate text-base font-black text-slate-800 sm:text-lg">
                                  {cast.name}
                                </h3>
                                <span className="ml-2 flex-shrink-0 text-sm font-bold text-slate-400">
                                  {cast.age}歳
                                </span>
                              </div>

                              <div className="mb-3 flex flex-wrap gap-1.5">
                                {cast.mbtiType && (
                                  <span className="rounded-full border border-blue-100/50 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
                                    MBTI: {cast.mbtiType}
                                  </span>
                                )}
                                {cast.faceType && cast.faceType.length > 0 && (
                                  <span className="rounded-full border border-purple-100/50 bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-600">
                                    顔型: {cast.faceType.join(', ')}
                                  </span>
                                )}
                              </div>

                              {/* エロス係数 */}
                              <div className="mb-4 flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-500/80">
                                    エロス係数
                                  </span>
                                  <span className="text-[11px] font-bold text-rose-600">
                                    {cast.sexinessLevel ?? 100}%
                                  </span>
                                </div>
                                <div className="flex flex-col gap-[2px]">
                                  <div className="flex items-end gap-[1px] h-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((bar) => {
                                      const level = Math.ceil((cast.sexinessLevel ?? 100) / 10);
                                      const isActive = bar <= level;
                                      const getColor = () => {
                                        if (bar <= 4) return 'bg-emerald-400';
                                        if (bar <= 7) return 'bg-lime-400';
                                        if (bar <= 10) return 'bg-yellow-400';
                                        if (bar <= 13) return 'bg-orange-400';
                                        return 'bg-rose-500';
                                      };
                                      return (
                                        <div
                                          key={bar}
                                          className={`w-full rounded-sm transition-all duration-500 ${isActive ? getColor() : 'bg-neutral-100'}`}
                                          style={{ height: `${Math.min(100, (bar / 15) * 100 + 10)}%` }}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              {/* 評価セクション */}
                              {cast.reviewCount && cast.reviewCount > 0 ? (
                                <div className="mb-3 flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                  <span className="text-sm font-black text-slate-700">
                                    {(cast.rating || 0).toFixed(1)}
                                  </span>
                                  <span className="text-xs font-bold text-slate-400">
                                    ({cast.reviewCount})
                                  </span>
                                </div>
                              ) : (
                                <div className="mb-3 flex items-center gap-1 text-slate-400 text-[10px] font-bold border border-slate-200 bg-slate-50 px-2 py-0.5 rounded-md w-fit">
                                  評価はまだありません
                                </div>
                              )}

                              {/* 出勤時間 */}
                              <div className="mt-auto border-t border-rose-50 pt-3">
                                <div className="flex items-center justify-center gap-2 rounded-xl bg-orange-50/70 py-2.5">
                                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
                                  <span className="text-xs font-black tracking-widest text-orange-600">
                                    {cast.attendance}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>

        {!isLoading && filteredCasts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-6xl opacity-20">🍓</div>
            <p className="text-lg font-bold text-slate-400">
              条件に合うセラピストが見つかりませんでした
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 text-sm font-bold text-rose-400 underline underline-offset-4 hover:text-rose-600"
            >
              条件をリセットする
            </button>
          </div>
        )}

        {/* もっと見るボタン */}
        {!isLoading && filteredCasts.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Link
              href={`/store/${storeSlug}/cast-list`}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-rose-500 px-10 py-4 font-black transition-all hover:bg-rose-600 active:scale-95"
            >
              <span className="relative z-10 text-sm tracking-[0.2em] text-white">もっと見る</span>
              <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CastSection;
