'use client';

import { CastConfig, CastItem } from '@/lib/store/storeTopConfig';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, Heart, RotateCcw, Search, Sparkles, Star } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import SectionTitle from '../components/SectionTitle';

interface CastSectionProps {
  config?: CastConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const CastSection: React.FC<CastSectionProps> = ({
  config,
  isEditing,
  onUpdate: _onUpdate,
  onImageUpload: _onImageUpload,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
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
    if (!selectedDate) {
      setSelectedDate(dates[0].date);
    }
  }, [dates, selectedDate]);

  const castList = config?.items || [];

  // フィルタリング & ソートロジック
  const filteredCasts = useMemo(() => {
    let result = [...castList];

    // 日付フィルター
    if (selectedDate) {
      result = result.filter((cast) => cast.schedule?.includes(selectedDate));
    }

    // 名前検索
    if (searchTerm) {
      result = result.filter((cast) => cast.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // ソート
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
        // IDが大きい順を新着とする（簡易的）
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return result;
  }, [castList, selectedDate, searchTerm, sortKey]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDate(dates[0].date);
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
        />

        {isEditing && (
          <div className="mb-8 rounded-3xl border border-rose-100 bg-rose-50/50 p-4 text-center text-[10px] font-bold text-rose-400 backdrop-blur-sm">
            ※ キャスト情報の管理はダッシュボードから行えます
          </div>
        )}

        {/* 検索・フィルターエリア */}
        <div className="mb-12 space-y-8">
          {/* 1. 日付検索 */}
          <div className="rounded-[2.5rem] border border-rose-50/50 bg-white p-2 shadow-sm">
            <div className="scrollbar-hide flex gap-2 overflow-x-auto p-1">
              {dates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`relative flex min-w-[70px] flex-col items-center justify-center rounded-[2rem] py-3 transition-all duration-300 ${
                    selectedDate === d.date
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                      : 'bg-transparent text-slate-400 hover:bg-rose-50'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    {d.isToday ? 'Today' : d.day}
                  </span>
                  <span className="text-lg font-black tracking-tight">{d.display}</span>
                  {selectedDate === d.date && (
                    <motion.div
                      layoutId="activeTag"
                      className="absolute -bottom-1 h-1 w-4 rounded-full bg-white opacity-50"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* 2. 名前検索 */}
            <div className="relative lg:col-span-7">
              <input
                type="text"
                placeholder="キャストの名前で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-[2rem] border-2 border-rose-50 bg-white py-4 pl-14 pr-6 text-sm font-bold text-slate-600 shadow-sm outline-none transition-all placeholder:text-slate-300 focus:border-rose-200 focus:ring-4 focus:ring-rose-100/20"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-rose-300" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-300 hover:text-rose-400"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* 3. 並び替え & リセット */}
            <div className="flex gap-2 lg:col-span-5">
              <div className="relative flex-1">
                <select
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
                className="flex items-center justify-center rounded-[2rem] border-2 border-rose-50 bg-white px-6 text-rose-300 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-95 md:px-8"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* キャストグリッド */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredCasts.map((cast: CastItem) => (
              <motion.div
                key={cast.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-rose-50/50 bg-white p-2 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-rose-100/50"
              >
                {/* 画像エリア */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem]">
                  <img
                    src={cast.imageUrl}
                    alt={cast.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* バッジ装飾 */}
                  <div className="absolute left-3 top-3 flex flex-col gap-2">
                    {cast.id % 3 === 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-rose-500 px-3 py-1 text-[9px] font-black text-white shadow-lg">
                        <Star className="h-3 w-3 fill-current" /> NEW
                      </span>
                    )}
                    <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[9px] font-black text-rose-500 backdrop-blur-sm">
                      <Heart className="h-3 w-3 fill-current" /> 本日出勤
                    </span>
                  </div>

                  {/* オーバーレイ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* 下部情報 */}
                  <div className="absolute bottom-4 left-4 right-4 translate-y-2 text-left text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest opacity-80">
                      {cast.height}cm / {cast.age}age
                    </p>
                    <h3 className="font-serif text-xl font-bold tracking-widest">{cast.name}</h3>
                  </div>
                </div>

                {/* 情報エリア */}
                <div className="flex flex-grow flex-col p-4">
                  <div className="mb-3 flex flex-wrap gap-1">
                    {cast.tags?.slice(0, 2).map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-full border border-rose-50 bg-rose-50/50 px-3 py-1 text-[8px] font-bold tracking-tight text-rose-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="mb-1 truncate text-center font-serif text-lg font-bold text-slate-700 group-hover:text-rose-500">
                    {cast.name}
                  </h3>

                  <p className="mb-4 line-clamp-2 text-center text-[10px] italic leading-relaxed text-slate-400">
                    "{cast.comment}"
                  </p>

                  <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 py-3 text-[10px] font-black uppercase tracking-widest text-rose-400 shadow-inner transition-all hover:bg-rose-500 hover:text-white active:scale-95">
                    <Sparkles className="h-3 w-3" /> Profile Detail
                  </button>
                </div>

                {/* イチゴの隠しアイコン（ホバー時） */}
                <div className="absolute -bottom-4 -right-4 h-12 w-12 rotate-12 opacity-0 transition-all duration-500 group-hover:opacity-20">
                  <span className="text-4xl">🍓</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 検索結果なし */}
        {filteredCasts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="mb-6 text-6xl opacity-20">🍓</div>
            <p className="text-lg font-bold text-slate-400">
              条件に合うセラピストが見つかりませんでした
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 text-sm font-bold text-rose-400 underline underline-offset-4 hover:text-rose-600"
            >
              条件をリセットする
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CastSection;
